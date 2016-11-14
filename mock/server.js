var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/trigger/test/url', function (req, res) {

  console.log("Request called for trigger on: "+'/trigger/test/url');
  console.log(req.body);
  console.log(req.headers);

  console.log("Request ended");

  res.end("Request ended");
})

var server = app.listen(9999, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
