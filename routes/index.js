var express = require('express');
var router = express.Router();

var handlerGeneral = require('./general');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { 
    title: 'Trang chủ', 
    number_of_items: handlerGeneral.get_quantity_of_items(req, res) 
  });
});

module.exports = router;
