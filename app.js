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
var breadcrumbs = require('express-breadcrumbs');
var expressValidator = require('express-validator'); //Dung de kiem tra dieu kien
var paginateHelper = require('express-handlebars-paginate');
var models = require('./models');
var errorHandler = require('express-error-handler');
var http = require("http"), path = require('path');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var upload = require("express-fileupload");
var flash=require("connect-flash");

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
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.bodyParser());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
console.log("HERRRRRRRRRR");
console.log(path.join(__dirname, 'public'));
app.use(breadcrumbs.init());
// Set Breadcrumbs home information 
app.use(breadcrumbs.setHome({
    name: 'Trang chủ',
    url:'/'
}));


app.use(session({
	secret: "secret",
	resave: true,
	saveUninitialized: true
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
  next(); // pass control to the next handler
});





// app.post('/', (req, res)=>{
//   //console.log("HHHHHHHHHHHHHHH")
//   if (req.files){
//     // console.log(req.files);
//     var file = req.files.filename,
//     filename = file.name;

//     file.mv("./public/upload/"+filename, function(err){
//       if (err){
//         console.log(err);
//         res.send("error occured");
//       }
//       else{
//         res.send("done");
//       }
//     });
//   }
//     //res.send(req.files);
// });
var index = require("./routes/index");
app.use('/', index);

var comments = require('./routes/customproduct');
app.use('/customproduct', comments);

app.get('/design', function(req, res){
  res.redirect('/customproduct');
});

app.post('/', function(req, res){
	res.redirect(307 ,'/customproduct');
})


var customer = require('./routes/customer');
app.use('/customer',customer);

var products = require('./routes/products');
app.use('/product', products);

app.get('/product-detail', (req, res)=>{
  console.log(req);
    //res.render('product-detail')
})

var adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);


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
