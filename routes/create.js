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
const multer = require("multer");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./Front End/img/product")
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

const upload = multer({
    storage: storage
})

const router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))



router.post('/create_listing', upload.single("file"), (req,res) => {
    
    console.log("Creating Listing")
    
    const truckName = req.body.truck_name
    const truckBrand = req.body.truck_brand
    const truckKM = req.body.truck_km
    const truckFuel = req.body.truck_fuel
    const truckDrive = req.body.truck_drive
    const truckColor = req.body.truck_color
    const truckDesc = req.body.truck_desc
    var picture = req.file.filename
    picture = picture.slice(0,-4)
    const time = req.body.time
    const email = "test@test.com"
    
    const queryString = "insert into trucks (TruckName, Brand, KMPerHour, FuelType, DriveType, Color, EmailAddress, TruckDescription, Picture, RemoveTime) values (?,?,?,?,?,?,?,?,?, current_timestamp + interval ? day)"
    
    helper1.getConnection().query(queryString, [truckName, truckBrand, truckKM, truckFuel, truckDrive, truckColor, email, truckDesc, picture, time], (err, results, fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(truckName)
            console.log(truckBrand)
            console.log(truckKM)
            console.log(truckFuel)
            console.log(truckDrive)
            console.log(truckColor)
            console.log(email)
            console.log(truckDesc)
            console.log(picture)
            console.log(err)
            //res.sendStatus(500)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        res.end()
    })
})

router.post('/trailer_listing', upload.single("file"), (req,res) => {
    
    const trailerName = req.body.trailer_name
    const trailerBrand = req.body.trailer_brand
    const trailerLength = req.body.trailer_length
    const trailerWidth = req.body.trailer_width
    const trailerDesc = req.body.trailer_desc
    const trailerColor = req.body.trailer_color
    var picture = req.file.filename
    picture = picture.slice(0,-4)
    
    //FIX TO PULL FROM SESSION
    const email = "example2@gmail.com"
    
    const queryString = "insert into trailers (TrailerName, Brand, Length, Width, TrailerDescription, Color, EmailAddress, Picture) values (?,?,?,?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [trailerName, trailerBrand, trailerLength, trailerWidth, trailerDesc, trailerColor, email, picture], (err,results,fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(trailerName)
            console.log(trailerBrand)
            console.log(trailerLength)
            console.log(trailerWidth)
            console.log(trailerDesc)
            console.log(trailerColor)
            console.log(email)
            console.log(picture)
            console.log(err)
            res.redirect('/Front End/error-500.html')
            return
        }
        else{
            if(req.file) {
                res.json(req.file);
            }
        }
        
        res.end()
    })
    
})

router.post('/create_part', upload.single("file"),  (req,res) => {
    
    console.log("Creating Part")
    
    const partName = req.body.part_name
    const partDesc = req.body.part_desc
    const partPrice = req.body.part_price * 100
    const partBrand = req.body.part_brand
    const partQuan = req.body.part_quan
    var picture = req.file.filename
    picture = picture.slice(0,-4)
    
    const queryString = "insert into parts (ItemName, Brand, PriceUSD, PartDescription, QuantityOnHand, Picture) values (?,?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [partName, partBrand, partPrice, partDesc, partQuan, picture], (err, results, fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(results)
            console.log(partName)
            console.log(partDesc)
            console.log(partPrice)
            console.log(partBrand)
            console.log(partQuan)
            console.log(picture)
            //res.sendStatus(500)
            res.redirect('/Front End/error-500.html')
            return
        }
        fs.writeFile('../items.json', results, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
        
        res.redirect('/Front End/list-sucess.html')
    })
})

router.post('/create_account', [
    body('account_first').trim().escape(),
    body('account_last').trim().escape(),
    body('account_email').trim().escape(),
    body('account_password').trim().escape()
], (req,res) => {
    
    const accountFirst = req.body.account_first
    const accountLast = req.body.account_last
    const accountEmail = req.body.account_email
    const accountPass = req.body.account_pass
    const elist = true
    
    const queryString = "insert into accounts (FirstName, LastName, EmailAddress, Password, EmailList) values (?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [accountFirst, accountLast, accountEmail, accountPass, elist], (err, results, fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(results)
            console.log(accountFirst)
            console.log(accountLast)
            console.log(accountEmail)
            console.log(accountPass)
            res.sendStatus(500)
            res.render('/Front End/error-500.html')
            return
        }
        
        res.render('/Front End/account-created.html')
    })
})

router.post('/collect_shippingandbilling', (req,res) => {

    console.log("Collecting shipping info")
    const emailAddress = req.session.username;
   // const emailAddress = req.body.emailAddress
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const country = req.body.country
    const state = req.body.state
    const town = req.body.town
    const zip = req.body.town
    const address = req.body.address
    const address2 = req.body.address
    const phoneNumber = req.body.phoneNumber

    const queryString2 = "insert into shippingdetails (ShippingAddress, ShippingAddress2, ShippingFirstName, ShippingLastName, ShippingCountry, ShippingCity, ShippingState, ShippingZIP, ShippingPhone, EmailAddress) values (?,?,?,?,?,?,?,?,?,?)"

    helper1.getConnection().query(queryString2, [address, address2, firstName, lastName, country, town, state, zip, phoneNumber, emailAddress], (err, results, fields) => {
        if(err) {
            console.log("Insert failed ship")
            console.log(emailAddress)
             console.log(firstName)
             console.log(lastName)
                        console.log(country)
                        console.log(state)
                        console.log(town)
                        console.log(address)
                        console.log(address2)
                        console.log(phoneNumber)
            res.sendStatus(500)
            return
        }

        res.end()
    })

    console.log("Collecting billing info")

    const cardNum = 555
    const cardMonth = "cardmonth"
    const cardYear = "cardyear"
    const securityCode = "eseccode"
    const billingEmailAddress = req.session.username;
    const billingFirstName = req.body.billingFirstName
    const billingLastName = req.body.billingLastName
    const billingCountry = req.body.billingCountry
    const billingState = req.body.billingState
    const billingTown = req.body.billingTown
    const billingZip = req.body.billingZip
    const billingAddress = req.body.billingAddress
    const billingAddress2 = req.body.billingAddress2
    const billingPhone = req.body.billingPhone

    const queryString = "insert into paymentdetails (CardNum, CardMonth, CardYear, SecurityCode, BillingAddress, BillingAddress2, BillingFirstName, BillingLastName, BillingCountry, BillingCity, BillingState, BillingZIP, BillingPhone, EmailAddress) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

    helper1.getConnection().query(queryString, [cardNum, cardMonth, cardYear, securityCode, billingAddress, billingAddress2, billingFirstName, billingLastName, billingCountry, billingTown, billingState, billingZip, billingPhone, billingEmailAddress], (err, results, fields) => {
        if(err) {
            console.log("Insert failed bill")
            console.log(emailAddress)
             console.log(cardNum)
             console.log(cardMonth)
                        console.log(cardYear)
                        console.log(securityCode)
                        console.log(billingFirstName)
                        console.log(billingLastName)
                        console.log(billingCountry)
                        console.log(billingState)
                        console.log(billingTown)
                   console.log(billingZip)
                   console.log(billingAddress)
                    console.log(billingAddress2)
                    console.log(billingPhone)
            res.sendStatus(500)
            return
        }

        res.redirect('/checkout');
    })
})

module.exports = router
