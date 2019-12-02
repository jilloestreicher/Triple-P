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
const passwordHash = require('password-hash')

const router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))

router.post('/edit_Part', [
    body('part_id').trim(),
    body('part_name').trim(),
    body('part_price').trim(),
    body('part_desc').trim(),
    body('part_brand').trim(),
    body('part_quan').trim()], (req,res) => {

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        //if the user is not logged in, it will direct them back to the home page
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                const partId = req.body.part_id
                const partName = req.body.part_name
                const partPrice = req.body.part_price
                const partDesc = req.body.part_desc
                const partBrand = req.body.part_brand
                const partQuan = req.body.part_quan

                const queryString = "update parts set ItemName=?, PriceUSD=?, PartDescription=?, Brand=?, QuantityOnHand=? where PartId=?"

                helper1.getConnection().query(queryString, [partName, partPrice, partDesc, partBrand, partQuan, partId], (err,result,fields) => {

                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }

                    console.log("Updated Part")
                    res.redirect('/adminParts')
                })
            }else{
                res.redirect('../index');
            }
        }
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

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
    
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

                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }

                    console.log("Updated Truck")
                    res.redirect('/adminTrucks')
                })
            }else{
                res.redirect('../index');
            }
        }
    })
})

router.post('/edit_trailer', [
    body('trailer_id').trim(),
    body('trailer_name').trim(),
    body('trailer_length').trim(),
    body('trailer_desc').trim(),
    body('trailer_brand').trim(),
    body('trailer_width').trim(),
    body('trailer_color').trim()
    ], (req,res) => {

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                const trailerId = req.body.trailer_id
                const trailerName = req.body.trailer_name
                const trailerDesc = req.body.trailer_desc
                const trailerBrand = req.body.trailer_brand
                const trailerLength = req.body.trailer_length
                const trailerWidth = req.body.trailer_width
                const trailerColor = req.body.trailer_color

                const queryString = "update trailers set TrailerName=?, Length=?, TrailerDescription=?, Brand=?, Width=?, Color=? where TrailerId=?"

                helper1.getConnection().query(queryString, [trailerName, trailerLength, trailerDesc, trailerBrand, trailerWidth, trailerColor, trailerId], (err,result,fields) => {

                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }

                    console.log("Updated Trailer")
                    res.redirect('/adminTrailers')
                })
            }else{
                res.redirect('../index');
            }
        }
    })
})

router.get('/editPart/:id', (req, res) =>{
    console.log("Finding part with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const partId = req.params.id.trim()

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){

                //? allows us to fill in with a different value
                const queryString = "SELECT PartId as id, ItemName as name, PartDescription as blah, PriceUSD as price, Brand as brand, Picture as imgName, QuantityOnHand as quan FROM parts WHERE PartId = ?"

                //Query DB. First param is query, second is callback
                //[] is used for filling in the ?
                connection.query(queryString, [partId], (err, result, fields) => {

                    //check if we succesfully queried
                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }
                    console.log("Successfully queried parts")

                    res.render('editPart.ejs', {
                        items: result
                    })

                })
            }else{
                 res.redirect('../index');
            }
        }
    })
})

router.get('/editTruck/:id', (req, res) =>{
    console.log("Finding truck with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const truckId = req.params.id.trim()

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
    
                //? allows us to fill in with a different value
                const queryString = "SELECT TruckId as id, TruckName as name, TruckDescription as blah, EmailAddress as email, Brand as brand, DriveType as drive, KMPerHour as km, FuelType as fuel, Color as color, Picture as imgName FROM trucks WHERE TruckId = ?"

                //Query DB. First param is query, second is callback
                //[] is used for filling in the ?
                connection.query(queryString, [truckId], (err, result, fields) => {

                    //check if we succesfully queried
                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }
                    console.log("Sucsessfully queried trucks")

                    res.render('editListing.ejs', {
                        items: result
                    })

                })
            }else{
                 res.redirect('../index');
            }
        }
    })
})

router.get('/editTrailer/:id', (req, res) =>{
    console.log("Finding trailer with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const trailerId = req.params.id.trim()

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                //? allows us to fill in with a different value
                const queryString = "SELECT TrailerId as id, TrailerName as name, TrailerDescription as blah, EmailAddress as email, Brand as brand, Length as length, Width as width, Color as color, Picture as imgName FROM trailers WHERE TrailerId = ?"

                //Query DB. First param is query, second is callback
                //[] is used for filling in the ?
                connection.query(queryString, [trailerId], (err, result, fields) => {

                    //check if we successfully queried
                    if(err){
                        console.log("Failed to query: " +err)
                       res.redirect('/Front End/error-500.html')
                        return
                    }
                    console.log("Successfully queried trailers")

                    res.render('editTrailer.ejs', {
                        items: result
                    })
                })
            }else{
                 res.redirect('../index');
            }
        }
    })
})

router.post('/remove_user', (req,res) => {
    const userId = req.body.user_id.trim()
    const con = helper1.getConnection()

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                const queryString = "DELETE from accounts where EmailAddress = ?"
                con.query(queryString, [userId], (err,result,fields) => {
                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }
                    else{
                        console.log("Deleted User")
                        res.redirect('/manage-users')
                    }
                })
            }else{
                 res.redirect('../index');
            }
        }
    })
})

router.get('/adminTrucks', function(req,res){
fs.readFile('./items.json', function(error, data){

    const queryUser = "SELECT EmailAddress as email FROM admins"

        helper1.getConnection().query(queryUser, (err, accountresult) => {
            
            if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
            //if the user is not logged in, it will direct them back to the home page
            if(!req.session || !req.session.username) {
                res.redirect('../index');
            }else{
                for(var x = 0; x < accountresult.length; x++){
                    if(req.session.username === accountresult[x].email){
                        var isAdmin = true;
                    }
                }
                if(isAdmin){

                    if(error) {
                      res.status(500).end()
                    } else{

                        const connection = helper1.getConnection()
                        const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks LIMIT 10;"


                        connection.query(queryString, (err,result,fields) => {
                            if(err){
                              console.log("Failed to query: " +err)
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
                                
                                if(err){
                                    console.log("Failed to query: " +err)
                                    res.redirect('/Front End/error-500.html')
                                    return
                                }
                                
                                
                                res.render('adminTrucks.ejs', {
                                    stripePublicKey: stripePublicKey,
                                    items: result,
                                    parts: results
                                })
                            })
                        })

                    }
                }else{
                    res.redirect('../index');
                }
            }
        })
    })
})

router.get('/adminTrucks/:offset', function(req,res){
fs.readFile('./items.json', function(error, data){

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                if(error) {
                  res.status(500).end()
                }else{
                    const connection = helper1.getConnection()
                    const offs = req.params.offset * 10 - 10
                    const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks LIMIT 10 OFFSET ?;"


                    connection.query(queryString, [offs], (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
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
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            res.render('adminTrucks.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
                }
            }else{
                res.redirect('../index');
            }
        }
    })
})
})

router.get('/adminTrailers', function(req,res){
fs.readFile('./items.json', function(error, data){

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                if(error) {
                  res.status(500).end()
                }else{

                    const connection = helper1.getConnection()
                    const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers LIMIT 10;"


                    connection.query(queryString, (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }
                        fs.writeFile('test.json', result, function(err){
                          if(err) throw err;
                          console.log('Saved');
                                     })
                        console.log(result)

                        const partString = "SELECT * from trailers"

                        helper1.getConnection().query(partString, (err,results,fields) => {
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            
                            res.render('adminTrailers.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
                }
            }else{
                res.redirect('../index');
            }
        }
    })
})
})

router.get('/adminTrailers/:offset', function(req,res){
fs.readFile('./items.json', function(error, data){

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                if(error) {
                  res.status(500).end()
                } else{
                    const connection = helper1.getConnection()
                    const offs = req.params.offset * 10 - 10
                    const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers LIMIT 10 OFFSET ?;"


                    connection.query(queryString, [offs], (err,result,fields) => {
                       if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }
                        fs.writeFile('test.json', result, function(err){
                          if(err) throw err;
                          console.log('Saved');
                                     })
                        console.log(result)

                        const partString = "SELECT * from trailers"

                        helper1.getConnection().query(partString, (err,results,fields) => {
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            res.render('adminTrailers.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })

                }
            }else{
                res.redirect('../index');
            }
        }
    })
})
})

router.get('/adminParts', function(req,res){
fs.readFile('./items.json', function(error, data){

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                if(error) {
                  res.status(500).end()
                } else{

                    const connection = helper1.getConnection()
                    const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts LIMIT 10;"

                    connection.query(queryString, (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
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
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            
                            res.render('adminParts.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })

                }
            }else{
                res.redirect('../index');
            }
        }
    })
})
})

router.get('/adminParts/:offset', function(req,res){
fs.readFile('./items.json', function(error, data){

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                if(error) {
                  res.status(500).end()
                } else{

                    const connection = helper1.getConnection()
                    const offs = req.params.offset * 10 - 10
                    const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts LIMIT 10 OFFSET ?;"


                    connection.query(queryString, [offs], (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
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
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            res.render('adminParts.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
                }
            }else{
                res.redirect('../index');
            }
        }
    })
})
})

router.post('/delete_part', (req,res) => {
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                const partId = req.body.part_id.trim()
                const con = helper1.getConnection()

                const queryString = "DELETE from parts where PartId = ?"
                const orderString = "DELETE from orderedparts where PartId = ?"
                con.query(orderString, [partId], (err,result,fields) => {
                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }
                    else{
                        con.query(queryString, [partId], (err,result,fields) => {
                         if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }
                        else{

                        console.log("Deleted Part")
                        res.redirect('/adminParts')
                    }
                        })
                    }
                })
            }else{
                res.redirect('../index');
            }
        }
    })
})

router.post('/delete_truck', (req,res) => {
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                const truckId = req.body.truck_id.trim()
                const con = helper1.getConnection()

                const queryString = "DELETE from trucks where TruckId = ?"
                con.query(queryString, [truckId], (err,result,fields) => {
                if(err){
                    console.log("Failed to query: " +err)
                    res.redirect('/Front End/error-500.html')
                    return
                }
                else{

                console.log("Deleted Truck")
                res.redirect('/adminTrucks')
            }})}else{
                res.redirect('../index');
                }
        
        }
    })
                        
})

router.post('/delete_trailer', (req,res) => {
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                const trailerId = req.body.trailer_id.trim()
                const con = helper1.getConnection()

                const queryString = "DELETE from trailers where TrailerId = ?"
                con.query(queryString, [trailerId], (err,result,fields) => {
                if(err){
                    console.log("Failed to query: " +err)
                    res.redirect('/Front End/error-500.html')
                    return
                }
                else{

                console.log("Deleted Trailer")
                res.redirect('/adminTrailers')
            }})}else{
                res.redirect('../index');
            }
                
        }
        })
})

router.post('/adminCheck', [
   body('username').trim().escape(),
   body('password').trim().escape()
],function(req,res) {
    var username = req.body.username
    var password = req.body.password
    var loggedOn
     var hashedPassword = ' ';

    //get hashed version of password
    var queryPass = "SELECT Password FROM admins WHERE EmailAddress = ?";

     helper1.getConnection().query(queryPass, [username], (err,results, field) =>{
         
            if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
         
            else{
                if(results.length == 0 || results == null){
                console.log("Failed Login")
                
                res.redirect('../Front End/adminlogin.html');
        

            }else{
                var correctPass = passwordHash.verify(password, results[0].Password); //should return true or false
                if(correctPass === true){
                    hashedPassword = results[0].Password;
                }else{
                    console.log("Error -  wrong password");
                }

                var queryString = "SELECT EmailAddress, Password FROM admins WHERE EmailAddress = ? AND Password = ?"

                helper1.getConnection().query(queryString, [username, hashedPassword], (err,results, field) =>{
                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }
                    if(results.length === 0 || results == null){
                        console.log("Failed Login")

                        res.redirect('/adminCheck');

                    }else{
                        console.log("Successful Login");
                        req.session.username = username;

                        res.redirect("../Front End/adminHome.html")
                    }
                })
            }
            }
     })
})
        

router.get('/adminOrders', function(req,res) {
    
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (error, accountresult) => {
        
        if(error){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                if(error) {
                  console.log(error)
                  res.status(500).end()
                }else{
                     const queryString = "SELECT orders.OrderId as id, orders.EmailAddress as email, orders.ShippingId as ship, shippingdetails.ShippingId as ships, shippingdetails.ShippingAddress as address FROM orders, shippingdetails WHERE orders.ShippingId = shippingdetails.ShippingId"

                      helper1.getConnection().query(queryString, (err, result, fields) => {
                          
                        if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }
                          
                          
                            res.render('adminOrders.ejs',{
                                orders: result,
                                // part: parts
                            })            
                    })
                }
            }else{
                res.redirect('../index');
            }
        }
    })
})

router.get('/adminOrder/:id', (req,res) =>{
    const orderId = req.params.id
    const queryString = "SELECT orderedparts.OrderId as id, orderedparts.PartId as part, parts.PartId as partIn, orderedparts.OrderedQuantity as quan, parts.PriceUSD as price, parts.ItemName as name, parts.Picture as imgName from orderedparts, parts WHERE orderedparts.OrderId = ? AND orderedparts.PartId = parts.PartId"
    const queryUser = "SELECT EmailAddress as email FROM admins"

    console.log("Order lookup")

    helper1.getConnection().query(queryUser, [orderId], (error, accountresult) => {
        
        if(error){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }

        //if the user is not logged in, it will direct them to the login page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                if(error) {
                  console.log(error)
                  res.status(500).end()
                }else{
            
                helper1.getConnection().query(queryString, [orderId], (err, result, fields) => {
                    
                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }
                    
                    
                    const billString = "SELECT orders.OrderId as id, orders.PaymentId, paymentdetails.PaymentId, paymentdetails.BillingAddress as address, paymentdetails.BillingFirstName as first, paymentdetails.BillingLastName as last, paymentdetails.BillingCountry as country, paymentdetails.BillingCity as city, paymentdetails.BillingState as state, paymentdetails.BillingPhone as phone, orders.EmailAddress as email FROM orders, paymentdetails WHERE orders.OrderId = ? AND orders.PaymentId = paymentdetails.PaymentId"
                    helper1.getConnection().query(billString, [orderId], (err, billing, fields) => {
                        
                        if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }
                        
                        
                        const shipString = "SELECT orders.OrderId as id, orders.ShippingId as ship, shippingdetails.ShippingId as shipping, shippingdetails.ShippingAddress as address, shippingdetails.ShippingFirstName as first, shippingdetails.ShippingLastName as last, shippingdetails.ShippingCountry as country, shippingdetails.ShippingCity as city, shippingdetails.ShippingState as state, shippingdetails.ShippingPhone as phone from orders, shippingdetails WHERE orders.OrderId = ? AND shippingdetails.ShippingId = orders.ShippingId;"
                        console.log(billing)
                        helper1.getConnection().query(shipString, [orderId], (err, shipping, fields) => {
                            
                        if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }    
                            
                            
                        console.log(shipping)
                            res.render('order-template.ejs', {
                                items: result,
                                bills: billing,
                                ships: shipping
                            })
                        })
                    })
                })
            }}else{
                 console.log(req.session.username)
                 console.log(accountresult[0].email)
                 res.redirect('../error-500.html');
            }
        }
    })
    
})

router.post('/adminSearchParts', (req,res) => {
    
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                
                var searchName = req.body.searchBar
                const trimSearch = '%'+searchName+'%'
                
                const connection = helper1.getConnection()
                const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts WHERE ItemName LIKE ? OR PartDescription LIKE ? OR Brand LIKE ? LIMIT 10;"

                    connection.query(queryString, [trimSearch, trimSearch, trimSearch], (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
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
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            
                            res.render('adminParts.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
            }else{
                 res.redirect('../index');
            }
        }
    })   
})

router.post('/adminSearchTrucks', (req,res) => {
    
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                
                var searchName = req.body.searchBar
                const trimSearch = '%'+searchName+'%'
                
                const connection = helper1.getConnection()
                const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks WHERE TruckName LIKE ? OR TruckDescription LIKE ? OR Brand LIKE ? LIMIT 10;"

                    connection.query(queryString, [trimSearch, trimSearch, trimSearch], (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
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
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            
                            res.render('adminTrucks.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
            }else{
                 res.redirect('../index');
            }
        }
    })   
})

router.post('/adminSearchTrailers', (req,res) => {
    
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                
                var searchName = req.body.searchBar
                const trimSearch = '%'+searchName+'%'
                
                const connection = helper1.getConnection()
                const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers WHERE TrailerName LIKE ? OR TrailerDescription LIKE ? OR Brand LIKE ? LIMIT 10;"

                    connection.query(queryString, [trimSearch, trimSearch, trimSearch], (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }
                        fs.writeFile('test.json', result, function(err){
                          if(err) throw err;
                          console.log('Saved');
                                     })
                        console.log(result)

                        const partString = "SELECT * from trailers"

                        helper1.getConnection().query(partString, (err,results,fields) => {
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            res.render('adminTrailers.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
            }else{
                 res.redirect('../index');
            }
        }
    })   
})

router.post('/adminSortParts', (req,res) => {
    
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                
                var sortType = req.body.sortlist
                var queryString = "SELECT PartId as id, ItemName AS name, PriceUSD as price, PartDescription as blah, Brand as brand, Picture as imgName from parts"
                console.log(sortType)
                if(sortType === 'name'){
                    queryString = queryString + " ORDER BY ItemName"
                }
                else if(sortType === 'new'){
                    queryString = queryString + " ORDER BY PartId DESC"
                }
                else if(sortType === 'price'){
                    queryString = queryString + " ORDER BY PriceUSD"
                }

                queryString = queryString + " LIMIT 10"

                helper1.getConnection().query(queryString, (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
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
                            
                            if(err){
                                    console.log("Failed to query: " +err)
                                    res.redirect('/Front End/error-500.html')
                                    return
                                }
                            
                            res.render('adminParts.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
                
                
            }else{
                 res.redirect('../index');
            }
        }
    })   
})

router.post('/adminSortTrucks', (req,res) => {
    
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                
                var sortType = req.body.sortlist
                var queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks"
                console.log(sortType)
                if(sortType === 'name'){
                    queryString = queryString + " ORDER BY TruckName"
                }
                else if(sortType === 'new'){
                    queryString = queryString + " ORDER BY TruckId DESC"
                }
                else if(sortType === 'mile'){
                    queryString = queryString + " ORDER BY KMPerHour"
                }

                queryString = queryString + " LIMIT 10"

                helper1.getConnection().query(queryString, (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
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
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            res.render('adminTrucks.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
                
                
            }else{
                 res.redirect('../index');
            }
        }
    })   
})

router.post('/adminSortTrailers', (req,res) => {
    
    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        
        if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            for(var x = 0; x < accountresult.length; x++){
                if(req.session.username === accountresult[x].email){
                    var isAdmin = true;
                }
            }
            if(isAdmin){
                
                var sortType = req.body.sortlist
                var queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers"
                console.log(sortType)
                if(sortType === 'name'){
                    queryString = queryString + " ORDER BY TrailerName"
                }
                else if(sortType === 'new'){
                    queryString = queryString + " ORDER BY TrailerId DESC"
                }
                else if(sortType === 'length'){
                    queryString = queryString + " ORDER BY Length DESC"
                }
                else if(sortType === 'width'){
                    queryString = queryString + " ORDER BY Width DESC"
                }

                queryString = queryString + " LIMIT 10"

                helper1.getConnection().query(queryString, (err,result,fields) => {
                        if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }
                        fs.writeFile('test.json', result, function(err){
                          if(err) throw err;
                          console.log('Saved');
                                     })
                        console.log(result)

                        const partString = "SELECT * from trailers"

                        helper1.getConnection().query(partString, (err,results,fields) => {
                            
                            if(err){
                                console.log("Failed to query: " +err)
                                res.redirect('/Front End/error-500.html')
                                return
                            }
                            
                            res.render('adminTrailers.ejs', {
                                stripePublicKey: stripePublicKey,
                                items: result,
                                parts: results
                            })
                        })
                    })
                
                
            }else{
                 res.redirect('../index');
            }
        }
    })   
})


module.exports = router

