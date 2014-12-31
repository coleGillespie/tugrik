// Retrieve
var mongo = require('mongodb').MongoClient;

// Connect to the db
mongo.connect("mongodb://localhost:27017/db", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});