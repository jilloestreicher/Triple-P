const mysql = require('mysql')

module.exports = function(){
    this.getConnection = function() {
        return mysql.createConnection({
          host:'localhost',
          user:'root',
          password:'Capping2',
          database:'acsas'
        })
    }
};


