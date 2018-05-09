var express = require('express');
var router = express.Router();
var session = require('express-session');

var paypal = require('./paypal-handlers');

var handlerGeneral = require('./general');
var cur_total_quantity = 0, cur_money = 0 , product_list = [];

// Use the session middleware
router.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

router.get("/*", (req, res, next) => {
    req.app.locals.layout = 'checkout_layout'; // set your layout here
    next();
})

router.get('/shipping-detail', (req, res) => {
    res.render('checkout/shipping-detail');
})

router.get('/payment', (req, res)=>{
    // var data = JSON.parse(req.cookies['paid-products'].toString());
    // var product_list = JSON.parse(data.product_list.toString());
    // var cur_total_quantity = parseInt(data.totalQuantity);
    // var cur_money = parseInt(data.totalMoney);
    get_cart_detail_from_cookie(req, res);

    res.render('checkout/payment', {
        shipping_detail: req.session.shipping_detail,
        product_list : product_list,
        totalMoney : cur_money,
        totalQuantity: cur_total_quantity
    });
})

router.post('/', (req, res) => {
    var full_name = req.body.full_name, tel = req.body.telephone, address = req.body.address;
    var shipping_detail = {full_name, tel, address}
    //req.checkBody('tel', 'Số điện thoại chỉ được chứa 9 - 15 chữ số').len(9, 15);
    let errors = req.validationErrors();
    if (errors) {
        //res.flash({ success: false, message: errors });
    }
    else {
        req.session.shipping_detail = shipping_detail;
        res.redirect('/checkout/payment');
        //res.render('checkout/payment', {layout: 'checkout_layout', shipping_detail});
    }
})



router.post("/payment", (req, res)=>{

    get_cart_detail_from_cookie(req, res);
    var cart = {
        "items": product_list,
        'total': cur_money,
        "tax" : "0",
        "shipping": "0",
        "handling_fee": "0",
        "currency": "VND"
    };
    const userAgent = req.headers['user-agent'];
	const params = Object.assign({}, req.body);

	const clientIp =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);

        
    const amount = parseInt(params.amount,10);
    
	const now = new Date();

	// NOTE: only set the common required fields and optional fields from all gateways here, redundant fields will invalidate the payload schema checker
	const checkoutData = {
		amount,
		clientIp: clientIp.length > 15 ? '127.0.0.1' : clientIp,
		locale: 'vn',
		billingCity: params.billingCity || '',
		billingPostCode: params.billingPostCode || '',
		billingStateProvince: params.billingStateProvince || '',
		billingStreet: params.billingStreet || '',
		billingCountry: params.billingCountry || '',
		deliveryAddress: params.billingStreet || '',
		deliveryCity: params.billingCity || '',
		deliveryCountry: params.billingCountry || '',
		currency: 'VND',
		deliveryProvince: params.billingStateProvince || '',
		customerEmail: params.email,
		customerPhone: params.phoneNumber,
		orderId: `node-${now.toISOString()}`,
		// returnUrl: ,
		transactionId: `node-${now.toISOString()}`, // same as orderId (we don't have retry mechanism)
		customerId: params.email,
	};

	// pass checkoutData to gateway middleware via res.locals
	res.locals.checkoutData = checkoutData;

	// Note: these handler are asynchronous
    let asyncCheckout = null;
    console.log(cart.total);
	switch (params.paymentMethod) {
		case 'paypal':
			var transactions = [
                {
                    "amount": {
                    "total": cart.total,
                    "currency": "VND",
                    "details": {
                      "subtotal": cart.total,
                    }
                    },
                    "description": "The payment transaction description.",
                    "custom": "EBAY_EMS_90048630024435",
                    "invoice_number": "48787589673",
                    "payment_options": {
                    "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
                    },
                    "soft_descriptor": "ECHI5786786",
                    "item_list": {
                    "items": [
                      {
                      "name": "hat",
                      "description": "Brown hat.",
                      "quantity": "3",
                      "price": "265000",
                      "sku": "1",
                      "currency": "VND"
                      }
                    ],
                    "shipping_address": {
                      "recipient_name": "Brian Robinson",
                      "line1": "4th Floor",
                      "line2": "Unit #34",
                      "city": "San Jose",
                      "country_code": "US",
                      "postal_code": "95131",
                      "phone": "011862212345678",
                      "state": "CA"
                    }
                    }
                  }
			// {
			//   "amount": {
			// 	"total": cart.total,
			// 	"currency": cart.currency,
			// 	"details": {
			// 		"tax": cart.tax,
			// 		"shipping": cart.shipping,
			// 		"handling_fee": cart.handling_fee		
			// 	}
			//   },
			//   "description": "The payment transaction description.",
			//   "item_list": {
			// 	"items": cart.items,
			// 	"shipping_address": {
			// 		"recipient_name": params.fullname,
			// 		"address": params.address || "",
			// 		"phone": params.phone || ""
			// 	}
			//   }
			// }
            ];
            //console.log(transactions);
			res.locals.transactions = transactions;
			asyncCheckout = paypal.checkoutPaypal(req, res);
			break;
		default:
			break;
	}

	if (asyncCheckout) {
		asyncCheckout
			.then(checkoutUrl => {
				res.writeHead(301, { Location: checkoutUrl.href });
				res.end();
			})
			.catch(err => {
				res.send(err);
			});
	} else {
		res.send('Payment method not found');
	}
})

router.get('/payment/:gateway/callback', (req, res) => {
	const gateway = req.params.gateway;
	console.log('gateway', req.params.gateway);
	let asyncFunc = null;

	switch (gateway) {
		case 'paypal':
			asyncFunc = paypal.callbackPaypal(req, res);
			break;
		default:
			break;
	}

	if (asyncFunc) {
		asyncFunc.then(() => {
			
			res.render('result', {
				title: `Demo NodeJS Payment via ${gateway.toUpperCase()}`,
				items: cart.items,
				promo: cart.shipping_discount,
				currency: res.locals.currency || 'VND'
			});
			
		})
		.catch((err) => {
			res.send(err);
		});
	} else {
		res.send('No callback found');
	}
});


function ensureAuthenticated(req, res, next) {
    console.log(req);
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/customer/account/login');
    }
}

function get_cart_detail_from_cookie(req, res){
    var cookie = req.cookies['paid-products'];
    var data;

    if (cookie != null) {
        data = JSON.parse(req.cookies['paid-products'].toString());
        product_list = JSON.parse(data.product_list.toString());
        cur_total_quantity = data.totalQuantity;
        cur_money = data.totalMoney;
    }
}

module.exports = router;