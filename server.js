/*
 * File: server.js
 * Authors: TripleP (Alex Smith, Herbert Glaser, Kaitlyn Dominguez)
 * Version: 1.2
 *
 * Main file for the ACSAS NodeJS API. Contains some API calls but not
 * all of them, which are distributed in their respective routes.
 */


//Retrieve stripe keys from the .env file

require('dotenv').config({ path: '.env' })
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretKey)
console.log(stripePublicKey)

//Require necessary node modules

const helper = require ('./helper.js');
var helper1 = new helper();
const express = require('express')
const mysql = require('mysql')
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const bodyParser = require('body-parser')
const app = express()
const fs = require("fs")
const stripe = require('stripe')(stripeSecretKey)
const cookies = require('cookies')
const session = require('express-session')

//Set up the express engine

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('./Front End'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./static/'));

//Set up the routes

const searchRouter = require('./routes/search.js')
app.use(searchRouter)
const loadRouter = require('./routes/shop-load.js')
app.use(loadRouter)
const createRouter = require('./routes/create.js')
app.use(createRouter)
const adminRouter = require('./routes/admin.js')
app.use(adminRouter)

//Define number of login attempts allowed

var attempts = 3;

//Create session

app.use(session({
    secret: 'logged on',
    resave: true,
    saveUninitialized: false,
    maxAge: Date.now() + 1800000,
    cookie: {
        expires: 1800000
    }
}));

//Stripe Purchase API Call
app.post('/purchase', function(req, res) {
  fs.readFile('items.json', function(error, data) {
    if (error) {
      res.status(500).end()
      return
    } 
    else {
      const itemsJson = JSON.parse(data)
      const itemsArray = itemsJson.music.concat(itemsJson.merch)
      let total = 0
      const emailAddress = "example2@gmail.com"
      console.log("Collecting order info")
        
      var sql = "SELECT ShippingId AS ShippingId FROM shippingdetails ORDER BY ShippingId DESC LIMIT 1"
      var sql2 = "SELECT PaymentId AS PaymentId FROM paymentdetails ORDER BY PaymentId DESC LIMIT 1"
     
      var parsed = 0;
      var parsed2 = 0;
      var parsed3 = 0;
        
      const connection = getConnection()
      connection.query(sql, 1, (error, results, fields) => {
        if (error)
          return console.error(error.message);
          
         var parser = JSON.stringify(results)
         var almost = parser.replace("[{\"ShippingId\":", "")
         var finished = almost.replace("}]", "")
         parsed = parsed + parseInt(finished, 10)
         connection.query(sql2, 1, (error, results, fields) => {
           if (error)
             return console.error(error.message);
             
             var parser2 = JSON.stringify(results)
             var almost2 = parser2.replace("[{\"PaymentId\":", "")
             var finished2 = almost2.replace("}]", "")
             parsed2 = parsed2 + parseInt(finished2, 10)
             
             console.log("shippingid = "+parsed)
             console.log("payment id = "+parsed2)
             
             const shippingId = parsed+1
             const paymentId = parsed2+1
             const orderStatus = "Processed"
             
             var queryString4 = "insert into orders (ShippingId, PaymentId, EmailAddress, OrderStatus) values (?,?,?,?)"
             
             getConnection().query(queryString4, [shippingId, paymentId, emailAddress, orderStatus], (err, results, fields) => {
               if(err) {
                 console.log("Insert failed order")
                 console.log(shippingId)
                 console.log(paymentId)
                 res.sendStatus(500)
                 return
               }
             });
           });
         })
         res.end()



      req.body.items.forEach(function(item) {
        const itemJson = itemsArray.find(function(i) {
          return i.id == item.id
        })

        console.log(item.id)
          
        total = total + itemJson.price * item.quantity
          
        if (item.id == 9999){}
        else{
          var sql = "SELECT OrderId AS OrderId FROM orders ORDER BY OrderId DESC LIMIT 1"
          var parsed = 0;
          getConnection().query(sql, 1, (error, results, fields) => {
            if (error)
              return console.error(error.message);
              
            var parser = JSON.stringify(results)
            var almost = parser.replace("[{\"OrderId\":", "")
            var finished = almost.replace("}]", "")
            parsed3 = parseInt(finished, 10)
            var orderId= parsed3+1
            var partId = item.id
            var orderQuantity = item.quantity
            
            console.log("order id = "+orderId)
              
            const queryString3 = "insert into orderedparts (OrderId, PartId, OrderedQuantity) values (?,?,?)"

            getConnection().query(queryString3, [orderId, partId, orderQuantity], (err, results, fields) => {
              if(err) {
                console.log("Insert failed order")
                console.log(orderId)
                console.log(partId)
                console.log(orderQuantity)
                res.sendStatus(500)
                return
              }
            })
           })
         }
      })

      stripe.charges.create({
        amount: total,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(function() {
        console.log('Charge Successful')
        //res.json({ message: 'Successfully purchased items' })

      }).catch(function() {
        console.log('Charge Fail')
        res.status(500).end()
      })
    }
  })
})

app.post('/loginCheck', [
    body('username').trim().escape(),
    body('password').trim().escape()
], function(req, res) {
    var username = req.body.username
    var password = req.body.password
    var loggedOn

    var queryString = "SELECT EmailAddress, Password FROM accounts WHERE EmailAddress = ? AND Password = ?"

    helper1.getConnection().query(queryString, [username, password], (err,results, field) =>{
        if(err){
          console.log("Failed to query: " +err)
          console.log(results)
          return
        }
        if(results.length === 0 || results == null){
            console.log("Failed Login")
            attempts --;
            if(attempts == 0){
                console.log("3 failed attempts");
                window.close();
            }

        }else{
            console.log("Successful Login");
            req.session.username = username;

            //all file headers must show My Account instead of Login
            fs.readFile('views/index.ejs', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/login/g, 'my-account');
                //console.log("index replaced!")
                fs.writeFile('views/index.ejs', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
             });
            fs.readFile('views/listing-details.ejs', 'utf8', function (err,data) {
               if (err) return console.log(err);
               var result = data.replace(/login/g, 'my-account');
               //console.log("listing-details replaced!")
               fs.writeFile('views/listing-details.ejs', result, 'utf8', function (err) {
                   if (err) return console.log(err);
               });
            });
            fs.readFile('views/manage-users.ejs', 'utf8', function (err,data) {
               if (err) return console.log(err);
               var result = data.replace(/login/g, 'my-account');
               //console.log("manage-users replaced!")
               fs.writeFile('views/manage-users.ejs', result, 'utf8', function (err) {
                   if (err) return console.log(err);
               });
            });
            fs.readFile('views/shop.ejs', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/login/g, 'my-account');
                //console.log("shop replaced!")
                fs.writeFile('views/shop.ejs', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
            fs.readFile('views/shop-details.ejs', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/login/g, 'my-account');
                //console.log("shop-details replaced!")
                fs.writeFile('views/shop-details.ejs', result, 'utf8', function (err) {
                   if (err) return console.log(err);
                });
            });
            fs.readFile('views/trailer-details.ejs', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/login/g, 'my-account');
                //console.log("trailer-details replaced!")
                 fs.writeFile('views/trailer-details.ejs', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                 });
             });
            fs.readFile('views/trailers.ejs', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/login/g, 'my-account');
                //console.log("trailers replaced!")
                fs.writeFile('views/trailers.ejs', result, 'utf8', function (err) {
                   if (err) return console.log(err);
                });
            });
            fs.readFile('views/trucks.ejs', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/login/g, 'my-account');
                //console.log("trucks replaced!")
                fs.writeFile('views/trucks.ejs', result, 'utf8', function (err) {
                   if (err) return console.log(err);
                });
            });
            fs.readFile('Front End/about-us.html', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/login/g, 'my-account');
                //console.log("about-us replaced!")
                fs.writeFile('Front End/about-us.html', result, 'utf8', function (err) {
                   if (err) return console.log(err);
                });
            });
            fs.readFile('Front End/cart.html', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/login/g, 'my-account');
                //console.log("cart replaced!")
                fs.writeFile('Front End/cart.html', result, 'utf8', function (err) {
                   if (err) return console.log(err);
                });
            });

            //redirect user back to the home page
            const itemString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, Picture as imgName from parts LIMIT 4;"
            const truckString = "SELECT TruckId AS id, TruckName as name, EmailAddress as email, TruckDescription as blah from trucks;"

            helper1.getConnection().query(itemString, (err,result,fields) =>{
                helper1.getConnection().query(truckString, (err,trucks,fields) =>{
                    res.render('index.ejs', {
                        items: result,
                        listings: trucks
                    })
                })
            })
        }
    })
})

//middleware function
function checkAuth(req, res, next) {
  if (!req.session || !req.session.username) {
    console.log('You are not authorized to view this page');
  } else {
    next();
  }
}

app.post('/logout', function(req, res) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          }else {
            console.log("logged out")
            fs.readFile('views/index.ejs', 'utf8', function (err,data) {
                if (err) return console.log(err);
                var result = data.replace(/my-account/g, 'login');
                console.log("replaced!")
                fs.writeFile('views/index.ejs', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });

            const itemString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, Picture as imgName from parts LIMIT 4;"
            const truckString = "SELECT TruckId AS id, TruckName as name, EmailAddress as email, TruckDescription as blah from trucks;"

            helper1.getConnection().query(itemString, (err,result,fields) =>{
                helper1.getConnection().query(truckString, (err,trucks,fields) =>{
                    res.render('index.ejs', {
                        items: result,
                        listings: trucks
                    })
                })
            })
          }
        });
    }
})

app.get('/checkSession', checkAuth, function(req,res){
    //calls function checkAuth which will authenticate the session
    console.log("checkSession - user is authorized!");
})


app.get('/cart', function(req,res){
fs.readFile('items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        res.render('cart.ejs', {
            stripePublicKey: stripePublicKey,
            items: JSON.parse(data)
        })
    }
})
})
app.get('/postListing', function(req,res){
fs.readFile('items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        res.render('postListing.ejs', {
            stripePublicKey: stripePublicKey,
            items: JSON.parse(data)
        })
    }
})
})
app.listen(3000)
