var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  console.log(req.params.id);
  object.get('User', req.params.id, 1, null)
    .then(response => {
      res.json({
        status: true,
        content: response
      });
    })
    .catch(response => {
      res.json({
        status: false,
        content: response
      });
    });
});

router.post('/save', function (req, res, next) {
  object.save([
    'firstName',
    'lastName',
    'email',
    'password',
    { birthday: 'Date' }
  ], req.body, 1, null)
    .then(response => {
      res.json({
        status: true,
        content: response
      });
    })
    .catch(response => {
      res.json({
        status: false,
        content: response
      });
    });
});

module.exports = router;