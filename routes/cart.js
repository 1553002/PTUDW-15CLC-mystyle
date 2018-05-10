var express = require('express');
var router = express.Router();
var models = require('../models');

var productsController = require('../controllers/productsController');
var cookieimageController = require('../controllers/cookieimageController');
/* GET home page. */
router.get('/', function (req, res, next) {
    var cookie = req.cookies['paid-products'];
    var data, product_list = [];
    var number_of_items = 0, mney = 0;

    if (cookie != null) {
        data = JSON.parse(req.cookies['paid-products'].toString());
        product_list = JSON.parse(data.product_list.toString());
        number_of_items = data.totalQuantity;
        mney = data.totalMoney;

       
    }
    
    cookieimageController.getAll(function (cookieimages) 
    {
        res.render('cart', { cookieimages: cookieimages, title: 'Giỏ hàng', data: product_list, number_of_items, mney });

    });
   
});

function cal_number_products_in_cart(list){
    var ret = 0;
    for (i in list) {
        ret += parseInt(list[i].quantity);
    }
    return ret;
}

// function cal_total_money(list) {
//     var total = 0;
//     for (i in list) {
//         let so_luong = parseInt(list[i].quantity);
//         total += parseInt((list[i].price).replace(',', ''))*so_luong;
//     }

//     return formatCurrency(total, '.',',');
// }

function formatCurrency(nStr, decSeperate, groupSeperate) {
    nStr += '';
    x = nStr.split(decSeperate);
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
    }

    return x1 + x2;
}

router.post('/delete', function (req, res) {
    var data = JSON.parse(req.cookies['paid-products'].toString());
    var product_list = JSON.parse(data.product_list.toString());
    var cur_total_quantity = parseInt(data.totalQuantity);
    var cur_money = parseInt(data.totalMoney);

    
    for (index in product_list) {
        if (product_list[index]['id'] == req.body.data.id && product_list[index]['size'] == req.body.data.size) {
            cur_total_quantity -= parseInt(product_list[index].quantity);
            cur_money -= parseInt(product_list[index].quantity)*parseInt(product_list[index].price);
            
            product_list.splice(index, 1);
        }
    }

    //res.clearCookie('paid-products');
    var my_data = {totalQuantity: cur_total_quantity, totalMoney: cur_money, product_list: JSON.stringify(product_list)};

   
    res.cookie('paid-products', JSON.stringify(my_data), {maxAge : 1000*60*60*24*30, httpOnly: false});
    res.send("CLEAR COOKIE");
})

router.put('/edit', function (req, res) {
    var id = req.body.data.id, size = req.body.data.size, change_quantity = req.body.data.number;

    var data = JSON.parse(req.cookies['paid-products'].toString());
    var product_list = JSON.parse(data.product_list.toString());
    var cur_total_quantity = parseInt(data.totalQuantity);
    var cur_money = parseInt(data.totalMoney);
    
    for (index in product_list) {
        if (product_list[index]['id'] == req.body.data.id && product_list[index]['size'] == req.body.data.size) {
            //Giam luong tien tong
            cur_total_quantity -= product_list[index].quantity;
            cur_money -= parseInt(product_list[index].total_price);
            //Cap nhat luong tien cho sp hien tai
            product_list[index].quantity = parseInt(change_quantity);
            product_list[index].total_price = parseInt(change_quantity)*parseInt(product_list[index].price);
            //Tang luong tien tong
            cur_total_quantity += product_list[index].quantity;
            cur_money += product_list[index].total_price;
        }
    }

    //res.clearCookie('paid-products');
    var my_data = {totalQuantity: cur_total_quantity, totalMoney: cur_money, product_list: JSON.stringify(product_list)};

    res.cookie('paid-products', JSON.stringify(my_data), {maxAge : 1000*60*60*24*30, httpOnly: false});
    res.send("CLEAR COOKIE");
})

module.exports = router;