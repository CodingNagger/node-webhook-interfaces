
var express = require('express');
const path = require('path');

var app = express();
var api = require('./api').create();

app.use('/api', api);
app.use('/', express.static(path.join(__dirname, 'admin')))

app.get('', function (req, res) {
  res.end('');
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node Webhook Interfaces listening at http://%s:%s", host, port)

})
