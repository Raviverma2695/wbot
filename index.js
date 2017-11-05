

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));


app.use(bodyParser.urlencoded({extended: false}));


app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot');
});

app.get('/privacypolicy', function(req,res) {
 res.sendFile('privacypolicy.htm', {root: __dirname })
 });



app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
});

'use strict';
const http = require('http');
const host = 'api.worldweatheronline.com';
const wwoApiKey = '7eabf4ed0b8949368ac13125171010';

app.post('/weatherWebhook',function(req,res) {
  
	let city='';
	if(req.body.result.parameters.address['city'])
  city = req.body.result.parameters.address['city'];
 
  let date = '';
 
  if (req.body.result.parameters['date-time']) {
    date = req.body.result.parameters['date-time'];
    console.log('Date: ' + date);
  }
  
	if(city=='') res.send(JSON.stringify({ 'speech': 'try again', 'displayText': 'Please try again' }));
	else
  callWeatherApi(city, date).then((output) => {
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
});


function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
   
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + host + path);
    
    http.get({host: host, path: path}, (res) => {
      let body = ''; 
      res.on('data', (d) => { body += d; }); 
      res.on('end', () => {
        
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];
       
        // let output = `Current conditions in the ${location['type']} 
       // ${location['query']} are ${currentConditions} with a projected high of
       // ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
       // ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
       // ${forecast['date']}.`;
		
		
		let output = `Current conditions in the ${location['type']} 
        ${location['query']} is ${currentConditions} with temperature ${conditions['temp_C']} °C on 
        ${forecast['date']}.`;
       
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}
