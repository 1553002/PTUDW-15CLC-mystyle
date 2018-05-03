var express = require('express');
var router = express.Router();

var commentsController = require('../controllers/commentsController');


router.get('/', function (req, res) {
    commentsController.getAll(function (comments) {
        
        res.render('design', {
            comments: comments
        });
    });
});


router.post('/', function (req, res) {
    commentsController.create(req.body.comment, function (comments) {
        res.sendStatus(201);
        res.end();
    });
});


module.exports = router;