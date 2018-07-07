var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');

/* GET users listing. */
router.get('/:id', (req, res, next) => {
  object.get('Category', req.params.id, 1, null)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.get('/:id/products', (req, res, next) => {
  let include = {};
  include.id = [{ model: models.Product, as: 'Products' }];
  
  object.get('Category', req.params.id, 1, include)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.post('/save', (req, res, next) => {
  object.save(['name', 'description'], req.body, 'Category')
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.put('/save/:id', (req, res, next) => {
  req.body.id = req.params.id;
  object.update(['name', 'description'], req.body, 'Category')
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.delete('/delete/:id', (req, res, next) => {
  object.delete('Category', req.params.id)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

module.exports = router;