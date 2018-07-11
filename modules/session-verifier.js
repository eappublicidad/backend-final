var models = require('../models'),
        config = require('../config/config'),
        userUtils = require('../modules/userUtils'),
        random = require('randomstring');

var util = {};

/**
 * @description obtiene la session viva
 * @param {models\User} user must be Live objets points to user
 * @param {Request} req is a obnject than represents user request from express
 * @param {Callback} callback callback to report results
 * */
util.getSession = (user, req, callback) => {
    var sessionValues = {
        user: user.id,
        device: req.device.type,
        agent: req.device.parser.useragent,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, // Get IP - allow for proxy
        referrer: req.headers['referrer'] || '', //  Likewise for referrer
        token: random.generate(config.session.tokenLenght),
        expires: new Date(Date.now() + config.session.expire),
        data: {}
    };

    if (user)
        models.Session
                .findAll({where: {user: user.id}, order: [['updatedAt', 'DESC']]})
                .then(results => {
                    session = null;
                    if (results && results.length > 0) {
                        results = util.reduceSessions(results);
                        session = results.pop();

                        //FIX: reescriture del token activo que produce 
                        //des-autenticacion de dispositivos con session activa
                        delete sessionValues.token;

                        //rewrite all values
                        for (var i in sessionValues)
                            session[i] = sessionValues[i];

                        session
                                .save()
                                .then(session => {
                                    if (typeof callback === 'function')
                                        callback(session);
                                });

                    } else
                        models.Session.create(sessionValues).then(callback);
                });
};

util.getSessionByToken = (token, fn) => {
    return new Promise((resolve, reject) => {
        models.Session
                .findOne({where: {token: token}})
                .then(session => {
                    if (session) {
                        //updates session expires
                        session.expires = new Date(Date.now() + config.session.expire);
                        session.save();

                        //busca el usuario
                        models.User
                                .findOne({
                                    include: [
                                        {model: models.Profile, as: 'Profile', include: [{model: models.File, as: 'Picture'}]},
                                        {model: models.BankAccount, as: 'Bank'},
                                        {model: models.Score, as: 'Score'},
                                        {model: models.Session, as: 'Sessions'},
                                        {model: models.Role, as: 'Roles',
                                            include: [
                                                {model: models.Permission, as: 'Permissions'}
                                            ]
                                        }
                                    ],
                                    where: {id: session.user}
                                })
                                .then(user => {
                                    return userUtils.getLastLocation(user)
                                            .then(location => {
                                                if (location)
                                                    user.location = location.location;

                                                resolve({user: user, session: session});
                                            });
                                })
                                .catch(m => {
                                    resolve(false);
                                });
                    } else
                        resolve(false);
                });
    });
};

/**
 * @description borra todas las sessiones de exceso que tenga el usuario
 * @param {Array} sessions debe ser un arreglo con instancias de models/Session para ser eliminadas
 * */
util.reduceSessions = sessions => {
    var toDelete = sessions.slice(config.application.maxSessionsPerUser, sessions.length - 1);
    var notDelete = sessions.slice(0, config.application.maxSessionsPerUser - 1);
    if (typeof (sessions) === 'Array')
        if (sessions.length > config.application.maxSessionsPerUser)
            for (var i in toDelete)
                toDelete[i].destroy();
    return notDelete;
};

util.restoreSessionFix = (req, res, next) => {
    req.query = req.query || req.body || {};
    let qEmpty = true;
    for (var i in req.query) {
        qEmpty = false;
        break;
    }
    let bEmpty = true;
    for (var i in req.body) {
        bEmpty = false;
        break;
    }
    if (qEmpty && !bEmpty)
        req.query = req.body;

    if (req.query['_'])
        delete req.query['_'];

    res.header('X-Powered-By', config.application.xPowerBy);

    req.session.device = req.device.type;
    req.session.agent = req.device.parser.useragent;
    req.session.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get IP - allow for proxy
    req.session.referrer = req.headers['referrer'] || ''; //  Likewise for referrer

    /*pequeña trampa pq la sesison es debil y se peirde con facilidad*/
    if (req.header('Authorization')) {
        req.session.token = req.header('Authorization').split(' ').pop();
        util.getSessionByToken(req.session.token)
                .then(result => {
                    if (result) {
                        req.session.user = result.user;
                        req.session.data = result.session;
                    }
                    next();
                });
    } else
        next();
};

module.exports = util;