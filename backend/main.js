// Initialize WebHooks module.
var WebHooks = require('node-webhooks');
var bodyParser = require('body-parser');

var webHooksDBPath = './webHooksDB.json';

var webHooks = new WebHooks({
  db: webHooksDBPath, // json file that store webhook URLs
});

var express = require('express');
var app = express();
var fs = require("fs");

var emitter = webHooks.getEmitter();

emitter.on('*.success', function (shortname, statusCode, body) {
    console.log('Success on trigger webHook ' + shortname + ' with status code', statusCode, 'and body', body);
});

emitter.on('*.failure', function (shortname, statusCode, body) {
    console.error('Error on trigger webHook ' + shortname + ' with status code', statusCode, 'and body', body);
});

app.use(bodyParser.json());

app.get('', function (req, res) {
  res.end('Welcome to Node Webhook Interfaces')
})

app.get('/api/webhook', function (req, res) {
  webHooks.getDB().then(function(result){
  	res.end(JSON.stringify(result));
  }).catch(function(err){
  	console.log(err);

    res.statusCode = 500;
    res.end();
  });
})

app.post('/api/webhook/:key/trigger', function (req, res) {
  var body = JSON.stringify(req.body);

  req.headers['content-length'] = body.length;

  webHooks.trigger(req.params.key, req.body, req.headers);
  res.end();
})

app.get('/api/webhook/:key', function (req, res) {
  webHooks.getWebHook(req.params.key).then(function(result) {
    if (Object.keys(result).length === 0 && result.constructor === Object) {
      res.statusCode = 204;
    }

    var data = JSON.stringify(result);

    console.log(data);

    res.end(data);
  }).catch(function(err){
    console.log(err);

    res.statusCode = 500;
    res.end();
  });
})

app.post('/trigger/test/url', function (req, res) {

  console.log("Request called for trigger on: "+'/trigger/test/url');
  console.log(req.body);
  console.log(req.headers);

  console.log("Request ended");

  res.end("Request ended");
})

app.post('/api/webhook/:key', function (req, res) {
  var urls = req.body;
  var errorCount = 0;

  if (urls.length === 0) {
    res.statusCode = 400;
    res.end();
  }

  urls.forEach(function(url) {
    webHooks.add(req.params.key, url).then(function(){

    }).catch(function(err){
      console.log(err);
      errorCount++;
    });
  });

  if (errorCount === urls.length) {
    res.statusCode = 500;
  }

  res.end();
})

app.delete('/api/webhook/:key', function (req, res) {
  var urls = req.body;

  if (Object.keys(urls).length === 0 && urls.constructor === Object) {
    webHooks.remove(req.params.key).then(function(){

    }).catch(function(err){
      console.log(err);
      res.statusCode = 500;
    });
  }
  else {
    urls.forEach(function(url) {
      webHooks.remove(req.params.key, url).then(function(){

      }).catch(function(err){
        console.log(err);
        res.statusCode = 500;
      });
    });
  }

  res.end();
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
