
var express = require('express');

var app = express();
var api = require('./api').create();
var admin = express();

app.use('/api', api);
app.use('/manager', admin);

app.get('', function (req, res) {
  res.render('index');
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
