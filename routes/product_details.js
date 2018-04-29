// var express = require('express');
// var router = express.Router();

// var categoriesController = require('../controllers/categoriesController');

// var getProductDetail = (req, res) => {
//     var isLogin = req.isAuthenticated();
//     var username = null;
    
//     if (isLogin){
//         username = req.session.passport.user;
//     }

//     categoriesController.getById(req.params.id, function (product) {
//         req.breadcrumbs('Sản phẩm', '/product');
//         res.render('product', {
//             categories: categories,
//             breadcrumbs: req.breadcrumbs(),
//             user: username
//         });
//     });
// }


// router.get('/', getAllCategories);

// router.get('/:id', function (req, res) {
//     categoriesController.getById(req.params.id, function (category) {
//         var page = parseInt(req.query.page);
//         if(isNaN(page)){
//             page = 1;
//         }

//         var limit = 12;
//         var pagination = {
//             limit: limit,
//             page: page,
//             totalRows: category.Products.length
//         }
//         var offset = (page - 1) * limit;
//         category.Products = category.Products.slice(offset, offset + limit);

//         //console.log(category);

        

//         categoriesController.getAll(function (categories) {
//             //res.send(category);
//             req.breadcrumbs('Sản phẩm', '/product');
//             req.breadcrumbs(category.CategoryName, '/product/'+category.id);
//             res.render('product_detail', {
//                 categories: categories,
//                 category: category,
//                 breadcrumbs: req.breadcrumbs()
//             });
//         });

    
//         // res.redirect('/product', {
//         //     category: category,
//         //     pagination: pagination
//         // });
//     });
// })
// module.exports = router;