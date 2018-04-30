var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');
var customersController = require('../controllers/customersController');

router.get('/account/login', (req, res)=>{
	var isLogin = req.isAuthenticated();
    console.log(req.session.passport);
	res.render("login", 
		{anchor: '#home'}	
	);
});


router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/customer/account/login',
	failureFlash: true
}), 

function(req, res){
	// req.flash('success_message', 'You are now Logged in!!');
	//   res.redirect('/');
	var sessData = req.session;
	sessData.someAttribute = "true";
	}
);

// router.post('/login', 
// 	passport.authenticate('local', {successRedirect: '/',
// 		failureRedirect: '/customer/account/login'}
// 	)
// );

router.post('/register', function(req, res){
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
        res.render('login', {anchor:'#profile', errors: errors});
	}
	else
	{
		console.log(gender);
		console.log(dayOB, monthOB, yearOB);
		req.checkBody('day', 'Chưa chọn ngày sinh.').len(2);
		req.checkBody('month', 'Chưa chọn tháng sinh').len(2);
		req.checkBody('year', 'Chưa chọn năm sinh').len(4);
		
		
		if (!req.validationErrors())
			var birthday = monthOB +'/'+ dayOB +'/'+ yearOB;

		var USER = {
			email: email,
			fullname: name,
			gender: gender,
			dateOB: birthday,
			password: password
		}
		customersController.createUser(USER, function(err){
			if (err) throw err;
			else{
				res.send('OK');
			}
		})
	}
});

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
},
	function(req, email, password, done) {
		customersController.getUserByEmail(email, function(err, user) {
			if (err) { return done(err); }
	  		if (!user) {
				return done(null, false, req.flash('error_message', 'No email is found'));
			  }
			  
	  		customersController.comparePassword(password, user.password, function(err, isMatch) {
				if (err) { return done(err); }
				if(isMatch){
		  			return done(null, user, req.flash('success_message', 'You have successfully logged in!!'));
				}
				else{
		  			return done(null, false, req.flash('error_message', 'Incorrect Password'));
				}
	 		});
		});
  	}
));

passport.serializeUser(function(user, done) {
  	done(null, user.fullname);
});

passport.deserializeUser(function(user, done) {
    models.Customer.findById(email).then(function(user){
		done(null, user.name);
	}).catch(function (err){
		console.log(err);
	})
	done(null, user);
});


router.get('/account/logout', function(req, res){
	req.logout();
	req.flash('success_message', 'You are logged out');
	res.redirect('/');
});

router.get('/account/edit', (req, res)=>{
	res.render('account_edit');
});

module.exports = router;