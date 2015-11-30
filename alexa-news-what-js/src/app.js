/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

var http = require('http');

var collections = new Object();
collections["top stories"] = "f3dbdc7c88f8857167cec69caaf13ea7";
collections["afl"] = "c3799e92f40ec3b728ecc2f35764d48a";
collections["world"] = "4fa837274afa25bed9e73fcbfd90d3a5";
collections["business"] = "926df23bf2102389524f99f2282fe458";
collections["technology"] = "9035b9b871a198a4f9574ddaa13e20e6";
collections["entertainment"] = "b84832220a15a2176d46d1162b76fb89";
collections["national"] = "fc12325e631cc05ec4074ab2189bc56a";
collections["local"] = "64a05c1eb2ddedeff03d0ac035aa6100";
collections["lifestyle"] = "3503da4ab53909af011023ea4c71581e";
collections["cricket"] = "083802726d09dd42d5e17f9180d328b2";
collections["fashion"] = "754d21530dbccc1d4d0669104c58eb08";

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
         }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
            ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
            ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
            ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
        


    // Dispatch to your skill's intent handlers
    if ("GetNews" === intentName) {
        var body = "";
        console.log("Intent Called");
        var sessionAttributes = session.attributes;
        if (!sessionAttributes){
            sessionAttributes = {};
        }
        var category = null;
        if (session.attributes){
            category = session.attributes.category;
        }
        if (category){
            var speechOutput = "Here's an article in " + category + ". ";
        }
        else {
            category = "world";
            var speechOutput = "I'm picking an article from "+category+" news. ";
        }
        console.log("cat:GN: "+category);
        var repromptText="Do you want more?";
        var shouldEndSession = false;
        
        if (!sessionAttributes.hasOwnProperty(category)){
            sessionAttributes[category] = [];
        }
        if (sessionAttributes[category].length === 0){
          getJSONNewsForCategory(category, function(news){
            sessionAttributes[category] = sessionAttributes[category].concat(news);

            var repromptText="Should I continue?";
            var shouldEndSession = false;
            num = Math.floor((Math.random() * sessionAttributes[category].length));
            article = sessionAttributes[category].splice(num, 1)[0];
            //speechOutput += '<break time="1s"/>'
            //console.log('Article',article);
            speechOutput += article["title"] +". ";
            //speechOutput += '<break time="1s"/>'
            speechOutput += article["description"];
            speechOutput += "Should I read more news?";
            callback(sessionAttributes,
               buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
          });
        }
        else{
          var repromptText="Should I continue?";
          var shouldEndSession = false;
          num = Math.floor((Math.random() * sessionAttributes[category].length));
          article = sessionAttributes[category].splice(num, 1)[0];
          //speechOutput += '<break time="1s"/>'
          speechOutput += article["title"] + ". " + article["description"];
          speechOutput += " Should I read more news?";
          callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        }
        
            speechOutput = body
            //context.succeed(body);
            callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
   
        
    }
    else if ("NewsCat" === intentName) {
        console.log("Cat Intent Called");
        var category = intent.slots.Category.value;
        sessionAttributes = createCategoryAttribute(category);
        var speechOutput =  "Hold on while I gather some "+ category + " news for you. ";
        // TODO : Call HTTP stuff to get News articles and store them in session cache 
        if (!sessionAttributes.hasOwnProperty(category)){
            sessionAttributes[category] = [];
        }
        if (sessionAttributes[category].length === 0){
          getJSONNewsForCategory(category, function(news){
            sessionAttributes[category] = sessionAttributes[category].concat(news);

            var repromptText="Should I continue?";
            var shouldEndSession = false;
            num = Math.floor((Math.random() * sessionAttributes[category].length));
            article = sessionAttributes[category].splice(num, 1)[0];
            //speechOutput += '<break time="1s"/>'
            //console.log('Article',article);
            speechOutput += article["title"] +". ";
            //speechOutput += '<break time="1s"/>'
            speechOutput += article["description"];
            speechOutput += " Do you want to hear more news? ";

            callback(sessionAttributes,
               buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
          });
        }
        else{
          var repromptText="Should I continue?";
          var shouldEndSession = false;
          num = Math.floor((Math.random() * sessionAttributes[category].length));
          article = sessionAttributes[category].splice(num, 1)[0];
          //speechOutput += '<break time="1s"/>'
          speechOutput += article["title"] + ". " + article["description"];
          speechOutput += " Do you want to hear more news? ";
          callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        }
    }
    else if ("EmailNews" === intentName) {
        console.log("Email")
        var person = intent.slots.Person.value;
        var speechOutput =  "All done.";// By the way, You should probably call "+ person;
        var repromptText="So, Want more news? I can go on forever and ever and ever..";
        var shouldEndSession = false;
        sessionAttributes = session.attributes;
        callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
    else if ("StopNews" === intentName) {
        var speechOutput =  "See you later";
        var repromptText="";
        var shouldEndSession = true;
        sessionAttributes = {}
        callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
    else {
        throw "Invalid intent";
    }
    console.log("The end")
}



function getJSONNewsForCategory(category, callback){
    cat_id = collections[category.toLowerCase()];
    if (!cat_id){
        cat_id = collections["world"];
    }
    console.log("CAT "+category+ ":"+category.toLowerCase()+" "+cat_id);
    var req = http.get("http://128.199.213.139:8001/collection.json?num=20&id="+cat_id, function(res) {
      var body = '';
      console.log('Status:', res.statusCode);
      console.log('Headers:', JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
          body += chunk;
      });
      res.on('end', function() {
          console.log('Successfully processed HTTPS response');
          // If we know it's JSON, parse it
          if (res.headers['content-type'] === 'application/json') {
              var news = JSON.parse(body);
          }
          var news = JSON.parse(body);
          console.log('Got '+news.length+' articles');
          //console.log("Body: "+news);
          callback(news)
      });
    });

}
/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
            ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the Herald, " +
            "Tell me what category you want news for or say surprise me for your personalized news";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Sorry, didn't catch you. Tell me what category of news you'd like to hear now or say surprise me";
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setColorInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var favoriteColorSlot = intent.slots.Color;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (favoriteColorSlot) {
        var favoriteColor = favoriteColorSlot.value;
        sessionAttributes = createFavoriteColorAttributes(favoriteColor);
        speechOutput = "I now know your favorite color is " + favoriteColor + ". You can ask me " +
                "your favorite color by saying, what's my favorite color?";
        repromptText = "You can ask me your favorite color by saying, what's my favorite color?";
    } else {
        speechOutput = "I'm not sure what your favorite color is, please try again";
        repromptText = "I'm not sure what your favorite color is, you can tell me your " +
                "favorite color by saying, my favorite color is red";
    }

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createCategoryAttribute(category) {
    return {
        category: category
    };
}

 function delay(ms) {
        var cur_d = new Date();
        var cur_ticks = cur_d.getTime();
        var ms_passed = 0;
        while(ms_passed < ms) {
            var d = new Date();  // Possible memory leak?
            var ticks = d.getTime();
            ms_passed = ticks - cur_ticks;
            // d = null;  // Prevent memory leak?
        }
    }


function getColorFromSession(intent, session, callback) {
    var favoriteColor;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if(session.attributes) {
        favoriteColor = session.attributes.favoriteColor;
    }

    if(favoriteColor) {
        speechOutput = "Your favorite color is " + favoriteColor + ", goodbye";
        shouldEndSession = true;
    }
    else {
        speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color " +
                " is red";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
