var express = require('express')
var app = express()

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/', function (req, res) {
  var value = Math.random();
  res.send('{ "value": ' + value + ' }');
})

app.listen(3000)