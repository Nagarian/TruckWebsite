//var edge = require('edge');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var hash = require('./pass').hash;
var bodyParser = require('body-parser');
var ffi = require('ffi');
var http = require('http');
var querystring = require('querystring');

var data;
var app = express();


app.set('port', (process.env.PORT || 4000));
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser('shhhh, very secret'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
app.use(session({
  secret: 'keyboard cat'
}));   

function getToken(){
	var token;
	var postData = querystring.stringify({
	  'grant_type' : 'password',
	  'username' : 'hans.herbretzel',
	  'password' : 'azerty123'
	});

	var options = {
	  hostname: 'cgptruck.azurewebsites.net',
	  path: '/token',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': postData.length
	  }
	};

	var req = http.request(options, (res) => {
	  //console.log(`STATUS: ${res.statusCode}`);
	  //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	  var token;
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    //console.log(`BODY: ${chunk}`);
	    token = (JSON.parse(chunk)).access_token;
	  });
	  res.on('end', () => {
	  	//console.log(token);
	  	getMissions(token);
	  })
	});


	req.on('error', (e) => {
	  console.log(`problem with request: ${e.message}`);
	});

	// write data to request body
	req.write(postData);
	req.end();
}

function getMissions(token){

	var options = {
	  hostname: 'cgptruck.azurewebsites.net',
	  path: '/api/missions',
	  headers: {
	  	//'Content-Type': 'application/json',
	    'Authorization': 'Bearer ' + token
	  },
	  agent: false  // create a new agent just for this one request
	}

	http.get(options, function(res){
		console.log(res.statusCode);

		res.on('data', function(chunk){
			//console.log(JSON.parse(chunk.toString()));
			console.log(chunk.toString());
		});

	}).on('error', function(e){
		console.log("Error : " + e.message);
	});
}

getToken();

// Session-persisted message middleware                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
app.use(function(req, res, next){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  var err = req.session.error                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    , msg = req.session.success;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  delete req.session.error;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  delete req.session.success;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  res.locals.message = '';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  next();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
});  

// dummy database                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
var users = {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  test: { name: 'test' }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
// when you create a user, generate a salt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
// and hash the password ('foobar' is the pass here)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
hash('test', function(err, salt, hash){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  if (err) throw err;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  // store the salt & hash in the "db"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  users.test.salt = salt;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  users.test.hash = hash.toString();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}); 

// Authenticate using our plain-object database of doom!                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
function authenticate(name, pass, fn) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  if (!module.parent) console.log('authenticating %s:%s', name, pass);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  var user = users[name];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  // query the db for the given username                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  if (!user) return fn(new Error('cannot find user'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  // apply the same algorithm to the POSTed password, applying                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
  // the hash against the pass / salt, if there is a match we                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  // found the user                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  hash(pass, user.salt, function(err, hash){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    if (err) return fn(err);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    if (hash.toString() == user.hash) return fn(null, user);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    fn(new Error('invalid password'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
function restrict(req, res, next) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  if (req.session.user) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    next();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    req.session.error = 'Access denied!';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    res.redirect('/login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
} 

app.get('/login', function(req, res){
    res.render('login.ejs');
});

app.post('/login', function(req, res){   
  authenticate(req.body.email, req.body.password, function(err, user){                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    if (user) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
      // Regenerate session when signing in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
      // to prevent fixation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
      req.session.regenerate(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        // Store the user's primary key                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        // in the session store to be retrieved,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        // or in this case the entire user object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        req.session.user = user;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        res.redirect('/');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      res.redirect('/login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
});

app.get('/logout', function(req, res){
  req.session.destroy(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    res.redirect('/login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  }); 
});

app.get('/', restrict, function(req, res){
	/*
	api.func({
	    assemblyFile: 'CGPTruck.WebAPI.dll',
	    typeName: 'CGPTruck.WebAPI.BLL.BLLMissions',
	    methodName: 'GetMissionOfDriver(1)' // Func<object,Task<object>>
	}});
	*/
    res.render('index.ejs');
});

app.get('/vehicules', restrict, function(req, res){
    res.render('vehicules.ejs');
});

app.get('/establishments', restrict, function(req, res){
    res.render('establishments.ejs');
});

app.get('/users', restrict, function(req, res){
    res.render('users.ejs');
});

app.get('/missions', restrict, function(req, res){
    res.render('missions.ejs');
});
app.get('/addMission', restrict, function(req, res){
    res.render('addMission.ejs');
});
app.get('/voirMission', restrict, function(req, res){
    res.render('viewMission.ejs');
});


app.get('/profile', restrict, function(req, res){
    res.render('profile.ejs');
});

app.listen(app.get('port'), function() {
	console.log("Server is running on port " + 4000);
});