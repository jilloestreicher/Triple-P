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
const passwordHash = require('password-hash')

//Set up the express engine

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('./Front End'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./static/'));

//Establish session

app.use(session({
    secret: "loggedOn",
    resave: true,
    saveUninitialized: false,
    maxAge: Date.now() + 1800000,
    cookie: {
        expires: 1800000
    }
}));

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

//Stripe Purchase API Call
app.post('/purchase', function(req, res) {
    
    console.log('Starting Purchase')
    
  fs.readFile('items.json', function(error, data) {
    if (error) {
      console.log('Purchase Fail')
      res.status(500).end()
      return
    } 
    else {
      const itemsJson = JSON.parse(data)
      const itemsArray = itemsJson.parts.concat(itemsJson.merch)
      let total = 0
      const emailAddress = "example2@gmail.com"
      console.log("Collecting order info")
        
      var sql = "SELECT ShippingId AS ShippingId FROM shippingdetails ORDER BY ShippingId DESC LIMIT 1"
      var sql2 = "SELECT PaymentId AS PaymentId FROM paymentdetails ORDER BY PaymentId DESC LIMIT 1"
     
      var parsed = 0;
      var parsed2 = 0;
      var parsed3 = 0;
        
      const connection = helper1.getConnection()
      console.log("Before Ship Query")
      connection.query(sql, 1, (error, results, fields) => {
        if (error){
          return console.error(error.message);
        }
          
         var parser = JSON.stringify(results)
         var almost = parser.replace("[{\"ShippingId\":", "")
         var finished = almost.replace("}]", "")
         parsed = parsed + parseInt(finished, 10)
         console.log("Before Pay Query")
         connection.query(sql2, 1, (error, results, fields) => {
           if (error){
             return console.error(error.message);
           }
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
             connection.query(queryString4, [parsed, parsed2, emailAddress, orderStatus], (err, resulto, fields) => {
               if(err) {
                 console.log("Insert failed order -initial order")
                 console.log(err)
                 console.log(parsed)
                 console.log(parsed2)
                 res.sendStatus(500)
                 return
               }
               console.log("Order Inserted!!")
             });
           });
         })
         



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
          helper1.getConnection().query(sql, 1, (error, resultp, fields) => {
            if (error)
              return console.error(error.message);
              
            var parser = JSON.stringify(resultp)
            var almost = parser.replace("[{\"OrderId\":", "")
            var finished = almost.replace("}]", "")
            parsed3 = parseInt(finished, 10)
            var orderId= parsed3+1
            var partId = item.id
            var orderQuantity = item.quantity
            
            console.log("order id = "+orderId)
              
            const queryString3 = "insert into orderedparts (OrderId, PartId, OrderedQuantity) values (?,?,?)"

            helper1.getConnection().query(queryString3, [orderId, partId, orderQuantity], (err, results, fields) => {
              if(err) {
                console.log("Insert failed order -Part")
                console.log(orderId)
                //console.log(err)
                console.log(partId)
                console.log(orderQuantity)
                res.sendStatus(500)
                return
              }
            })
           })
         }
      })

      //Sends a charge to Stripe 
        
      stripe.charges.create({
        amount: total,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(function() {
        console.log('Charge Successful')
        res.json({ message: 'Successfully purchased items' })

      }).catch(function() {
        console.log('Charge Fail')
        res.status(500)
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
    var hashedPassword = ' ';

    //get hashed version of password
    var queryPass = "SELECT Password FROM accounts WHERE EmailAddress = ?";

    helper1.getConnection().query(queryPass, [username], (err,results, field) =>{
        if(err){
          console.log("Failed to query: " +err)
          res.redirect('/Front End/error-500.html')
          return
        } else{
            var correctPass = passwordHash.verify(password, results[0].Password); //should return true or false

            if(correctPass === true){
                hashedPassword = results[0].Password;
            }else{
                console.log("Error -  wrong password");
            }

            var queryString = "SELECT EmailAddress, Password FROM accounts WHERE EmailAddress = ? AND Password = ?"

            helper1.getConnection().query(queryString, [username, hashedPassword], (err,results, field) =>{
                if(err){
                  console.log("Failed to query: " +err)
                  res.redirect('/Front End/error-500.html')
                  return
                } 

                if(results.length == 0 || results == null){
                    console.log("Failed Login")
                    attempts --;
                    if(attempts == 0){
                        console.log("3 failed attempts");
                        window.close();
                    }
                    res.redirect('/loginCheck');

                }else{
                    console.log("Successful Login");
                    req.session.username = username;

                    //redirect user back to the home page
                    res.redirect('/index')
                }
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
                var result = data.replace(/Logout/g, 'login');
                //console.log("replaced!")
                fs.writeFile('views/index.ejs', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });

            res.redirect('/index')
          }
        });
    }
})

app.get('/checkSession', checkAuth, function(req,res){
    //calls function checkAuth which will authenticate the session
    console.log("checkSession - user is authorized!" + req.session.username);
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

app.get('/checkout', function(req,res){
fs.readFile('items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        res.render('checkout.ejs', {
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
    }else{
        const queryUser = "SELECT EmailAddress as email FROM admins"

        helper1.getConnection().query(queryUser, (err, accountresult) => {
            
            if(err){
              console.log("Failed to query: " +err)
              res.redirect('/Front End/error-500.html')
              return
            } 
            
            //if the user is not logged in, it will direct them to the login page
            if(!req.session || !req.session.username) {
                res.redirect('../Front End/login.html');
            }else{
                res.render('postlisting.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: JSON.parse(data)
                })
            }
        })
    }
})
})

app.get('/postTrailer', function(req,res){
fs.readFile('items.json', function(error, data){
    if(error) {
      res.status(500).end()
    }else{
        const queryUser = "SELECT EmailAddress as email FROM admins"

        helper1.getConnection().query(queryUser, (err, accountresult) => {
            
            if(err){
              console.log("Failed to query: " +err)
              res.redirect('/Front End/error-500.html')
              return
            } 
            
            //if the user is not logged in, it will direct them to the login page
            if(!req.session || !req.session.username) {
                res.redirect('../Front End/login.html');
            }else{
                res.render('posttrailer.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: JSON.parse(data)
                })
            }
        })
    }
})
})

app.get('/changeLoginButton', function(req,res){
    if(req.session && req.session.username) {
        //all file headers must show Logout instead of Login
        fs.readFile('views/index.ejs', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/login/g, 'Logout');
            //console.log("index replaced!")
            fs.writeFile('views/index.ejs', result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
         });
         fs.readFile('views/index.ejs', 'utf8', function (err,data) {
             if (err) return console.log(err);
             var result = data.replace(/login/g, 'Logout');
             //console.log("index replaced!")
             fs.writeFile('views/index.ejs', result, 'utf8', function (err) {
                 if (err) return console.log(err);
             });
          });
        fs.readFile('views/listing-details.ejs', 'utf8', function (err,data) {
           if (err) return console.log(err);
           var result = data.replace(/login/g, 'Logout');
           //console.log("listing-details replaced!")
           fs.writeFile('views/listing-details.ejs', result, 'utf8', function (err) {
               if (err) return console.log(err);
           });
        });
        fs.readFile('views/manage-users.ejs', 'utf8', function (err,data) {
           if (err) return console.log(err);
           var result = data.replace(/login/g, 'Logout');
           //console.log("manage-users replaced!")
           fs.writeFile('views/manage-users.ejs', result, 'utf8', function (err) {
               if (err) return console.log(err);
           });
        });
        fs.readFile('views/shop.ejs', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/login/g, 'Logout');
            //console.log("shop replaced!")
            fs.writeFile('views/shop.ejs', result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
        fs.readFile('views/shop-details.ejs', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/login/g, 'Logout');
            //console.log("shop-details replaced!")
            fs.writeFile('views/shop-details.ejs', result, 'utf8', function (err) {
               if (err) return console.log(err);
            });
        });
        fs.readFile('views/trailer-details.ejs', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/login/g, 'Logout');
            //console.log("trailer-details replaced!")
             fs.writeFile('views/trailer-details.ejs', result, 'utf8', function (err) {
                if (err) return console.log(err);
             });
         });
        fs.readFile('views/trailers.ejs', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/login/g, 'Logout');
            //console.log("trailers replaced!")
            fs.writeFile('views/trailers.ejs', result, 'utf8', function (err) {
               if (err) return console.log(err);
            });
        });
        fs.readFile('views/trucks.ejs', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/login/g, 'Logout');
            //console.log("trucks replaced!")
            fs.writeFile('views/trucks.ejs', result, 'utf8', function (err) {
               if (err) return console.log(err);
            });
        });
        fs.readFile('Front End/about-us.html', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/login/g, 'Logout');
            //console.log("about-us replaced!")
            fs.writeFile('Front End/about-us.html', result, 'utf8', function (err) {
               if (err) return console.log(err);
            });
        });
        fs.readFile('Front End/cart.html', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/login/g, 'Logout');
            //console.log("cart replaced!")
            fs.writeFile('Front End/cart.html', result, 'utf8', function (err) {
               if (err) return console.log(err);
            });
        });
    }else{
        fs.readFile('views/index.ejs', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/Logout/g, 'login');
            //console.log("replaced!")
            fs.writeFile('views/index.ejs', result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        })
        fs.readFile('views/trucks.ejs', 'utf8', function (err,data) {
            if (err) return console.log(err);
            var result = data.replace(/Logout/g, 'login');
            //console.log("replaced!")
            fs.writeFile('views/trucks.ejs', result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        })
    }
})

app.listen(3000)
