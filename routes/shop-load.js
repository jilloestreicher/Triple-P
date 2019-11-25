require('dotenv').config({ path: './.env' })
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const helper = require ('../helper.js');
var helper1 = new helper();
const express = require('express')
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const fs = require("fs")

const router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))


router.get('/index', function(req,res){
    const connection = helper1.getConnection()
    const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, Picture as imgName from parts LIMIT 4;"
    
    connection.query(queryString, (err,result,fields) =>{
       if(err){
        console.log("Failed to query: " +err)
        res.sendStatus(500);
        res.render('/Front End/error-500.html')
        return
       }
        
       const truckString = "SELECT TruckId AS id, TruckName as name, EmailAddress as email, TruckDescription as blah, Picture as imgName from trucks;"
        
       connection.query(truckString, (err,trucks,fields) =>{
           res.render('index.ejs', {
               items: result,
               listings: trucks
           })
       })
    })
})

router.get('/shop', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts LIMIT 10;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              //res.render('/Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from parts"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('shop.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/shop/:offset', function(req,res){
    fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const offs = req.params.offset * 10 - 10
        const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts LIMIT 10 OFFSET ?;"
        
        
        connection.query(queryString, [offs], (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              console.log(offs)
              //res.sendStatus(500);
              res.redirect('/Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from parts"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('shop.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/trucks', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks LIMIT 10;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              //res.sendStatus(500);
              res.redirect('/Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trucks"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('trucks.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/truckShop/:offset', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const offs = req.params.offset * 10 - 10
        const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks LIMIT 10 OFFSET ?;"
        
        
        connection.query(queryString, [offs], (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              console.log(offs)
              //res.sendStatus(500);
              res.redirect('/Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trucks"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('trucks.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/trailers', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers LIMIT 10;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              //res.sendStatus(500);
              res.redirect('../Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trailers"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('trailers.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/trailerShop/:offset', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const offs = req.params.offset * 10 - 10
        const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers LIMIT 10 OFFSET ?;"
        
        
        connection.query(queryString, [offs], (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              //res.sendStatus(500);
              res.redirect('../Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trailers"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('trailers.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/manage-users', function(req,res){
        
        const connection = helper1.getConnection()
        const queryString = "SELECT EmailAddress AS email, FirstName AS first, LastName as last, PhoneNumber as phone from accounts;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              res.render('/Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            res.render('manage-users.ejs', {
            stripePublicKey: stripePublicKey,
            items: result
            })
        })
        
})

router.get('/parts/:id', (req, res) =>{
    console.log("Finding part with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const partId = req.params.id.trim()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT PartId as id, ItemName as name, PartDescription as blah, PriceUSD as price, Brand as brand, Picture as imgName FROM parts WHERE PartId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [partId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            res.render('/Front End/error-500.html')
            return
        }
        console.log("Sucessfully queried parts")
        
        res.render('shop-details.ejs', {
            items: result
        })
        
    })
    //ending response
    
})

router.get('/order/:id', (req,res) =>{
    const orderId = req.params.id
    const queryString = "SELECT OrderId as id, orderedParts.PartId as part, parts.PartId as partIn, OrderedQuantity as quan, PriceUSD as price, ItemName as name, Picture as imgName from orderedParts, parts WHERE orderedParts.OrderId = ? AND orderedParts.PartId = parts.PartId"
    const queryUser = "SELECT EmailAddress as email FROM orders WHERE OrderId = ?"

    console.log("Order lookup")

    helper1.getConnection().query(queryUser, [orderId], (err, accountresult) => {

        //if the user is not logged in, it will direct them to the login page
        if(!req.session || !req.session.username) {
            res.redirect('../login.html');
        }else{
            if(req.session.username === accountresult[0].email){
                helper1.getConnection().query(queryString, [orderId], (err, result, fields) => {
                    const billString = "SELECT orders.OrderId as id, paymentdetails.PaymentId as payment, orders.PaymentId as pay, paymentdetails.BillingFirstName as first, paymentdetails.BillingLastName as last, paymentdetails.EmailAddress as email, paymentdetails.BillingPhone as phone, paymentdetails.BillingCountry as country, paymentdetails.BillingState as state, paymentdetails.BillingCity as city, paymentdetails.BillingAddress as address FROM orders, paymentdetails WHERE OrderId = ? AND paymentdetails.PaymentId = orders.PaymentId;"

                    helper1.getConnection().query(billString, [orderId], (err, billing, fields) => {
                        const shipString = "SELECT orders.OrderId as id, orders.ShippingId as ship, shippingdetails.ShippingId as shipping, shippingdetails.ShippingAddress as address, shippingdetails.ShippingFirstName as first, shippingdetails.ShippingLastName as last, shippingdetails.ShippingCountry as country, shippingdetails.ShippingCity as city, shippingdetails.ShippingState as state, shippingdetails.ShippingPhone as phone, shippingdetails.EmailAddress as email from orders, shippingdetails WHERE OrderId = ? AND shippingdetails.ShippingId = orders.ShippingId;"
                        console.log(billing)
                        helper1.getConnection().query(shipString, [orderId], (err, shipping, fields) => {
                        console.log(shipping)
                            res.render('order-template.ejs', {
                                items: result,
                                bills: billing,
                                ships: shipping
                            })
                        })
                    })
                })
            }else{
                 console.log(req.session.username)
                 console.log(accountresult[0].email)
                 //res.redirect('../error-500.html');
            }
        }
    })
})

router.get('/orderHistory/:accounts', (req, res) => {

    const account = req.params.accounts
    const queryString = "SELECT orders.EmailAddress as email, orderedparts.OrderId as partid, ShippingId as ship, ShippingAddress as address, COUNT(orderedparts.PartId) as quan, orders.OrderId as id from orders, shippingdetails, orderedparts WHERE orders.EmailAddress = ? AND orders.OrderId = orderedparts.OrderId"

    //if the user is not logged in, it will direct them to the login page
    if(!req.session || !req.session.username) {
        res.redirect('../login.html');
    }else{
        if(req.session.username === account){
            helper1.getConnection().query(queryString, [account], (err, result, fields) => {
                res.render('order-history.ejs',{
                    orders: result
                })
            })
        }else{
          console.log(req.session.username)
          console.log(accountresult[0].email)
          //res.redirect('../error-500.html');
        }
    }
})

router.get('/trucks/:id', (req, res) =>{
    console.log("Finding truck with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const truckId = req.params.id.trim().escape()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT TruckId as id, TruckName as name, TruckDescription as blah, EmailAddress as email, Brand as brand, DriveType as drive, KMPerHour as km, FuelType as fuel, Color as color, Picture as imgName FROM trucks WHERE TruckId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [truckId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            res.render('/Front End/error-500.html')
            return
        }
        console.log("Sucessfully queried trucks")
        
        res.render('listing-details.ejs', {
            items: result
        })
        
    })
    //ending response
    
})

router.get('/trailers/:id', (req, res) =>{
    console.log("Finding trailer with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const trailerId = req.params.id.trim().escape()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT TrailerId as id, TrailerName as name, TrailerDescription as blah, EmailAddress as email, Brand as brand, Length as length, Width as width, Color as color, Picture as imgName FROM trailers WHERE TrailerId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [truckId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            res.render('/Front End/error-500.html')
            return
        }
        console.log("Sucessfully queried trailers")
        
        res.render('trailer-details.ejs', {
            items: result
        })
        
    })
    //ending response
    
})

module.exports = router
