var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');
var breadcrumbs = require('express-breadcrumbs');
var productsController = require('../controllers/productsController');
var categoriesController = require('../controllers/categoriesController');
var customerController = require('../controllers/customersController');
var suppliersController = require('../controllers/suppliersController');

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

router.get('/danhmucsanpham', (req, res)=>{
    //Lay toan bo san pham hien co
    categoriesController.getAll(function(categories){
        req.breadcrumbs('Tất cả danh mục', '/admin/danhmucsanpham');
        res.render('danhmucsanpham', { 
            breadcrumbs: req.breadcrumbs(), 
            categories : categories,
            title: 'Tất cả danh mục'
        });
    });
})


router.get('/taikhoankhachhang', (req, res)=>{
    //Lay toan bo san pham hien co
    customerController.getAll(function(customers){
        req.breadcrumbs('Tài khoản khách hàng', '/admin/taikhoankhachhang');
        res.render('taikhoankhachhang', { 
            breadcrumbs: req.breadcrumbs(), 
            customers : customers,
            title: 'Tài khoản khách hàng'
        });
    });
})


//1553002
//Note: Nho gọi hàm lồng nhau, bởi nó dùng callback nên ko thể gọi hàm này xong mới tới hàm kia
router.get('/sanpham/them', (req, res)=>{
    req.breadcrumbs('Tất cả sản phẩm', '/admin/sanpham');

    //Lay toan bo danh muc san pham
    categoriesController.getAll((categories)=>{
  
        //Lay toan bo danh sach nha cung cap
        suppliersController.getAll((suppliers)=>{
            res.render('them-san-pham', { 
                breadcrumbs: req.breadcrumbs(),
                title: 'Chi tiết sản phẩm',
                categories: categories,
                suppliers : suppliers
            });
        })
    });
});

//1553025 - CRUD danh muc san pham
router.post('/', function (req, res) {
    categoriesController.create(req.body.id, req.body.category, function (categories) {
        res.sendStatus(201);
        res.end();
    });
});

router.delete('/:id', function (req, res) {
    categoriesController.destroy(req.params.id, function (categories) {
        res.sendStatus(204);
        res.end();
    });
});

router.put('/:id', function(req, res){
    categoriesController.update(req.params.id, req.body.category, function (categories) {
        res.sendStatus(200);
        res.end();
    });
});


module.exports = router;