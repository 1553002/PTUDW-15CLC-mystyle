var express         = require('express');
var router          = express.Router();
var models 			= require('../models');

var productsController = require('../controllers/productsController');



/* GET home page. */
router.get('/', function (req, res, next) {

    var cookie = req.cookies['paid-products'];
    var data = [];
    if (cookie != null){
        data = JSON.parse(req.cookies['paid-products'].toString());
    }

    console.log(data);
  res.render('cart', { title: 'Giỏ hàng', data : data });
});


router.post('/delete', function(req, res){
    var data = JSON.parse(req.cookies['paid-products'].toString());

    for(index in data){
        if (data[index]['id'] == req.body.data.id){
            data.splice(index, 1);
        }
    }

    res.clearCookie('paid-products');
    res.cookie('paid-products', JSON.stringify(data), {maxAge : 1000*60*60*24*30, httpOnly: true});
    res.send("CLEAR COOKIE");
})
module.exports = router;