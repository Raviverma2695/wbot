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

//privacy policy
app.get('/privacypolicy', function(req,res) {
	res.sendFile('privacypolicy.htm', {root: __dirname });
});

// for Facebook verification
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'niec') {
        res.send(req.query['hub.challenge']);
    } 
    res.send('Error, wrong token');
});

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
});

const host = 'api.worldweatheronline.com';
const wwoApiKey = '7eabf4ed0b8949368ac13125171010';

app.post('/weatherfetch',function(req,res) {
	
	response = "This is a sample response from your webhook!" //Default response from the webhook to show it's working

  res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  //"speech" is the spoken version of the response, "displayText" is the visual version
  }));
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;
	 // console.log("Entry: ", entry);

      // Iterate over each messaging event
      entry.messaging.forEach( function(event) {
		 // console.log("Event: ", event);
		  
		var sender=event.sender.id;
		
		if (event.message) {
			console.log("Message data: ", event.message);
			console.log("message text: ",event.message.text);
			/*nlp =  event.message.nlp;
			
			var replytext=processNLP(nlp);
			sendTextMessage(sender,replytext);
	*/
			
		    if (event.message.text) {
				var text = event.message.text;
				
				if (text === 'hi') {
					sendGenericMessage(sender,text);
				}
				else
					sendTextMessage(sender, "Repeat: " + text.substring(0, 200));
			}
        }
		else
			if(event.postback) {
				var  text = JSON.stringify(event.postback);
				sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
			}
			else {
				// console.log("Webhook received unknown event: ", event);
			}
		});
	});
	res.sendStatus(200);
  }
  
});


var PAGE_ACCESS_TOKEN = "EAAKAyyxIS1kBADvZCrHZC2MXMkuzVZA8t1P4GrXLI9VYwu4Hq2LhON4QA0XFmrezSu1Fc0w1s4llXzgq7V8W0j7rkpkG0ai2Czn2DnLWLCMbepcInZAPVJI9QFASWapBKAn1QdYwzoluBvrWZAak9Q1Igv7bQfS0uolY4XCXx7Bb431Upjdub"

function sendGenericMessage(recipientId, messageText) {
	
	var messageData = {
		recipient: {
			id: recipientId
			},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [{
						title: "rift",
						subtitle: "Next-generation virtual reality",
						item_url: "https://www.oculus.com/en-us/rift/",
						image_url: "http://messengerdemo.parseapp.com/img/rift.png",
						buttons: [{
							type: "web_url",
							url: "https://www.oculus.com/en-us/rift/",
							title: "Open Web URL"
							},
							{
								type: "postback",
								title: "Call Postback",
								payload: "Payload for first bubble",
							}],
							
							}, {
								title: "touch",
								subtitle: "Your Hands, Now in VR",
								item_url: "https://www.oculus.com/en-us/touch/",               
								image_url: "http://messengerdemo.parseapp.com/img/touch.png",
								buttons: [{
											type: "web_url",
											url: "https://www.oculus.com/en-us/touch/",
											title: "Open Web URL"
										}, {
											type: "postback",
											title: "Call Postback",
											payload: "Payload for second bubble",
											}]
								}]
						}
					}
		}
	};  

  callSendAPI(messageData);
}

function sendTextMessage(sender, messageText) {
    messageData = {
    recipient: {
      id: sender
    },
    message: {
      text: messageText
    }
  };
    callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}
/*
function processNLP(nlp) {
	console.log("processing nlp: ",nlp.entities);
	 greeting = firstEntity(nlp, 'greetings');
	 location = firstEntity(nlp,'location');
  if (greeting && greeting.confidence > 0.8) {
    
  
   if(location && location.confidence > 0.8) {
	  return location.value +'Hi';
  }
  }
  else { 
    // default logic
	return 'Working for better result';
  }
	
}
function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

// ----------------------------------------------------------------------------
// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

// Our bot actions
const actions = {
  send({sessionId}, {text}) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      return fbMessage(recipientId, text)
      .then(() => null)
      .catch((err) => {
        console.error(
          'Oops! An error occurred while forwarding the response to',
          recipientId,
          ':',
          err.stack || err
        );
      });
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      return Promise.resolve()
    }
  },
  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
};

// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});


var apiai = require('apiai');
 
var app = apiai("<your client access token>");
 
var request = app.textRequest('<Your text query>', {
    sessionId: '<unique session id>'
});
 
request.on('response', function(response) {
    console.log(response);
});
 
request.on('error', function(error) {
    console.log(error);
});
 
request.end(); */