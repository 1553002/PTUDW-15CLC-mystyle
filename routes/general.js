var express = require('express');
var router = express.Router();

router.get_quantity_of_items = function(req, res){
    var cookie = req.cookies['paid-products'];
    if (cookie){
        return JSON.parse(cookie.toString()).totalQuantity;
    }
    return 0;
}

router.Convert_price_to_int = function(price_string){
    return parseInt(price_string.replace(',', ''));
}



module.exports = router;
