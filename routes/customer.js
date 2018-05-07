var express 		= require('express');
var router 			= express.Router();
var models 			= require('../models');
var passport 		= require('passport');
var LocalStrategy 	= require('passport-local').Strategy;
var jwt      		= require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

var Recaptcha = require('express-recaptcha').Recaptcha;
var recaptcha = new Recaptcha('6Lf-uVYUAAAAAP4_01zOSENj4aS1X_7voQh2g-cu', '6Lf-uVYUAAAAAN3zZ2ikXDlaaZfXcVh5aWPVAWhh');

var customersController = require('../controllers/customersController');

router.get('/account/login', (req, res)=>{
	res.render("login", 
		{
			anchor: '#home',
			captcha:recaptcha.render()
		});
});


// router.post('/login', passport.authenticate('local', {
// 	successRedirect: '/',
// 	failureRedirect: '/customer/account/login',
// 	failureFlash: true
// }), 

// function(req, res){
// 	// req.flash('success_message', 'You are now Logged in!!');
// 	//   res.redirect('/');
// 	var sessData = req.session;
// 	sessData.someAttribute = "true";
// 	}
// );

router.post('/account/login', function(req, res, next){
	passport.authenticate('local', {session: true}, (err, user, info) => {
		//Xay ra loi
		if (err || !user){
			req.flash('error', 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
			// return res.status(400).json({
			// 	message: info ? info.message : 'Login failed',
			// 	user : user
			// });
			return res.redirect('/customer/account/login');
		}
		//Thanh cong
		req.login(user, {session: true}, (err)=>{
			if (err){
				res.send(err);
			}
		
			const token = jwt.sign({data: user.email}, 'your_jwt_secret' , {
				expiresIn: 3600 // 1 week
			  });
			//user.id_token = token;
			// res.send(token);
			//res.send(user, token);
			//res.render('index', {user, token, title:'Trang chủ'});
			// res.send(200, {'token': token,
            //                  'userId':    user.email,
			//                  'username': user.username });
			// res.json({
			// 	success: true,
			// 	message: 'Enjoy your token!',
			// 	token: token
			//   });
			// res.setHeader('x-access-token',token);
			// console.log(res.getHeader('x-access-token'));
			//res.cookie('x-access-token', token);
			res.redirect("/");
		});
	})(req, res, next);	
});

router.post('/register', function(req, res){
	console.log("Call register post");

	recaptcha.verify(req, function(error, data){
		console.log('data', data);
		if (!error){
			
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

			req.checkBody('password', 'Mật khẩu bao gồm từ 8 đến 32 ký tự').len(8,32);
			req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
			req.checkBody('cfm_pwd', 'Confirm Password Must Matches With Password').equals(password);

			let errors = req.validationErrors();
			if(errors)
			{
				console.log(errors);
				res.json({success: false, message: errors});
				res.render('login', {anchor:'#profile', errors: errors});
			}
			else
			{
				req.checkBody('day', 'Chưa chọn ngày sinh.').len(2);
				req.checkBody('month', 'Chưa chọn tháng sinh').len(2);
				req.checkBody('year', 'Chưa chọn năm sinh').len(4);
				
				
				if (!req.validationErrors())
					var birthday = monthOB +'/'+ dayOB +'/'+ yearOB;

				var newUser = {
					email: email,
					fullname: name,
					gender: gender,
					dateOB: birthday,
					password: password
				}
				
				customersController.createUser(newUser, function(err){
					if (err) throw err;
					else{
						res.redirect('/');
					}
				})
			}
		}
		else{
			//error code
			console.log("REGISTER FAIL");
		}
	});
    
});


router.post('/accout/getusers', (req, res)=>{
	var user_list = [];
});

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
},
	function(req, email, password, callback) {
		customersController.getUserByEmail(email, function(err, user) {
			if (err) { return callback(err); }
	  		if (!user) {
				return callback(null, false, {message: 'No email is found'});
			  }
			  
	  		customersController.comparePassword(password, user.password, function(err, isMatch) {
				if (err) { return callback(err); }
				if(isMatch){
		  			return callback(null, user, {message: 'You have successfully logged in!!'});
				}
				else{
		  			return callback(null, false, {message: 'Incorrect Password'});
				}
	 		});
		});
  	}
));

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey : 'your_jwt_secret'}, function(jwtPayload, cb){
		console.log('jwtPayload: ', jwtPayload);
		//find user in db if needed
		return models.Customer.findOneById(jwtPayload.data.email).then(user =>{
			return cb(null, user);
		}).catch(err =>{
			return cb(err);
		});
	}
));

passport.serializeUser(function(user, done) {
	//console.log("SERIALIZE USER");
  	done(null, user.email);
});

passport.deserializeUser(function(email, done) {
	//console.log("deserializeUser USER");
    models.Customer.findById(email).then(function(user){
		done(null, user);
	}).catch(function (err){
		console.log(err);
	})
	//done(null, user);
});

router.get('/account/logout', function(req, res){
	req.logout();
	req.flash('success_message', 'You are logged out');
	res.redirect('/');
});

router.get('/account/edit', ensureAuthenticated, (req, res)=>{
	var user_email = req.session.passport.user;
	
	models.Customer.findById(user_email, {password:0}).then(function(user){
		res.render('account_edit', {name:user.fullname, email: user.email, gender: user.gender});
	}).catch(function(err){

	});
});

function ensureAuthenticated(req, res, next){
	console.log(req);
	if (req.isAuthenticated()){
		next();
	}else{
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