var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');

/* GET users listing. */
router.get('/:id', (req, res, next) => {
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
  models.User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  }).then(user => {
    if (user) {
      if (!user.token) {
        user.token = "alirgvesilgunaergnulanlkae";
        user.save();
      }

      res.json({ status: true, content: user });
    } else {
      res.json({ status: true, content: "usuario no existe" });
    }
  });
});

module.exports = router;