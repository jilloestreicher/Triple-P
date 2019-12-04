const mysql = require('mysql')


var obj ={
    getConnection: function() {
        
        var db_config = {
          host:'localhost',
          user:'root',
          password:'Capping2',
          database:'acsas'
        };

        var connection;

        connection = mysql.createConnection(db_config); 

        connection.connect(function(err) {              
          if(err) {                                     
            console.log('error when connecting to db:', err);
            setTimeout(obj.getConnection(), 2000); 
          }                                    
        });  
        
        connection.on('error', function(err) {
            console.log('db error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
                obj.getConnection();                         
            } else {                                     
                throw err;                                 
            }
        });
        
        
        return connection;
    }

}
        



