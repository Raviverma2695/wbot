var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot');
});



// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
});

const host = 'api.worldweatheronline.com';
const wwoApiKey = '7eabf4ed0b8949368ac13125171010';

app.post('/weatherfetch',function(req,res) {
	
	response = "This is a sample response from your webhook!" 

  res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  //"speech" is the spoken version of the response, "displayText" is the visual version
  }));
});


