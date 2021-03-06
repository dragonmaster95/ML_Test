const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {WebhookClient, Image} = require('dialogflow-fulfillment');
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
    //let konzert = agent.parameters.Konzert;
    return axios.get(API_URL + '&segmentId=KZFzniwnSyZfZ7v7nJ' + '&city='+agent.parameters.city)
      .then(function(result) {
        let events = result.data._embedded.events;
        if (!events) {
          agent.add(`No concerts were found.`);
          return;
        }        
        events.forEach(function(konzert) {
          let name = konzert.name;
          let date = "";
          if (konzert.dates.start.localDate) date +=" "+ konzert.dates.start.localDate;
          if (konzert.dates.start.localTime) date +=" "+ konzert.dates.start.localTime;
          let konzertOutput = name +" "+ date;

          let konzertImage;
          if (konzert.images) {
            konzertImage=konzert.images[0].url;
          }
          else konzertImage = null;
          
          /*let konzertVenues = "";
          if (konzert.venues[0].name) {
            konzertVenues = konzert.venues[0].name;
          }
          else konzertVenues = null;*/
          agent.add(konzertOutput);
          agent.add(new Card({
            title: konzert.name,
            imageURL: konzertImage,
            text: date
          }));
          agent.add(new Image(konzertImage));
        });
      });
  } 

  function sport(agent) {
    //let sport = agent.parameters.Sport
    return axios.get(API_URL + '&segmentId=KZFzniwnSyZfZ7v7nE' + '&city='+agent.parameters.city)
    .then(function(result) {
      let events = result.data._embedded.events;
      if (!events) {
        agent.add(`No sport event was found.`);
        return;
      }        
      events.forEach(function(sport) {
        console.log(sport);
        let name = sport.name;
        let date = "";
        if (sport.dates.start.localDate) date +=" "+ sport.dates.start.localDate;
        if (sport.dates.start.localTime) date +=" "+ sport.dates.start.localTime;
        let sportOutput = name +" "+ date;

        let sportImage;
        if (sport.images) {
          sportImage=sport.images[0].url;
        }
        else sportImage = null;
        
        /*let sportVenues;
        if (sport.venues[0].name) {
          sportVenues = sport.venues[0].name;
        }
        else sportVenues = null;*/
        agent.add(sportOutput);
        agent.add(new Card({
          title: sport.name,
          imageURL: sportImage,
          text: date
        }));
        agent.add(new Image(sportImage));
      });
    });
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    //agent.add(`I'm sorry, can you try again?`);
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