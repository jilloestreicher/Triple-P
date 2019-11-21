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

router.post('/edit_Part', [
    body('part_id').trim(),
    body('part_name').trim(),
    body('part_price').trim(),
    body('part_desc').trim(),
    body('part_brand').trim(),
    body('part_quan').trim()], (req,res) => {
    
    const partId = req.body.part_id
    const partName = req.body.part_name
    const partPrice = req.body.part_price
    const partDesc = req.body.part_desc
    const partBrand = req.body.part_brand
    const partQuan = req.body.part_quan
    
    const queryString = "update parts set ItemName=?, PriceUSD=?, PartDescription=?, Brand=?, QuantityOnHand=? where PartId=?"
    
    helper1.getConnection().query(queryString, [partName, partPrice, partDesc, partBrand, partQuan, partId], (err,result,fields) => {
        
        if(err) {
            console.log("Update failed")
            console.log(partId)
            console.log(partBrand)
            console.log(partPrice)
            console.log(partDesc)
            console.log(partBrand)
            console.log(partQuan)
            console.log(partId)
            res.sendStatus(500)
            //res.redirect('/Front End/error-500.html')
            return
        }
        
        console.log("Updated Part")
        res.end()
    })
    
})

router.post('/edit_truck', [
    body('truck_id').trim(),
    body('truck_name').trim(),
    body('truck_drive').trim(),
    body('truck_desc').trim(),
    body('truck_brand').trim(),
    body('truck_km').trim(),
    body('truck_fuel').trim(),
    body('truck_color').trim()
    ], (req,res) => {
    
    const truckId = req.body.truck_id
    const truckName = req.body.truck_name
    const truckDrive = req.body.truck_drive
    const truckDesc = req.body.truck_desc
    const truckBrand = req.body.truck_brand
    const truckKm = req.body.truck_km
    const truckFuel = req.body.truck_fuel
    const truckColor = req.body.truck_color
    
    const queryString = "update trucks set TruckName=?, DriveType=?, TruckDescription=?, Brand=?, KMPerHour=?, FuelType=?, Color=? where TruckId=?"
    
    helper1.getConnection().query(queryString, [truckName, truckDrive, truckDesc, truckBrand, truckKm, truckFuel, truckColor, truckId], (err,result,fields) => {
        
        if(err) {
            console.log("Update failed")
            
            res.sendStatus(500)
            //res.redirect('/Front End/error-500.html')
            return
        }
        
        console.log("Updated Truck")
        res.end()
    })
    
})

router.get('/editPart/:id', (req, res) =>{
    console.log("Finding part with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const partId = req.params.id.trim()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT PartId as id, ItemName as name, PartDescription as blah, PriceUSD as price, Brand as brand, Picture as imgName, QuantityOnHand as quan FROM parts WHERE PartId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [partId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            //res.redirect('../Front End/error-500.html')
            return
        }
        console.log("Sucessfully queried parts")
        
        res.render('editPart.ejs', {
            items: result
        })
        
    })
    //ending response
    
})

router.get('/editTruck/:id', (req, res) =>{
    console.log("Finding truck with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const truckId = req.params.id.trim()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT TruckId as id, TruckName as name, TruckDescription as blah, EmailAddress as email, Brand as brand, DriveType as drive, KMPerHour as km, FuelType as fuel, Color as color, Picture as imgName FROM trucks WHERE TruckId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [truckId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            //res.redirect('../Front End/error-500.html')
            return
        }
        console.log("Sucessfully queried trucks")
        
        res.render('editListing.ejs', {
            items: result
        })
        
    })
    //ending response
    
})

router.post('/remove_user', (req,res) => {
    const userId = req.body.user_id.trim()
    const con = helper1.getConnection()
    
    const queryString = "DELETE from accounts where EmailAddress = ?"
                    con.query(queryString, [userId], (err,result,fields) => {
                        if(err) {
                            console.log("Delete failed -acc")
                            console.log(userId)
			    console.log(err)
                            res.sendStatus(500)
                            //res.redirect('/Front End/error-500.html')
                            return
                        }
                        else{
                            console.log("Deleted User")
                            res.end()
                        }
                    })
})

router.get('/adminTrucks', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks;"
        
        
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
            
            res.render('adminTrucks.ejs', {
            stripePublicKey: stripePublicKey,
            items: result
            })
        })
        
    }
})
})

router.get('/adminParts', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts;"
        
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
            
            res.render('adminParts.ejs', {
            stripePublicKey: stripePublicKey,
            items: result
            })
        })
        
    }
})
})

router.post('/delete_part', (req,res) => {
    const partId = req.body.part_id.trim()
    const con = helper1.getConnection()
    
    const queryString = "DELETE from parts where PartId = ?"
    const orderString = "DELETE from orderedParts where PartId = ?"
                    con.query(orderString, [partId], (err,result,fields) => {
                        if(err) {
                            console.log("Delete failed -order")
                            console.log(partId)
			                console.log(err)
                            res.sendStatus(500)
                            //res.redirect('/Front End/error-500.html')
                            return
                        }
                        else{
                            con.query(queryString, [partId], (err,result,fields) => {
                              if(err) {
                            console.log("Delete failed -part")
                            console.log(partId)
			                console.log(err)
                            res.sendStatus(500)
                            //res.redirect('/Front End/error-500.html')
                            return
                        }  
                            else{
                            
                            console.log("Deleted Part")
                            res.end()
                        }
                            })
                        }
                    })
})

router.post('/delete_truck', (req,res) => {
    const truckId = req.body.truck_id.trim()
    const con = helper1.getConnection()
    
    const queryString = "DELETE from trucks where TruckId = ?"
                            con.query(queryString, [truckId], (err,result,fields) => {
                              if(err) {
                            console.log("Delete failed -truck")
                            console.log(truckId)
			                console.log(err)
                            res.sendStatus(500)
                            //res.redirect('/Front End/error-500.html')
                            return
                            }  
                            else{
                            
                            console.log("Deleted Truck")
                            res.end()
                        }
                            })
                        
})

router.post('/adminCheck', function(req,res) {
    var username = req.body.username
    var password = req.body.password
    var loggedOn

    var queryString = "SELECT EmailAddress, Password FROM admins WHERE EmailAddress = ? AND Password = ?"
    
    //FILL IN HERE FOR LOGIN STUFF
})


module.exports = router

