var express = require('express');
var router = express.Router();
var session = require('express-session');

var paypal = require('./paypal-handlers');
var onepay = require('./onepay-handlers');

var handlerGeneral = require('./general');
var cur_total_quantity = 0, cur_money = 0, product_list = [];

var cartsController = require('../controllers/cartsController');
// Use the session middleware
// router.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

router.get("/*", ensureAuthenticated, (req, res, next) => {
	req.app.locals.layout = 'checkout_layout'; // set your layout here
	next();
})

router.get('/shipping-detail', (req, res) => {
	res.render('checkout/shipping-detail');
})


router.get('/payment', (req, res) => {
	get_cart_detail_from_cookie(req, res);
	res.render('checkout/payment', {
		shipping_detail: req.session.shipping_detail,
		product_list: product_list,
		totalMoney: cur_money
	});
})

router.post('/', (req, res) => {
	var full_name = req.body.full_name, tel = req.body.telephone, address = req.body.address;
	var shipping_detail = { full_name, tel, address }

	//req.checkBody('tel', 'Số điện thoại chỉ được chứa 9 - 15 chữ số').len(9, 15);
	req.checkBody('full_name', 'Tên người nhận không được bỏ trống').notEmpty();
	req.checkBody('address', 'Địa chỉ giao hàng không được bỏ trống').notEmpty();

	let errors = req.validationErrors();
	if (errors) {
		console.log("ERORR: ", errors);
		//res.flash({ success: false, message: errors });
	}
	else {
		req.session.shipping_detail = shipping_detail;
		res.redirect('/checkout/payment');
	}
})


/**
 * Xử lý sự kiện chọn phương thức thanh toán
 */


router.post("/payment", (req, res) => {
	var id = makeid();

	get_cart_detail_from_cookie(req, res);

	var cart = {
		"items": product_list,
		'total': cur_money,
		"shipping": "0",
		"currency": "VND"
	};

	const userAgent = req.headers['user-agent'];
	const params = Object.assign({}, req.body);

	const clientIp =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);


	//const amount = parseInt(params.amount,10);
	const amount = parseInt(cart.total);
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
		orderId: id,
		// returnUrl: ,
		transactionId: id, // same as orderId (we don't have retry mechanism)
		customerId: params.email,
	};

	// pass checkoutData to gateway middleware via res.locals
	res.locals.checkoutData = checkoutData;

	// Note: these handler are asynchronous
	let asyncCheckout = null;
	console.log("PAY MEHTOD", params.paymentMethod);
	switch (params.paymentMethod) {
		case 'cod':
			Create_cart(id, 'cod', product_list, req, res);
			res.clearCookie('paid-products');
			break;
		case 'onepayDomestic':
			asyncCheckout = onepay.checkoutOnePayDomestic(req, res);
			break;
		case 'paypal':
			// Convert_currency(cart.total, 'VND', 'USD')
			var transactions = [
				{
					"amount": {
						"total": "30.11",
						"currency": "USD",
						"details": {
							"subtotal": "30.00",
							"tax": "0.07",
							"shipping": "0.03",
							"handling_fee": "1.00",
							"insurance": "0.01",
							"shipping_discount": "-1.00"
						}
					},
					"description": "The payment transaction description.",
					"custom": "EBAY_EMS_90048630024435",
					"invoice_number": "48787589673",
					"item_list": {
						"items": [
							{
								"name": "hat",
								"sku": "1",
								"price": "3.00",
								"currency": "USD",
								"quantity": "5",
								"description": "Brown hat.",
								"tax": "0.01"
							},
							{
								"name": "handbag",
								"sku": "product34",
								"price": "15.00",
								"currency": "USD",
								"quantity": "1",
								"description": "Black handbag.",
								"tax": "0.02"
							}
						],
						"shipping_address": {
							"recipient_name": "Brian Robinson",
							"line1": "4th Floor",
							"line2": "Unit #34",
							"city": "San Jose",
							"state": "CA",
							"phone": "011862212345678",
							"postal_code": "95131",
							"country_code": "US"
						}
					}
				}
			];
			//console.log(transactions);
			res.locals.transactions = transactions;
			asyncCheckout = paypal.checkoutPaypal(req, res);
			break;
		default:
			break;
	}

	if (params.paymentMethod != "cod") {
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
	}
})

router.get('/payment/:gateway/callback', (req, res) => {
	console.log("CALL CALLBAKCK");
	const gateway = req.params.gateway;
	let asyncFunc = null;
	console.log(gateway);
	switch (gateway) {
		case 'onepaydom':
			asyncFunc = onepay.callbackOnePayDomestic(req, res);
			break;
		case 'paypal':
			asyncFunc = paypal.callbackPaypal(req, res);
			break;
		default:
			break;
	}

	if (asyncFunc) {
		asyncFunc.then(() => {
			// res.render('checkout/result', {
			// 	title: `MyStyle Payment via ${gateway.toUpperCase()}`,
			// 	isSucceed: res.locals.isSucceed,
			// 	orderId: res.locals.orderId,
			// });
			// console.log("SUCCESS");
			if (res.locals.isSucceed){
				Create_cart(res.locals.orderId, gateway, product_list, req, res);
				res.clearCookie('paid-products');
				console.log("Da them thanh cong");
			}
		});
	} else {
		res.send('No callback found');
	}
});


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/customer/account/login');
	}
}

function get_cart_detail_from_cookie(req, res) {
	var cookie = req.cookies['paid-products'];
	var data;

	if (cookie != null) {
		data = JSON.parse(req.cookies['paid-products'].toString());
		product_list = JSON.parse(data.product_list.toString());
		cur_total_quantity = data.totalQuantity;
		cur_money = data.totalMoney;
	}
}

var rates = [22778.1, 0.000040000];
var VNDUSD = rates[1],
	USBVND = rates[0];


function Convert_currency(amount, convert_from, convert_to) {
	if (convert_from == "VND" && convert_to == "USD") {
		result = amount * VNDUSD;
	} else if (convert_from == "USD" && convert_to == "VND") {
		result = amount * USDVND;
	} else if (convert_from == convert_to) {
		result = amount;
	}

	return result;
}

function Convert_currency_for_items(list, convert_from, convert_to) {
	for (index in list) {
		list[index].price
	}
}

function makeid() {
	var text = "";
	var possible = "0123456789";

	for (var i = 0; i < 9; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function Create_cart(cart_id, payment_method, product_list, req, res) {

	var shipping_detail = req.session.shipping_detail;
	var delivery_date = new Date();
	delivery_date.setDate(delivery_date.getDate() + 10);
	var payment_type;

	switch (payment_method) {
		case 'paypal': {
			payment_type = 'Thẻ quốc tế';
			break;
		}
		case 'onepaydom': {
			payment_type = 'Thẻ nội địa';
			break;
		}
		case 'cod': {
			payment_type = 'Thanh toán khi nhận hàng';
			break;
		}
	}

	var cart = {
		id: cart_id,
		receiver: shipping_detail.full_name,
		paymentType: payment_type,
		deliveryDate: delivery_date,
		transactStatus: 'Xử lý',
		receiveAddress: shipping_detail.address,
		total: cur_money,
		CustomerEmail: res.locals.user.email
	}

	cartsController.createCart(cart, function (cart) {
		for (index in product_list) {
			let Obj = {
				productName: product_list[index].name,
				size: product_list[index].size,
				image: product_list[index].img,
				quantity: product_list[index].quantity,
				price: product_list[index].price,
				total: product_list[index].total_price,
				delete: 'false',
				CartId: cart_id
			}

			cartsController.createCartDetail(Obj, function (cart_detail) {
				if (cart_detail) {

				}
			})
		}
		res.render('checkout/result', {
			title: `MyStyle Payment via ${payment_method.toUpperCase()}`,
			layout: false,
			orderId: cart_id,
		});
	})
}

module.exports = router;