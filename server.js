var browserify = require('browserify-middleware');
var express = require('express');
var app = express();

var DEFAULT_PORT = 5000;

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || DEFAULT_PORT));

app.get('/app.js', browserify('./client/main.js'));

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.listen(app.get('port'), function() {
	console.log('Up and running at port: ' + app.get('port'));	
});
