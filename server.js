const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information} = require('./models/server_db');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');

app.use(bodyParser.json());
app.use(express.static(publicPath));

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Afe2-O6cOFP9OhC4TWjrfUB-Um2O6bguTpIT9h9dNWWBQIrByiaog1d4Py4tN3IlB77xJfZD0rFx6-Sc',
  'client_secret': 'EGjAZzzJSqrS-yY0GzoTBS3ZmAwpBw2lDK_3o0t2uxDbnIySa3j8SXDmWLWbQR0HMqV303Yn_DV5bK30'
});

app.post('/post_info',async (req,res)=>{
  var email = req.body.email;
  var amount = req.body.amount;

  if (amount <=1){
    return_info = {};
    return_info.error = true;
    return_info.message = "The amount should be greater than 1";
    return res.send(return_info);
  }
  var fee_amount = amount * 0.9;
  var result = await save_user_information ({"amount" : fee_amount, "email" : email});

  var create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Lottery",
                  "sku": "Funding",
                  "price": amount,
                  "currency": "GBP",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "GBP",
              "total": amount
          },
          'payee': {
            'email' : 'manager2@cryptoshares.co.uk'
          },
          "description": "Lottery purchase"
      }]
  };


  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          console.log("Create Payment Response");
          console.log(payment);
          for(var i = 0; i < payment.links.length; i++){
            /*console.log(payment.links[i].href);*/
            if(payment.links[i].rel == 'approval_url'){
              return res.send(payment.links[i].href);
            }
          }
      }
  });
  /*res.send(result);*/
});

app.get('/success',(req,res)=>{
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  var execute_payment_json = {
    "payer_id" : payerId,
    "transactions":[{
      "amount": {
        "currency" : "GBP",
        "total" : 100
      }
    }]
  };
  paypal.payment.execute(paymentId, execute_payment_json, function(err,payment){
    if(err){
      console.log(error.response);
      throw error;
    }else{
      console.log(payment);
    }
  });
  res.redirect('http://localhost:3000');
});


app.get('/get_total_amount', async (req,res)=>{
  var   result = await get_total_amount();
  res.send(result);
});

app.listen(3000,()=>{
  console.log('server is running on port 3000');
});
