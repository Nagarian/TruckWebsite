var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT || 4000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/login', function(req, res){
    res.render('login.ejs');
});

app.get('/users', function(req, res){
    res.render('users.ejs');
});

app.get('/profile', function(req, res){
    res.render('profile.ejs');
});

app.listen(app.get('port'), function() {
	console.log("Server is running on port " + 4000);
});