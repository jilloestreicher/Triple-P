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
        res.redirect('/adminParts')
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

router.post('/edit_trailer', [
    body('trailer_id').trim(),
    body('trailer_name').trim(),
    body('trailer_length').trim(),
    body('trailer_desc').trim(),
    body('trailer_brand').trim(),
    body('trailer_width').trim(),
    body('trailer_color').trim()
    ], (req,res) => {
    
    const trailerId = req.body.trailer_id
    const trailerName = req.body.trailer_name
    const trailerDesc = req.body.trailer_desc
    const trailerBrand = req.body.trailer_brand
    const trailerLength = req.body.trailer_length
    const trailerWidth = req.body.trailer_width
    const trailerColor = req.body.trailer_color
    
    const queryString = "update trailers set TrailerName=?, Length=?, TrailerDescription=?, Brand=?, Width=?, Color=? where TrailerId=?"
    
    helper1.getConnection().query(queryString, [trailerName, trailerLength, trailerDesc, trailerBrand, trailerWidth, trailerColor, trailerId], (err,result,fields) => {
        
        if(err) {
            console.log("Update failed")
            
            res.sendStatus(500)
            //res.redirect('/Front End/error-500.html')
            return
        }
        
        console.log("Updated Trailer")
        res.redirect('/adminTrailers')
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

router.get('/editTrailer/:id', (req, res) =>{
    console.log("Finding trailer with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const trailerId = req.params.id.trim()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT TrailerId as id, TrailerName as name, TrailerDescription as blah, EmailAddress as email, Brand as brand, Length as length, Width as width, Color as color, Picture as imgName FROM trailers WHERE TrailerId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [trailerId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            //res.redirect('../Front End/error-500.html')
            return
        }
        console.log("Sucessfully queried trailers")
        
        res.render('editTrailer.ejs', {
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
        const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks LIMIT 10;"
        
        
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
            
            const partString = "SELECT * from trucks"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('adminTrucks.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/adminTrucks/:offset', function(req,res){
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
              res.sendStatus(500);
              //res.render('/Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trucks"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('adminTrucks.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/adminTrailers', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers LIMIT 10;"
        
        
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
            
            const partString = "SELECT * from trailers"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('adminTrailers.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/adminTrailers/:offset', function(req,res){
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
              res.sendStatus(500);
              //res.render('/Front End/error-500.html')
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trailers"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                res.render('adminTrailers.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
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
                res.render('adminParts.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/adminParts/:offset', function(req,res){
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
                res.render('adminParts.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
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

router.post('/delete_trailer', (req,res) => {
    const trailerId = req.body.trailer_id.trim()
    const con = helper1.getConnection()
    
    const queryString = "DELETE from trailers where TrailerId = ?"
                            con.query(queryString, [trailerId], (err,result,fields) => {
                              if(err) {
                            console.log("Delete failed -trailer")
                            console.log(trailerId)
			                console.log(err)
                            res.sendStatus(500)
                            //res.redirect('/Front End/error-500.html')
                            return
                            }  
                            else{
                            
                            console.log("Deleted Trailer")
                            res.end()
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

    var queryString = "SELECT EmailAddress, Password FROM admins WHERE EmailAddress = ? AND Password = ?"

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
            res.redirect('loginCheck');

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


module.exports = router

