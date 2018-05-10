
var express = require('express');
var router = express.Router();

var customproductsController = require('../controllers/customproductsController');


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

router.delete('/:id', function (req, res) {
    customproductsController.destroy(parseInt(req.params.id), function (customproducts) {
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
module.exports = router;