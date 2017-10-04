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

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;
	  console.log("Entry: ", entry);

      // Iterate over each messaging event
      entry.messaging.forEach( function(event) {
		  console.log("Event: ", event);
		  
		var sender=event.sender.id;
		
		if (event.message) {
			console.log("Message data: ", event.message);
			console.log("message text: ",event.message.text);
			
			var replytext=processNLP(event.message.nlp);
			sendTextMessage(sender,replytext);
			
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
				console.log("Webhook received unknown event: ", event);
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

function processNLP(nlp) {
	console.log("processing nlp: ",nlp.entities);
	const greeting = firstEntity(nlp, 'greeting');
  if (greeting && greeting.confidence > 0.8) {
    return 'Hi there!';
  } else { 
    // default logic
	return 'Working for better result';
  }
	
}
function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}
