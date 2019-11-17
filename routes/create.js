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



router.post('/create_listing', [
    body('truck_name').trim().escape(),
    body('truck_brand').trim().escape(),
    body('truck_km').trim().escape(),
    body('truck_fuel').trim().escape(),
    body('truck_drive').trim().escape(),
    body('truck_color').trim().escape()
],
 (req,res) => {
    
    console.log("Creating Listing")
    
    const truckName = req.body.truck_name
    const truckBrand = req.body.truck_brand
    const truckKM = req.body.truck_km
    const truckFuel = req.body.truck_fuel
    const truckDrive = req.body.truck_drive
    const truckColor = req.body.truck_color
    
    const email = "example2@gmail.com"
    
    const queryString = "insert into trucks (TruckName, Brand, KMPerHour, FuelType, DriveType, Color, EmailAddress) values (?,?,?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [truckName, truckBrand, truckKM, truckFuel, truckDrive, truckColor, email], (err, results, fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(truckName)
            console.log(truckBrand)
            console.log(truckKM)
            console.log(truckFuel)
            console.log(truckDrive)
            console.log(truckColor)
            console.log(email)
            res.sendStatus(500)
            return
        }
        
        res.end()
    })
})

router.post('/create_part', [
    body('part_name').trim().escape(),
    body('part_desc').trim().escape(),
    body('part_price').trim().escape(),
    body('part_brand').trim().escape(),
    body('part_quan').trim().escape()
], (req,res) => {
    
    console.log("Creating Part")
    
    const partName = req.body.part_name
    const partDesc = req.body.part_desc
    const partPrice = req.body.part_price * 100
    const partBrand = req.body.part_brand
    const partQuan = req.body.part_quan
    
    const queryString = "insert into parts (ItemName, Brand, PriceUSD, PartDescription, QuantityOnHand) values (?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [partName, partBrand, partPrice, partDesc, partQuan], (err, results, fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(results)
            console.log(partName)
            console.log(partDesc)
            console.log(partPrice)
            console.log(partBrand)
            console.log(partQuan)
            res.sendStatus(500)
            return
        }
        fs.writeFile('../items.json', results, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
        
        res.end()
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
            return
        }
        
        res.render('account-created.html')
    })
})

module.exports = router