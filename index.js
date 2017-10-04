var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

//privacy policy
app.get('/privacypolicy', function(req,res) {
	res.sendFile('privacypolicy.htm', {root: __dirname })
})


// for Facebook verification
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'niec') {
        res.send(req.query['hub.challenge'])
    } 
    res.send('Error, wrong token')
})




// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  
  console.log("Message data: ", event.message);
  if (event.message.text) {
            text = event.message.text
            if (text === 'hi') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "parrot: " + text.substring(0, 200))
        }
	if (event.postback) {
            text = JSON.stringify(event.postback)
            //sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
          //  continue
        }
}

// API End Point - added by Stefan
/*

app.post('/webhook', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'hi') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "parrot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

*/


var token = "EAAKAyyxIS1kBADvZCrHZC2MXMkuzVZA8t1P4GrXLI9VYwu4Hq2LhON4QA0XFmrezSu1Fc0w1s4llXzgq7V8W0j7rkpkG0ai2Czn2DnLWLCMbepcInZAPVJI9QFASWapBKAn1QdYwzoluBvrWZAak9Q1Igv7bQfS0uolY4XCXx7Bb431Upjdub"

// function to echo back messages - added by Stefan

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/...',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Send an test message back as two cards.

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Ai Chat Bot Communities",
                    "subtitle": "Communities to Follow",
                    "image_url": "http://1u88jj3r4db2x4txp44yqfj1.wpengine.netdna-cdn.com/...",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/groups/aic...",
                        "title": "FB Chatbot Group"
                    }, {
                        "type": "web_url",
                        "url": "https://www.reddit.com/r/Chat_Bots/",
                        "title": "Chatbots on Reddit"
                    },{
                        "type": "web_url",
                        "url": "https://twitter.com/aichatbots",
                        "title": "Chatbots on Twitter"
                    }],
                }, {
                    "title": "Chatbots FAQ",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "https://tctechcrunch2011.files.wordpress.com/...",
                    "buttons": [{
                        "type": "postback",
                        "title": "What's the benefit?",
                        "payload": "Chatbots make content interactive instead of static",
                    },{
                        "type": "postback",
                        "title": "What can Chatbots do",
                        "payload": "One day Chatbots will control the Internet of Things! You will be able to control your homes temperature with a text",
                    }, {
                        "type": "postback",
                        "title": "The Future",
                        "payload": "Chatbots are fun! One day your BFF might be a Chatbot",
                    }],
                },  {
                    "title": "Learning More",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "http://www.brandknewmag.com/wp-cont...",
                    "buttons": [{
                        "type": "postback",
                        "title": "AIML",
                        "payload": "Checkout Artificial Intelligence Mark Up Language. Its easier than you think!",
                    },{
                        "type": "postback",
                        "title": "Machine Learning",
                        "payload": "Use python to teach your maching in 16D space in 15min",
                    }, {
                        "type": "postback",
                        "title": "Communities",
                        "payload": "Online communities & Meetups are the best way to stay ahead of the curve!",
                    }],
                }]  
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/...',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


  
