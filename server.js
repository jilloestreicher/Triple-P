require('dotenv').config({ path: '.env' })

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretKey)
console.log(stripePublicKey)

const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const fs = require("fs")
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('Front End'))
app.use(bodyParser.urlencoded({extended: false}))
app.use("/static", express.static('./static/'));

function getConnection(){
    return mysql.createConnection({
      host:'localhost',
      user:'root',
      password:'Capping2',
      database:'acsas'
    })
}


app.get('/shop', function(req,res){
fs.readFile('items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = getConnection()
        const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              res.end()
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            res.render('shop.ejs', {
            stripePublicKey: stripePublicKey,
            items: result
            })
        })
        
    }
})
})

app.post('/purchase', function(req, res) {
  fs.readFile('items.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      const itemsJson = JSON.parse(data)
      const itemsArray = itemsJson.music.concat(itemsJson.merch)
      let total = 0
      req.body.items.forEach(function(item) {
        const itemJson = itemsArray.find(function(i) {
          return i.id == item.id
        })
        total = total + itemJson.price * item.quantity
      })

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

app.post('/create_listing', (req,res) => {
    
    const truckName = req.body.truck_name
    const truckBrand = req.body.truck_brand
    const truckKM = req.body.truck_km
    const truckFuel = req.body.truck_fuel
    const truckDrive = req.body.truck_drive
    const truckColor = req.body.truck_color
    
    const email = "example2@gmail.com"
    
    const queryString = "insert into trucks (TruckName, Brand, KMPerHour, FuelType, DriveType, Color, EmailAddress) values (?,?,?,?,?,?,?)"
    
    getConnection().query(queryString, [truckName, truckBrand, truckKM, truckFuel, truckDrive, truckColor, email], (err, results, fields) => {
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

app.listen(3000)