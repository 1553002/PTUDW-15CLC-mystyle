var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

var Recaptcha = require('express-recaptcha').Recaptcha;
var recaptcha = new Recaptcha('6Lf-uVYUAAAAAP4_01zOSENj4aS1X_7voQh2g-cu', '6Lf-uVYUAAAAAN3zZ2ikXDlaaZfXcVh5aWPVAWhh');

var isAdmin=false;
var customersController = require('../controllers/customersController');
var cartsController = require('../controllers/cartsController');
var handlerGeneral = require('./general');

var token="", numberAccount=0, nameToken="login_token", isFirst=true, isPut=false;
// var flash = require("connect-flash");
// var cookieParser = require('cookie-parser');
// var session = require('express-session');

// router.use(cookieParser('keyboard cat'));
// router.use(session({ cookie: { maxAge: 60000 } }));
// router.use(flash());



router.get('/account/history', (req, res) => {
	var user_email = res.locals.user.email;
	if (user_email != null){
		
		cartsController.getAllCartByEmail(user_email, (carts)=>{
			req.breadcrumbs('Lịch sử mua hàng', '/customer/account/history');
			res.render('history', {
				number_of_items: handlerGeneral.get_quantity_of_items(req, res),
				breadcrumbs: req.breadcrumbs(),
				carts	
			});

		})
	}else{
		res.sendStatus(404);
	}
})

router.get('/account/login', (req, res) => {
	let error_email = req.flash('error_email')[0];
	console.log(req.flash('error_email')[0]);
	let error_password = req.flash('error_password')[0];

	if (error_email != null && error_email != undefined){
		res.locals.error_email = error_email;
	}else if (error_password != null && error_password!=undefined){
		res.locals.error_password = error_password;
	}

	var cookie = req.cookies['login_token'];
    var data, decode="";
	
    if (cookie != null) {
        data = JSON.parse(req.cookies['login_token'].toString());

		decode= jwt.verify(data, 'your_jwt_secret');

		console.log(decode.data);
    }
	res.render("login", {
		captcha: recaptcha.render(),
		number_of_items: handlerGeneral.get_quantity_of_items(req, res),
		email:decode.data
	})
})

// router.post('/account/login', function (req, res, next) {
// 	passport.authenticate('local', {
// 		session: true,
// 		failureFlash: true,
// 		failureRedirect:'/customer/account/login'
// 	}, (err, user, info) => {
// 		//Xay ra loi
// 		// if (err || !user) {
// 		// 	//console.log('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
// 		// console.log(req.flash('error')); //CHổ này cua t no van in ra binh thuong nha

// 		// res.redirect('/customer/account/login');
// 		 else {
// 		//Thanh cong
// 			req.login(user, { session: true }, (err) => {
// 				if (err) {
// 					res.send(err);
// 				}

// 				const token = jwt.sign({ data: user.email }, 'your_jwt_secret', {
// 					expiresIn: 3600 // 1 week
// 				});

// 				res.redirect("/");
// 			});
// 		}

// 	})(req, res, next);
// });

router.post('/account/login',
passport.authenticate('local', {
	failureRedirect: '/customer/account/login', 
	failureFlash: true}), function (req, res) 
	{
	// var payload = check.toJSON(); 
	// var token = jwt.sign(payload, 'SecretKeee');
	   //res.status(300).json({message: "ok", token: 'JWT ' + token});

	if(isPut)
	{
		res.cookie("login_token"+numberAccount, JSON.stringify(token), {maxAge : 1000*60*60*24*30, httpOnly: false});
		numberAccount=numberAccount+1;
		res.cookie('numberAccount', JSON.stringify(numberAccount), {maxAge : 1000*60*60*24*30, httpOnly: false});
	}
	

	

	if(isAdmin)
	{
		res.redirect( '/admin');
	}
	else{
		res.redirect( '/');
	}
	
	console.log('Dang nhap thanh cong');
});

router.post('/account/edit', function(req, res){
	if(req.body.old_pass=="")
	{
		customersController.updateInfo(req.body.email, req.body.fullname,req.body.gender, function (customers) {
			res.sendStatus(200);
			res.end();
		});
	}
	else
	{
		customersController.getUserByEmail(req.body.email, function(err, user) {
			if (err) { return console.log("error email") }
	  		if (!user) {
				return console.log("not found email");
			  }
			  
	  		customersController.comparePassword(req.body.old_pass, user.password, function(err, isMatch) {
				if (err) { return console.log("err password"); }
				if(isMatch){

					customersController.updateInfoWithPassword(req.body.email, req.body.fullname,req.body.gender,req.body.new_pass, function (customers) {
						res.sendStatus(200);
						res.end();
					});
		  			return console.log("match");
				}
				else{
		  			return console.log("fail");
				}
	 		});
		});
	}


});
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},
	function (req, email, password, callback) {
		customersController.getUserByEmail(email, function (err, user) {
			if (err) { return callback(err); }
			if (!user) {
				return callback(null, false, req.flash('error_email','Tài khoản không tồn tại'));
			}

			customersController.comparePassword(password, user.password, function (err, isMatch) {

				if(user.isAdmin) {isAdmin=true;}
				else isAdmin=false;
				if(user.active == false)
				{
					return callback(null, false, req.flash('error_password','Tài khoản chưa kích hoạt. Vui lòng kiểm tra lại!'));
				}

				if (err) { return callback(err); }
				if (isMatch) {
					 token = jwt.sign({ data: user.email }, 'your_jwt_secret', {
						expiresIn: 3600 // 1 week
					});
					//console.log(token);

					
					var cookie = req.cookies['numberAccount'];
					if(cookie!= null)
					{
						 isFirst=false;
						 data = JSON.parse(req.cookies['numberAccount'].toString());
						
						 console.log(data);
						 numberAccount=parseInt(data);
						 console.log(numberAccount);
						 var i=0;
						 while(i<numberAccount)
						 {
							curdata = JSON.parse(req.cookies['login_token'+i].toString());
							decode= jwt.verify(curdata, 'your_jwt_secret');
							console.log(decode.data);
						
							if(decode.data==user.email)
							{
								console.log("trung nhau");
								isPut=false;
								break;
							}
							i=i+1;
						 }
							
					}
					else
					{
						isFirst=true;
						isPut=true;
						
						

					}









					

					
					//return callback(null, user, { message: 'You have successfully logged in!!' });
				return callback(null, user, req.flash('error', 'You have successfully logged in!!')); 
					
				} 
				else {
					return callback(null, false, req.flash('error_password','Mật khẩu không chính xác. Vui lòng kiểm tra lại!'));
				}
			});
		});
	}
));

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: 'your_jwt_secret'}, function (jwtPayload, cb) {
	//find user in db if needed
	return models.Customer.findOneById(jwtPayload.data.email).then(user => {
		return cb(null, user);
	}).catch(err => {
		return cb(err);
	});
}
));

passport.serializeUser(function (user, done) {
	//console.log("SERIALIZE USER");
	done(null, user.email);
});

passport.deserializeUser(function (email, done) {
	//console.log("deserializeUser USER");
	models.Customer.findById(email).then(function (user) {
		done(null, user);
	}).catch(function (err) {
		console.log(err);
	})
	//done(null, user);
});

router.post('/register', function (req, res) {
	console.log("Call register post");

	recaptcha.verify(req, function (error, data) {
		console.log('data', data);
		if (!error) {

			console.log("REGISTER SUCCESSFULL");

			let name = req.body.name;
			let email = req.body.email;
			let gender = (req.body.gender === "Nam" ? true : false);
			let yearOB = req.body.year;
			let monthOB = req.body.month;
			let dayOB = req.body.day;
			let password = req.body.password;
			let cfm_pwd = req.body.cfm_pwd;

			//console.log(name, password, cfm_pwd);

			req.checkBody('password', 'Mật khẩu bao gồm từ 8 đến 32 ký tự').len(8, 32);
			req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
			req.checkBody('cfm_pwd', 'Confirm Password Must Matches With Password').equals(password);

			let errors = req.validationErrors();
			if (errors) {
				console.log(errors);
				res.json({ success: false, message: errors });
				res.render('login', { anchor: '#profile', errors: errors });
			}
			else {
				req.checkBody('day', 'Chưa chọn ngày sinh.').len(2);
				req.checkBody('month', 'Chưa chọn tháng sinh').len(2);
				req.checkBody('year', 'Chưa chọn năm sinh').len(4);


				if (!req.validationErrors())
					var birthday = monthOB + '/' + dayOB + '/' + yearOB;

				var newUser = {
					email: email,
					fullname: name,
					gender: gender,
					dateOB: birthday,
					password: password,
					isAdmin: false,
					active: true
				}

				customersController.createUser(newUser, function (err) {
					if (err) throw err;
					else {
						res.redirect('/');
					}
				})
			}
		}
		else {
			//error code
			console.log("REGISTER FAIL");
		}
	});

});

router.get('/account/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

router.get('/account/edit', ensureAuthenticated, (req, res) => {
	var user_email = req.session.passport.user;

	models.Customer.findById(user_email, { password: 0 }).then(function (user) {
		res.render('account_edit', { 
			name: user.fullname, 
			email: user.email, 
			gender: user.gender,
			number_of_items: handlerGeneral.get_quantity_of_items(req, res) });
	}).catch(function (err) {

	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/customer/account/login');
	}
}

// function ensureAuthenticated(req, res, next){
// 	//console.log(req);
// 	var token = req.body.token || req.query.token || req.cookies['x-access-token'];
// 	if (token){
// 		jwt.verify(token, 'your_jwt_secret', function(err, decoded){
// 			if (!err){
// 				//var secrets = {"accountNumber" : "938291239","pin" : "11289","account" : "Finance"};	
// 				if (decoded.exp <= Date.now())
// 				{
// 					res.end('')
// 				}
// 				req.decoded = decoded;
// 				return next();
// 			}else{
// 				return res.json({ success: false, message: 'Failed to authenticate token.' }); 
// 			}
// 		});
// 	}else{
// 		// return res.status(403).send({ 
// 		// 	success: false, 
// 		// 	message: 'No token provided.' 
// 		//   });

// 		return res.redirect('/customer/account/login')
// 	}
// }

// router.use(function(req, res, next){
// 	var token = req.body.token || req.query.token || req.headers['x-access-token'];

// 	console.log("token: ",token);
// 	if (token){
// 		jwt.verify(token, 'your_jwt_secret', function(err, decoded){
// 			if (!err){
// 				//var secrets = {"accountNumber" : "938291239","pin" : "11289","account" : "Finance"};

// 				req.decoded = decoded;
// 				return next();
// 			}else{
// 				res.redirect('/customer/account/login');
// 			}
// 		});
// 	}else{
// 		return res.status(403).send({ 
// 			success: false, 
// 			message: 'No token provided.' 
// 		  });
// 	}
// });

module.exports = router;