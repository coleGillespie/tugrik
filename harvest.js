var MongoClient = require('mongodb').MongoClient,
    bunyan = require('bunyan'),
    log = bunyan.createLogger({
      name: 'harvest'
    });
    request = require('request')

var url = 'mongodb://localhost:27017/exampleDb';

MongoClient.connect(url, function(err, db) {
  log.info("Connected correctly to server");
  
  var collection = db.collection('test');

  setInterval(function(){
    request('http://localhost/nyt', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        log.info("checking nyt for new content")
        JSON.parse(body).forEach(function(element, index, array){
            collection.findOne({href:element.href}, function(err, item) {
              if(item === null) {
                log.info("cannot find ", element.href)
                element.firstSeen = new Date().getTime();
                collection.insert(element, {w:1}, function(err, result) {
                  log.info("adding", result)
                });
              }
            });
        });
      }
    })

  }, 300000);

});