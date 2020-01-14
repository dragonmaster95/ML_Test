const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');

const API_URL = "https://app.ticketmaster.com/discovery/v2/events?apikey=deGiQuANy4Xb6RVKKcHxA5GdmH9KYGyt&locale=*";

app.get('/', function(req,res) {
  res.send('Hello World!');
});


app.post('/', function(request, response) {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Hello World2!`);
  }

  function konzert(agent) {
    axios.get(API_URL + '&segmentId=KZFzniwnSyZfZ7v7nJ')
      .then(function(result) {
        let konzerte = result.data._embedded.events;
        if (!konzerte) {
          agent.add(`Something went wrong! No konzert found.`);
          return;
        }        
        let konzert = konzerte[0];
        let name = konzert.name;
        let info = konzert.info;

        agent.add("Konzert: "+name+"\nInfo: "+info);

      });
  }

  function sport(agent) {
    axios.get(API_URL + '&segmentId=KZFzniwnSyZfZ7v7nJ')
    agent.add(`Hello World2asdasd!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Konzert', konzert);
  intentMap.set('Sport', sport);
  agent.handleRequest(intentMap);
});

app.listen(process.env.PORT, function() {
  console.log('Example app listening.');
});