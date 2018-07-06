/* global models */

//se define passport global para usarlo en todos los routes
passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;

passport.use(new Strategy((token, done) => {
    models.Session
        .findOne({ where: { token: token } })
        .then(session => {
            done(null, !!session);
        });
}
));
