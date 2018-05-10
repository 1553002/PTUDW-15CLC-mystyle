
var express = require('express');
var router = express.Router();

var customproductsController = require('../controllers/customproductsController');
var cookieimageController = require('../controllers/cookieimageController');

router.get('/', function (req, res) {
    try {
        customproductsController.getAll(res.locals.user.email, function (customproducts) {

            res.render('design', {
                customproducts: customproducts
            });


        });
    }
    catch (error) {
        res.render('design');
    }
});


router.post('/', function (req, res) {



    img = req.body.hidden_data;
    img_back = req.body.hidden_data_back;
    email = req.body.hidden_data_email;


         customproductsController.create(email, img, img_back, function (customproducts) {
        res.sendStatus(201);
        res.end();
    });



});

router.post('/order', function (req, res) {

   

    console.log("OK man");
    console.log(req.body.hidden_data_quantity);
    console.log(req.body.hidden_data_size);
    var id =makeid();
    cookieimageController.create(id, req.body.hidden_data, function (cookieimages) 
    {

    
    var cookie = req.cookies['paid-products'];
        let order_quantity = req.body.hidden_data_quantity, order_size = req.body.hidden_data_size;
        
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
                id: id,
                name : "Áo đẹp của tôi "+id,
                url:"Add_url",
                img: "Add_url",
                price: 250000,
                originalPrice : 250000,
                quantity: order_quantity,
                total_price :250000* order_quantity,
                size: order_size
            }

            var data, cur_money = 0, cur_total_quantity = 0;

            if (cookie != null && cookie != undefined){
                data =  JSON.parse(req.cookies['paid-products'].toString());
                console.log(data);
                //Lay nhung thong tin can thiet
                product_list = JSON.parse(data.product_list.toString()); //Danh sach sp trong gio hang hien tai
                cur_money = data["totalMoney"]; //Tong gia hien tai
                cur_total_quantity = data["totalQuantity"]; //So luong sp trong gio hang hien tai
            }

            var exist = false;

            if (product_list.length > 0){
                //Kiểm tra mặt hàng đã tồn tại hay chưa
                for (index in product_list){
                    if (product_list[index].id === item.id && product_list[index].size === item.size){
                        product_list[index].quantity = product_list[index].quantity + order_quantity;
                        product_list[index].total_price = product_list[index].total_price + (item.total_price);
                        exist = true;
                    }
                }
            }

            cur_total_quantity += order_quantity;
            cur_money += item.total_price;
            
            // //Nếu sp chưa tồn tại trong đơn hàng
            if (!exist){
                product_list.push(item);
            }
            
            var my_data = {totalQuantity: cur_total_quantity, totalMoney: cur_money, product_list: JSON.stringify(product_list)};

            res.cookie('paid-products', JSON.stringify(my_data), {maxAge : 1000*60*60*24*30, httpOnly: false});
        }

        res.sendStatus(201);
        res.end();
        });
    
});


router.delete('/:id', function (req, res) {
         customproductsController.updateDeleted(parseInt(req.params.id), function (customproducts) {
        res.sendStatus(204);
        res.end();
    });
});

/*
router.get('/:email', function (req, res) {
    customproductsController.getAll(req.params.email,function (customproducts) {
     
            res.send("OK");
           
      
    });
});*/

function makeid() {
	var text = "";
	var possible = "0123456789";
  
	for (var i = 0; i < 9; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
	return text;
}
module.exports = router;