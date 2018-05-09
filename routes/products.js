var express = require('express');
var router = express.Router();

var categoriesController = require('../controllers/categoriesController');
var productsController = require('../controllers/productsController');
var handlerGeneral = require('./general');

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
            number_of_items: handlerGeneral.get_quantity_of_items(req, res),
            user: username
        });
    });
}

// router.get('/*', (req, res, next)=>{
//     res.json({
//         number_of_items: res.locals.nums});
//     next();
// })

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
                number_of_items: handlerGeneral.get_quantity_of_items(req, res),
                breadcrumbs: req.breadcrumbs()
            });
        });
    });
})

var product_detail;
router.route('/:categoryId/:productId')
    .all(function(req, res, next){
        productsController.getProductDetailById(req.params.productId, function (product) {
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
            number_of_items: handlerGeneral.get_quantity_of_items(req, res),
            breadcrumbs: req.breadcrumbs()
        })
    })
    .post(function(req, res){
        var cookie = req.cookies['paid-products'];
        let order_quantity = req.body.data.quantity, order_size = req.body.data.size;
        
        var product_list = [];

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
            
            var data, cur_money = 0, cur_total_quantity = 0;
            if (cookie != null && cookie != undefined){
                data =  JSON.parse(req.cookies['paid-products'].toString());
                
                //Lay nhung thong tin can thiet
                product_list = JSON.parse(data.product_list.toString()); //Danh sach sp trong gio hang hien tai
                cur_money = data["totalMoney"]; //Tong gia hien tai
                cur_total_quantity = data["totalQuantity"]; //So luong sp trong gio hang hien tai
            }

            var exist = false;
            var new_money = parseInt(order_quantity)*parseInt(item.price.replace(',',''));

            if (product_list.length > 0){
                //Kiểm tra mặt hàng đã tồn tại hay chưa
                for (index in product_list){
                    if (product_list[index].id === item.id && product_list[index].size === item.size){
                        product_list[index].quantity = parseInt(product_list[index].quantity) + parseInt(order_quantity);
                        exist = true;
                    }
                }
            }

            cur_total_quantity += parseInt(order_quantity);
            cur_money += new_money;

            //Nếu sp chưa tồn tại trong đơn hàng
            if (!exist){
                product_list.push(item);
            }
            
            var my_data = {totalQuantity: cur_total_quantity, totalMoney: cur_money, product_list: JSON.stringify(product_list)};
            
            //var expireDay = new Date(new Date().getTime()+86409000).toUTCString();
            res.cookie('paid-products', JSON.stringify(my_data), {maxAge : 1000*60*60*24*30, httpOnly: false});
        }
        res.send("OK");
    })




module.exports = router;