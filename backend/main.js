// Initialize WebHooks module.
var WebHooks = require('node-webhooks');

var webHooksDBPath = './webHooksDB.json';

var webHooks = new WebHooks({
    db: webHooksDBPath, // json file that store webhook URLs
});

var express = require('express');
var app = express();
var fs = require("fs");0
app.get('', function (req, res) {
   res.end('Coucou voici ma bite')
})

app.get('/api/webhook', function (req, res) {
   fs.readFile( webHooksDBPath, 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.get('/api/webhook/:key', function (req, res) {
   fs.readFile( webHooksDBPath, 'utf8', function (err, data) {
      data = JSON.parse( data );
      var urlsForKey = JSON.stringify(data[req.params.key]);

      console.log( urlsForKey );
      res.end( urlsForKey );
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

/*
// sync instantation - add a new webhook called 'shortname1'
webHooks.add('shortname1', 'http://127.0.0.1:9000/prova/other_url').then(function(){
    // done
}).catch(function(err){
    console.log(err);
});

// add another webHook
webHooks.add('shortname2', 'http://127.0.0.1:9000/prova2/').then(function(){
    // done
}).catch(function(err){
    console.log(err);
});

// remove a single url attached to the given shortname
// webHooks.remove('shortname3', 'http://127.0.0.1:9000/query/').catch(function(err){console.error(err);});

// if no url is provided, remove all the urls attached to the given shortname
// webHooks.remove('shortname3').catch(function(err){console.error(err);});

// trigger a specific webHook
webHooks.trigger('shortname1', {data: 123});
webHooks.trigger('shortname2', {data: 123456}, {header: 'header'}); // payload will be sent as POST request with JSON body (Content-Type: application/json) and custom header
*/
