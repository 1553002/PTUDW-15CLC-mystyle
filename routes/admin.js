var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');
var breadcrumbs = require('express-breadcrumbs');
var productsController = require('../controllers/productsController');

router.use(breadcrumbs.init());
// Set Breadcrumbs home information 
router.use(breadcrumbs.setHome({
    name: 'Home',
    url: '/admin'
}));

router.all('/*', function (req, res, next) {
    //Kiem tra da dang nhap hay chua
    //var isLogin = req.session.passport.user;

    req.app.locals.layout = 'admin_layout'; // set your layout here
    next(); // pass control to the next handler
});

router.get('/', (req, res)=>{
    res.render('admin', {layout:'admin_layout'});
})

router.get('/dangnhap', (req, res)=>{
    res.render("dangnhap", {layout: false});
});

router.get('/dangki', (req, res)=>{
    res.render("dangki", {layout: false});
});

router.get('/sanpham', (req, res)=>{
    //Lay toan bo san pham hien co
    productsController.getAll(function(products){
        
        // var page = parseInt(req.query.page);
        // if(isNaN(page)){
        //     page = 1;
        // }

        // var limit = 12;
        // var pagination = {
        //     limit: limit,
        //     page: page,
        //     totalRows: products.length
        // }

        // var offset = (page - 1) * limit;
        // products = products.slice(offset, offset + limit);

        req.breadcrumbs('Tất cả sản phẩm', '/admin/sanpham');
        res.render('sanpham', { 
            breadcrumbs: req.breadcrumbs(), 
            products : products,
            title: 'Tất cả sản phẩm'
        });
    });
})

router.get('/sanpham/them', (req, res)=>{
    req.breadcrumbs('Tất cả sản phẩm', '/admin/sanpham');
    res.render('them-san-pham', { 
        breadcrumbs: req.breadcrumbs(),
        title: 'Chi tiết sản phẩm'
    });
});


module.exports = router;