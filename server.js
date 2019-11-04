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
const JSAlert = require('js-alert')


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

//Define attempts for login
var attempts = 3;

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
                JSAlert.alert("Failed Login")
            }else{
                console.log("Successful Login");

                //cookie
                // Create a cookies object
                var keys = ['log on']
                 var c = new cookies(req, res, { keys: keys })
                //set cookie value
                 c.set('Logon', new Date().toISOString(), { signed: true })
                 console.log("Cookie is set");

                 /*var cname = "logged in";
                 setCookie(cname, username);
                 console.log("setCookie executed");
                 checkCookie(); */

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
        })
          })
             //create login cookie
             /*function setCookie(cname, username) {
               console.log("Cookie created!");
               var loginCookie = document.cookie;
               document.cookie = cname + "=" + username + "; path=/";
             }
             function checkCookie() {
               var user = getCookie("username");
               if (user != "") {
                 alert("Welcome again " + user);
                 //put route to index here
               } else {
                 alert("Cookie Error");
               }
            } */

app.listen(3000)
