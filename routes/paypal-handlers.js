var paypal = require("paypal-rest-sdk");
var express = require('express');
var router = express.Router();

paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': 'AXY-TTWZ7dAC-EORlRxG4achel_O7J6WZtqCWtX80JOBC4BjGMfv6LqdE6fHqM-VKiBJSMWcH3wHenQF', // please provide your client id here 
  'client_secret': 'EGyW-pRmDfLYvTiczpUA6x9Buz3yO2by1RxiaH8R18yi91hAiaF9D77LNysSJUGKwV9igNmns_MK7XEt' // provide your client secret here 
});

// paypal.configure({
//   mode: "sandbox",
//   client_id:
//     "ARJhFXtqQ7HpdfjOnlYLroRgHXaifLUb3MurIYtPRfRReap9GBFbw9aPGkBhpGjbn9l4U-F4trJ5AjEB",
//   client_secret:
//     "EN3-QD-CjYS3iqUGZVKzSf4HQxKRGMa1gTeAFnjy_s9ORB2eJaB4AuF7nZSTa56ZZRgG63OGQ2xWKBzM"
// });

module.exports = {
  checkoutPaypal: function (req, res) {
    var payment = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": `http://${req.headers.host}/checkout/payment/paypal/callback`,
        "cancel_url": `http://${req.headers.host}/checkout/payment/err`
      }
    };
    payment.transactions = res.locals.transactions;
  
    return createPay(payment)
      .then(transaction => {
        req.session.paymentId = transaction.id;
        var links = transaction.links;
        var counter = links.length;
        while (counter--) {
          if (links[counter].method == "REDIRECT") {
            // redirect to paypal where user approves the transaction

            var checkoutUrl = links[counter];
            res.locals.checkoutUrl = checkoutUrl;

            return checkoutUrl;
          }
        }
      })
  },

  callbackPaypal : function(req, res) {
    console.log("Call function is called");
    const paymentId = req.session.paymentId;
    const payerId = req.query.PayerID;    
    const details = { payer_id: payerId };
  
    return executePay(paymentId, details)
      .then(payment => {
          res.locals.email = payment.payer.payer_info.email;
          res.locals.orderId = payment.id || '';
          res.locals.price = payment.transactions[0].amount.total;
          res.locals.address = payment.payer.payer_info.shipping_address.line1;
          res.locals.country = payment.payer.payer_info.shipping_address.country_code;
          res.locals.state = payment.payer.payer_info.shipping_address.state;
          res.locals.city = payment.payer.payer_info.shipping_address.city;
          res.locals.postalCode = payment.payer.payer_info.shipping_address.postal_code;
          res.locals.currency = "USD";
          res.locals.isSucceed = true;
          res.locals.message = "";     
          console.log("payment");
      })
      .catch((err) => {
        console.log("failed", err);
        res.locals.isSucceed = false;
        res.locals.message = err.message;
      });
  }


}



// helper functions
var createPay = payment => {

  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, function (err, payment) {
      if (err) {
        reject(err);
      } else {
        resolve(payment);
      }
    });
  });
};

var executePay = (paymentId, details) => {
  console.log("executePay", paymentId, details);
  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, details, (err, payment) => {
      if (err) {
        reject(err);
      } else {
        resolve(payment);
      }
    });
  });
};