var express = require('express');
var router = express.Router();

var customproductsController = require('../controllers/customproductsController');


router.get('/', function (req, res) {
    customproductsController.getAll(function (customproducts) {
        
        res.render('design', {
            customproducts: customproducts
        });
    });
});


router.post('/', function (req, res) {

   

    img =req.body.hidden_data;
    img_back=req.body.hidden_data_back;

   
    
     customproductsController.create(img,img_back,null, function (customproducts) {
     res.sendStatus(201);
     res.end();
});


    
});


module.exports = router;