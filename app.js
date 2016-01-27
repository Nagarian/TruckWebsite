//var edge = require('edge');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var hash = require('./pass').hash;
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

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
/*var users = {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
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
}*/

function authenticate(email, password, token, fn) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  if(email != undefined && password != undefined && token != undefined){
  	var user = {};
  	user.email = this.email;
  	user.password = this.password;
  	user.token = this.token;
  	return fn(null, user)
  }
  else return fn("Identifiants incorrects", null);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
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

/*app.post('/login', function(req, res){   
  authenticate(req.body.email, req.body.password, function(err, user){                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    if (user) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
      // Regenerate session when signing in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
      // to prevent fixation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
      req.session.regenerate(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        // Store the user's primary key                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        // in the session store to be retrieved,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        // or in this case the entire user object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        req.session.user = user; 
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

        var req2 = http.request(options, (res2) => {
          res2.setEncoding('utf8');
          res2.on('data', (chunk) => {
            req.session.token = (JSON.parse(chunk)).access_token;
          });
          res2.on('end', () => {
            res.redirect('/');   
          });
        });
        req2.on('error', (e) => {
          console.log(`problem with request: ${e.message}`);
        });

        // write data to request body
        req2.write(postData);
        req2.end();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
      });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      res.redirect('/login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
});*/

app.post('/login', function(req, res){ 

	var postData = querystring.stringify({
          'grant_type' : 'password',
          'username' : req.body.email,
          'password' : req.body.password
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

        var req2 = http.request(options, (res2) => {
          res2.setEncoding('utf8');
          res2.on('data', (chunk) => {
            req.session.token = (JSON.parse(chunk)).access_token;
          });
          res2.on('end', () => {
	      	  authenticate(req.body.email, req.body.password, req.session.token,function(err, user){                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
			    if (user) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
			      req.session.regenerate(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
			        req.session.user = user;
			       	res.redirect('/');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
			      });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
			    } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
			      res.redirect('/login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
			    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
			  });  
          });
        });
        req2.on('error', (e) => {
          console.log(`problem with request: ${e.message}`);
        });

        // write data to request body
        req2.write(postData);
     req2.end();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
});


app.get('/logout', function(req, res){
  req.session.destroy(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    res.redirect('/login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  }); 
});

app.get('/', restrict, function(req, res){
    res.render('index.ejs', { _tokenuser : req.session.token });
});

app.get('/vehicules', restrict, function(req, res){
    res.render('vehicules.ejs', { _tokenuser : req.session.token });
});

app.get('/establishments', restrict, function(req, res){
    res.render('establishments.ejs', { _tokenuser : req.session.token });
});

app.get('/users', restrict, function(req, res){
    res.render('users.ejs', { _tokenuser : req.session.token });
});





app.get('/missions', restrict, function(req, res){
    //console.log("req.session.token :" + req.session.token );
    var options = {
      hostname: 'cgptruck.azurewebsites.net',
      path: '/api/missions',
      headers: {
        //'Content-Type': 'application/json',
        'Authorization': "Bearer " + req.session.token
      },
      agent: false  // create a new agent just for this one request
    }

    //Requête de récupération des données - missions
    http.get(options, function(res2){
      res2.on('data', function(chunk){
        var data = resolveReferences(JSON.parse(chunk));
        res.render('missions.ejs', { missions : data, _tokenuser : req.session.token });
      });
    }).on('error', function(e){
      console.log("Error : " + e.message);
      res.render('missions.ejs', { missions : "", _tokenuser : req.session.token });
    });
    
});



app.get('/addMission', restrict, function(req, res){
    res.render('addMission.ejs', { _tokenuser : req.session.token });
});

app.get('/voirMission-*', restrict, function(req, res){
  var idMission = req.originalUrl.split("-")[1]
  if ( idMission != ""){
    //console.log("req.session.token :" + req.session.token );
    var options = {
      hostname: 'cgptruck.azurewebsites.net',
      path: '/api/missions/'+idMission,
      headers: {
        //'Content-Type': 'application/json',
        'Authorization': "Bearer " + req.session.token
      },
      agent: false  // create a new agent just for this one request
    }

    //Requête de récupération des données - détail d'une mission
    http.get(options, function(res2){
      res2.on('data', function(chunk){
        var data = resolveReferences(JSON.parse(chunk));
        res.render('viewMission.ejs', { mission : data, _tokenuser : req.session.token});
      });
    }).on('error', function(e){
      console.log("Error : " + e.message);
      res.render('/', { _tokenuser : req.session.token });
    });
  }
});


app.get('/profile', restrict, function(req, res){
    res.render('profile.ejs', { _tokenuser : req.session.token });
});

app.listen(app.get('port'), function() {
	console.log("Server is running on port " + 4000);
});



// Permet de résoudre les dépendances du JSON
function resolveReferences(json) {
    if (typeof json === 'string')
        json = JSON.parse(json);

    var byid = {}, // all objects by id
        refs = []; // references to objects that could not be resolved
    json = (function recurse(obj, prop, parent) {
        if (typeof obj !== 'object' || !obj) // a primitive value
            return obj;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            for (var i = 0; i < obj.length; i++)
                // check also if the array element is not a primitive value
                if (typeof obj[i] !== 'object' || !obj[i]) // a primitive value
                    continue;
                else if ("$ref" in obj[i])
                    obj[i] = recurse(obj[i], i, obj);
                else
                    obj[i] = recurse(obj[i], prop, obj);
            return obj;
        }
        if ("$ref" in obj) { // a reference
            var ref = obj.$ref;
            if (ref in byid)
                return byid[ref];
            // else we have to make it lazy:
            refs.push([parent, prop, ref]);
            return;
        } else if ("$id" in obj) {
            var id = obj.$id;
            delete obj.$id;
            if ("$values" in obj) // an array
                obj = obj.$values.map(recurse);
            else // a plain object
                for (var prop in obj)
                    obj[prop] = recurse(obj[prop], prop, obj);
            byid[id] = obj;
        }
        return obj;
    })(json); // run it!

    for (var i = 0; i < refs.length; i++) { // resolve previously unknown references
        var ref = refs[i];
        ref[0][ref[1]] = byid[ref[2]];
        // Notice that this throws if you put in a reference at top-level
    }
    return json;
}

function censor(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
      return '[Circular]'; 

    if(i >= 300) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;  
  }
}