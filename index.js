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
console.log(host);

app.post('/weatherfetch',function(req,res) {
	
	
	/*
	let city = req.body.result.parameters['geo-city']; // city is a required param
	console.log(city);
  // Get the date for the weather forecast (if present)
  let date = '';
  if (req.body.result.parameters['date']) {
    date = req.body.result.parameters['date'];
    console.log('Date: ' + date);
  }
  // Call the weather API
  callWeatherApi(city, date).then((output) => {
    // Return the results of the weather API to API.AI
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    // If there is an error let the user know
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  }); */
  
  
 var jsdata=http.get(
  
 "https://api.worldweatheronline.com/premium/v1/weather.ashx?key=7eabf4ed0b8949368ac13125171010&q=Delhi&format=json"
 );
  
});


function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + host + path);
    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];
        // Create response
        let output = `Current conditions in the ${location['type']} 
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        ${forecast['date']}.`;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}


