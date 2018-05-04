var express = require('express');
var router = express.Router();

var categoriesController = require('../controllers/categoriesController');
var productsController = require('../controllers/productsController');

var getAllCategories = (req, res) => {
    var isLogin = req.isAuthenticated();
    var username = null;
    
    if (isLogin){
        username = req.session.passport.user;
    }

    categoriesController.getAll(function (categories) {
        req.breadcrumbs('Sản phẩm', '/product');
        res.render('product', {
            title: 'Sản phẩm',
            categories: categories,
            breadcrumbs: req.breadcrumbs(),
            user: username
        });
    });
}


router.get('/', getAllCategories);

router.get('/:id', function (req, res) {
    //console.log(req);
    categoriesController.getAllProductById(req.params.id, function (category) {
        var page = parseInt(req.query.page);
        if(isNaN(page)){
            page = 1;
        }

        var limit = 12;
        var pagination = {
            limit: limit,
            page: page,
            totalRows: category.Products.length
        }
        var offset = (page - 1) * limit;
        category.Products = category.Products.slice(offset, offset + limit);

        //console.log(category);
       
        categoriesController.getAll(function (categories) {
            //res.send(category);
            req.breadcrumbs('Sản phẩm', '/product');
            req.breadcrumbs(category.categoryName, '/product/'+category.id);
            res.render('product', {
                title: 'Sản phẩm-' + category.categoryName,
                categories: categories,
                category: category,
                breadcrumbs: req.breadcrumbs()
            });
        });
    });
})

router.get('/:id/:productID', function (req, res) {
    var isLogin = req.isAuthenticated();
    var username = null;
    
    if (isLogin){
        username = req.session.passport.user;
    }
    
    productsController.getProductDetailById(req.params.productID, function (product) {
      
        req.breadcrumbs('Sản phẩm', '/product');
        req.breadcrumbs(req.params.id, '/product/'+req.params.id);
        req.breadcrumbs(product.name);
        function getDay(date){
            console.log(date);
            var tmp = new Date(date);
            var day = tmp.getDate();
        }
       // res.send(product.createAt);
        getDay(product.createdAt);
        
        console.log(product.ProductDetails);
        res.render('product_detail',{
            title: 'Sản phẩm-' + product.name,
            product: product,
            breadcrumbs: req.breadcrumbs(),
            user: username
        })
    });
})

module.exports = router;