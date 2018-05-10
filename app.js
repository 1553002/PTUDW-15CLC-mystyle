var createError = require('http-errors');
var express = require('express');
var expressHbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



//1553002
var session = require('express-session');
var passport = require('passport'); //Ho tro dang nhap
var LocalStrategy = require('passport-local').Strategy;
var breadcrumbs = require('express-breadcrumbs');
var expressValidator = require('express-validator'); //Dung de kiem tra dieu kien
var paginateHelper = require('express-handlebars-paginate');
var errorHandler = require('express-error-handler');
var http = require("http"), path = require('path');
var methodOverride = require('method-override');
var bodyParser    = require('body-parser');
var errorHandler  = require('errorhandler');
var upload        = require("express-fileupload");
var flash         = require("connect-flash");

var models = require('./models');

var app = express();

var hbs = expressHbs.create(
  {
      extname:'hbs',
      layoutsDir: __dirname + '/views/layouts/',
      partialsDir: __dirname + '/views/partials/',
      helpers:{
          paginate: paginateHelper.createPagination
      }
  }
)



// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');




app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(breadcrumbs.init());
// Set Breadcrumbs home information 
app.use(breadcrumbs.setHome({
    name: 'Trang chủ',
    url:'/'
}));


app.use(session({
	secret: "secret",
	resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60*60*1000, //in milliseconds
    // httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(upload());
app.use(flash());


/*------------------------------
               Router
 -----------------------------*/
 

app.get('/sync', function(req, res){
	models.sequelize.sync().then(function(){
		res.send('database sync completed!');
    });
});


app.all('/*', function (req, res, next) {
  req.app.locals.layout = 'layout'; // set your layout here
  res.locals.user = req.user || null;
  next(); // pass control to the next handler
});


var index = require("./routes/index");
app.use('/', index);

var customproducts = require('./routes/customproduct');
app.use('/customproduct', customproducts);

app.get('/design', function(req, res){
  
  res.redirect('/customproduct');
});


app.post('/', function(req, res){
	res.redirect(307 ,'/customproduct');
})
app.delete('/:id', function(req, res){
	res.redirect(307 ,'/customproduct/'+req.params.id);
})
//app.get('/:email', function(req, res){
//	res.redirect(307 ,'/customproduct/'+req.params.email);
//})

var customer = require('./routes/customer');
app.use('/customer',customer);

app.post('/customer/account/edit', function(req, res){
	res.redirect(307 ,'/customer/account/edit');
})

var products = require('./routes/products');
app.use('/product', products);

var cart = require("./routes/cart");
app.use('/cart', cart);

var adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

var checkout = require("./routes/checkout");
app.use('/checkout', checkout);


// models.sequelize.sync().then(function() {
//   http.createServer(app).listen(app.get('port'), function(){
//     console.log('Express server listening on port ' + app.get('port'));
//   });
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
