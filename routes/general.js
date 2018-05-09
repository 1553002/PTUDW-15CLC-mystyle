var express = require('express');
var router = express.Router();

router.get_quantity_of_items = function(req, res){
    var cookie = req.cookies['paid-products'];
    if (cookie){
        return JSON.parse(cookie.toString()).totalQuantity;
    }
    return 0;
}


module.exports = router;
