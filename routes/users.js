var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  console.log(object);
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

module.exports = router;
