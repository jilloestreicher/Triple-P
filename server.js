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

const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const fs = require("fs")
const stripe = require('stripe')(stripeSecretKey)
const cookies = require('cookies')

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

//Connect to DB

function getConnection(){
    return mysql.createConnection({
      host:'localhost',
      user:'root',
      password:'Capping2',
      database:'acsas'
    })
}


//Stripe Purchase API Call
app.post('/purchase', function(req, res) {
    
  //Pull the item information from the items.json file
    
  //TODO: Possibly pull this from user's cart!!
    
  fs.readFile('items.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      const itemsJson = JSON.parse(data)
      const itemsArray = itemsJson.parts.concat(itemsJson.merch)
      let total = 0
      req.body.items.forEach(function(item) {
        const itemJson = itemsArray.find(function(i) {
          return i.id == item.id
        })
        total = total + itemJson.price * item.quantity
      })

      //Send a charge to Stripe
      stripe.charges.create({
        amount: total,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(function() {
        console.log('Charge Successful')
        res.json({ message: 'Successfully purchased items' })
      }).catch(function() {
        console.log('Charge Fail')
        res.status(500).end()
      })
    }
  })
})

app.post('/loginCheck', function(req, res) {
    var username = req.body.username
    var password = req.body.password
    var loggedOn

    var queryString = "SELECT EmailAddress, Password FROM accounts WHERE EmailAddress = ? AND Password = ?"

    getConnection().query(queryString, [username, password], (err,results, field) =>{
        if(err){
          console.log("Failed to query: " +err)
          console.log(results)
          //res.sendStatus(500);
          //res.end()
          return
        }
        if(results.length === 0 || results == null){
            console.log("Failed Login")
        }else{
            console.log("Successful Login");

            //create a cookie with a half-hour expiration date
            var keys = ['log on']
            var c = new cookies(req, res, { keys: keys })
            res.cookie("login", username, {expire: 1800000 + Date.now()});

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
                fs.writeFile('about-us.html', result, 'utf8', function (err) {
                   if (err) return console.log(err);
                });
            });

            //redirect user back to the home page
            const itemString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, Picture as imgName from parts LIMIT 4;"
            const truckString = "SELECT TruckId AS id, TruckName as name, EmailAddress as email, TruckDescription as blah from trucks;"

            getConnection().query(itemString, (err,result,fields) =>{
                getConnection().query(truckString, (err,trucks,fields) =>{
                    res.render('index.ejs', {
                        items: result,
                        listings: trucks
                    })
                })
            })
        }

        //if the user is not logged in, display log in button
        if(!loggedOn){
            console.log("undefined")
        }else{
            console.log("logged on")
            // res.send({success: true, message: '<li> <p> <a href="my-account.html">My Account</a></p></li>'});
        }
    })
})

app.post('/logout', function(req, res) {
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

    getConnection().query(itemString, (err,result,fields) =>{
        getConnection().query(truckString, (err,trucks,fields) =>{
            res.render('index.ejs', {
                items: result,
                listings: trucks
            })
        })
    })
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
app.listen(3000)
