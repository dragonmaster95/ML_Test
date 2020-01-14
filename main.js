var express = require('express');
var app = express();

app.get('/', function(reg,res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT, function() {
  Console.log('Example app listening.');
});