/*
 * File: create.js
 * Authors: TripleP (Alex Smith, Herbert Glaser, Kaitlyn Dominguez)
 * Version: 1.2
 *
 * Contains the API calls for creating new objects in the 
 * ACSAS Database.
 */


require('dotenv').config({ path: './.env' })
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const fs = require("fs")

const router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))

function getConnection(){
    return mysql.createConnection({
      host:'localhost',
      user:'root',
      password:'Capping2',
      database:'acsas'
    })
}

//Create a new truck listing

//TODO: Create a new trailer listing!!
router.post('/create_listing', (req,res) => {
    
    console.log("Creating Listing")
    
    //Pull information from the form
    const truckName = req.body.truck_name
    const truckBrand = req.body.truck_brand
    const truckKM = req.body.truck_km
    const truckFuel = req.body.truck_fuel
    const truckDrive = req.body.truck_drive
    const truckColor = req.body.truck_color
    
    //For testing purposes until login is solved
    const email = "example2@gmail.com"
    
    const queryString = "insert into trucks (TruckName, Brand, KMPerHour, FuelType, DriveType, Color, EmailAddress) values (?,?,?,?,?,?,?)"
    
    getConnection().query(queryString, [truckName, truckBrand, truckKM, truckFuel, truckDrive, truckColor, email], (err, results, fields) => {
        if(err) {
            
            //Debug code, will be removed in final version
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

router.post('/create_trailer', (req,res) => {
    
    console.log("Creating Trailer")
    
    //Pull information from the form
    const trailerName = req.body.trailer_name
    const trailerBrand = req.body.trailer_brand
    const trailerLength = req.body.trailer_length
    const trailerWidth = req.body.trailer_width
    const trailerColor = req.body.trailer_color
    
    //For testing purposes until login is solved
    const email = "example2@gmail.com"
    
    const queryString = "insert into trailers (TrailerName, Brand, Length, Width, Color, EmailAddress) values (?,?,?,?,?,?)"
    
    getConnection().query(queryString, [trailerName, trailerBrand, trailerLength, trailerWidth, trailerColor, email], (err, results, fields) => {
        if(err) {
            
            //Debug code, will be removed in final version
            console.log("Insert failed")
            console.log(trailerName)
            console.log(trailerBrand)
            console.log(trailerLength)
            console.log(trailerWidth)
            console.log(trailerColor)
            console.log(email)
            res.sendStatus(500)
            return
        }
        
        res.end()
    })
})

//Insert new part into the DB
router.post('/create_part', (req,res) => {
    
    console.log("Creating Part")
    
    const partName = req.body.part_name
    const partDesc = req.body.part_desc
    const partPrice = req.body.part_price
    const partBrand = req.body.part_brand
    const partQuan = req.body.part_quan
    
    const queryString = "insert into parts (PartName, Brand, PriceUSD, PartDescription, QuantityOnHand) values (?,?,?,?,?)"
    
    getConnection().query(queryString, [partName, partBrand, partPrice, partDesc, partQuan], (err, results, fields) => {
        if(err) {
            
            //Debug code, will be removed in final version
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
        
        res.end()
    })
})

module.exports = router