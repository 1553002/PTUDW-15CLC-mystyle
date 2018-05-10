var express = require('express');
var router = express.Router();

var handlerGeneral = require('./general');
var categoriesController = require('../controllers/categoriesController');
var productsController = require('../controllers/productsController');
var categoriesController = require('../controllers/categoriesController');

/* GET home page. */
router.get('/', function (req, res, next) {

  categoriesController.getAllCategoryWithProduct(function(cate){
    res.render('index', { 
      title: 'Trang chủ', 
      categories : cate,
      number_of_items: handlerGeneral.get_quantity_of_items(req, res),
    });
  })
});

module.exports = router;
