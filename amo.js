var MongoClient = require('mongodb').MongoClient,
    bunyan = require('bunyan'),
    log = bunyan.createLogger({
      name: 'amo'
    });
    request = require('request')

var url = 'mongodb://localhost:27017/openNews';

MongoClient.connect(url, function(err, db) {
  log.info("Connected correctly to server");
  
  var collection = db.collection('nyt');
    setInterval(function(){
    // Peform a simple find and return all the documents
    collection.find().sort({_id:1}).toArray(function(err, docs) {
      var date = new Date().getTime();
      docs.forEach(function(element, index, array){

        request('http://localhost:1337/?q=' + element.href, function (error, response, body) {
          var shares = element.shares
          body = JSON.parse(body)
          body.time = date
          shares.push(body)
          collection.update({href:element.href}, {$set: {shares: shares}, $currentDate: { lastModified: true }}, {upsert:true, w: 1}, function(a, b){
            log.info("updated shares for " + element.href)
          });

        })
      });
    });
  }, 1800000);

});