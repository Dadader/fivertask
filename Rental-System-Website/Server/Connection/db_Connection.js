var mysql = require('mysql');

var client = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : null,
    database : 'rentalspacedb'
  });


  client.connect(function(err){
    if(err)
    {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    }
    else{
      console.log("Successfully connected to Database");
    }
  }
  )

module.exports = client;