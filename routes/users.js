var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');
var crypto = require('crypto');

/* GET users listing. */
router.get('/:id', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.get('User', req.params.id, 1, null)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.post('/save', (req, res, next) => {
  object.save([
    'firstName',
    'lastName',
    'email',
    'password',
    { birthday: 'Date' }
  ], req.body, 'User')
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      console.log(response);
      res.json({ status: false, content: response });
    });
});

router.put('/save/:id', (req, res, next) => {
  req.body.id = req.params.id;
  object.update([
    'firstName',
    'lastName',
    'email',
    'password',
    { birthday: 'Date' }
  ], req.body, 'User')
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.delete('/delete/:id', (req, res, next) => {
  object.delete('User', req.params.id)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.post('/login', (req, res, next) => {
  var passwordHash = crypto.createHmac('sha256', config.crypto.salt)
    .update(req.body.password)
    .digest('hex');

  models.User.findOne({
    where: {
      email: req.body.email,
      password: passwordHash
    }
  }).then(user => {
    if (user) {
      if (!user.token) {
        user.token = crypto.createHmac('sha256', config.crypto.salt)
          .update((Math.random() * 1000 + ""))
          .digest('hex');

        user.save();
      }

      res.json({ status: true, content: user });
    } else {
      res.json({ status: false, content: "usuario no existe" });
    }
  });
});

module.exports = router;