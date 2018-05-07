var express = require('express');
var router = express.Router();

var categoriesController = require('../controllers/categoriesController');
var productsController = require('../controllers/productsController');

var getAllCategories = (req, res) => {
    var isLogin = req.isAuthenticated();
    var username = null;

    if (isLogin) {
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
        if (isNaN(page)) {
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

        categoriesController.getAll(function (categories) {
            //res.send(category);
            req.breadcrumbs('Sản phẩm', '/product');
            req.breadcrumbs(category.categoryName, '/product/' + category.id);
            res.render('product', {
                title: 'Sản phẩm-' + category.categoryName,
                categories: categories,
                category: category,
                breadcrumbs: req.breadcrumbs()
            });
        });
    });
})

var product_detail;
router.route('/:categoryId/:productId')
    .all(function(req, res, next){
        productsController.getProductDetailById(req.params.productId, function (product) {
            console.log("Get_product_detail CALLED");
            product_detail = product;
            if (product_detail != 'undifined' && product_detail != null){
                next();
            }else{
                res.status(500).send({error: 'Sản phẩm không tồn tại'})
            } 
        })
    })
    .get(function(req, res){
        console.log("Render_product_detail CALLED");
        req.breadcrumbs('Sản phẩm', '/product');
        req.breadcrumbs(req.params.id, '/product/' + req.params.id);
        req.breadcrumbs(product_detail.name);

        res.render('product_detail', {
            title: 'Sản phẩm-' + product_detail.name,
            product: product_detail,
            breadcrumbs: req.breadcrumbs()
        })
    })
    .post(function(req, res){
        var cookie = req.cookies['paid-products'];
        let order_quantity = req.body.data.quantity, order_size = req.body.data.size;
        
        var data = [];

        if (order_quantity===undefined || order_quantity == null){
            order_quantity = -1;
        }
        
        if (order_size != 'M' && order_size!='L' && order_size!='XL' && order_size!='S'){
            order_size = '';
        }
        if (order_quantity == -1 || order_size == ''){

        }else{
            var item = {
                name : product_detail.name,
                id: product_detail.id,
                url: req.url,
                img: product_detail.image1,
                price: product_detail.discountAvailable ? product_detail.discountPrice : product_detail.price,
                originalPrice: product_detail.price,
                quantity: order_quantity,
                size: order_size
            }
            
            if (cookie != null){
                data = JSON.parse(req.cookies['paid-products'].toString());
            }
            var exist = false;
            
            if (data.length > 0){
                
                //Kiểm tra mặt hàng đã tồn tại hay chưa
                for (index in data){
                    if (data[index].id === item.id && data[index].size === item.size){
                        data[index].quantity =parseInt(data[index].quantity) + parseInt(order_quantity);
                        exist = true;
                    }
                }
            }

            function cal (a, b){
                console.log("CALLL ME");
                return parseInt(a) + parseInt(b);
            }
            //Nếu sp chưa tồn tại trong đơn hàng
            if (!exist){
                data.push(item);
            }
            
            var tmp = new Date(new Date().getTime()+86409000).toUTCString();
            res.cookie('paid-products', JSON.stringify(data), {maxAge : 1000*60*60*24*30, httpOnly: true});

            //console.log(cookie);
        }
        res.send("OK");
    })


// router.get('/:id/:productID', [Get_product_detail, Render_product_detail]);
// router.get('/:id/:productId/add-to-cart', [Get_product_detail]);
//Hàm lấy thông tin sản phẩm
// router.get('/:id/:productID', function (req, res) {
//     productsController.getProductDetailById(req.params.productID, function (product) {

//         req.breadcrumbs('Sản phẩm', '/product');
//         req.breadcrumbs(req.params.id, '/product/' + req.params.id);

//         req.breadcrumbs(product.name);
//         function getDay(date) {
//             console.log(date);
//             var tmp = new Date(date);
//             var day = tmp.getDate();
//         }

//         getDay(product.createdAt);

//         res.render('product_detail', {
//             title: 'Sản phẩm-' + product.name,
//             product: product,
//             breadcrumbs: req.breadcrumbs(),
//             user: username
//         })
//     });
// })

module.exports = router;