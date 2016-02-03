var express = require('express')
var app = express()

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
 
app.all('/initial', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/', function (req, res) {
  var value = randomValue();
  res.send(JSON.stringify({ value: value }));
})

app.get('/initial', function (req, res) {
  response = [];
  for (var i = 0; i < 50; i++) {
    var value = randomValue();
    response.push({ value: value });
  }
  res.send(JSON.stringify(response));
})

function randomValue() {
  var base = 0.2 + (Math.random() * 0.6);
  var extra = (Math.random() > 0.9) ? 0.2 : 0;
  base += extra;
  return base;
}

app.listen(3000)