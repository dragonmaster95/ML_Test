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
    let konzert = agent.parameters.Konzert;
    return axios.get(API_URL + '&segmentId=KZFzniwnSyZfZ7v7nJ')
      .then(function(result) {
        let events = result.data._embedded.events;
        if (!events) {
          agent.add(`Something went wrong! No concert found.`);
          return;
        }        
        let konzertImage;
        events.forEach(function(konzert) {
          console.log(konzert);
          let name = konzert.name;
          let info = konzert.info;
          let date = konzert.dates.start.localDate+" "+konzert.dates.start.localTime;
          
          //let konzertImage;
          if (konzert.images) {
            konzertImage=new Image(konzert.images[0].url);
          }
        });
        agent.add(new Image(konzertImage))

      });
  }

  function searchKonzert(agent) {
    let konzert = agent.parameters.Konzert;
    return axios.get(API_URL+'&segmentId=KZFzniwnSyZfZ7v7nJ&q='+ encodeURIComponent(konzert))
      .then(function(result) {
        let events = result.data._embedded.events;
        if (!events) {
          agent.add(`Something went wrong! No concert found.`);
          return;
        }        
        let konzertList;
		events.forEach(function(konzert) {
			console.log(konzert);
			let name = konzert.name;
			let info = konzert.info;
			let date = konzert.dates.start.localDate+" "+konzert.dates.start.localTime;
			
			let konzertImage;
			if (konzert.images) {
				konzertImage=new Image(images[0].url);
			}
			
			//konzertList=
			
			/*conv.ask(new BrowseCarousel({
				items: [
				  new BrowseCarouselItem({
					title: 'Title of item 1',
					url: 'https://example.com',
					description: 'Description of item 1',
					image: new Image({
					  url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
					  alt: 'Image alternate text',
					}),
					footer: 'Item 1 footer',
				  }),
				  new BrowseCarouselItem({
					title: 'Title of item 2',
					url: 'https://example.com',
					description: 'Description of item 2',
					image: new Image({
					  url: 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
					  alt: 'Image alternate text',
					}),
					footer: 'Item 2 footer',
				  }),
				],
			  }));*/
  
			agent.add("Konzert: "+name+"\nDate: "+date);
		});

        //agent.add("Konzert: "+name+"\nInfo: "+info);

      });
  }

  function sport(agent) {
    return axios.get(API_URL + '&segmentId=KZFzniwnSyZfZ7v7nE')
    .then(function(result) {
      let events = result.data._embedded.events;
      if (!events) {
        agent.add(`Something went wrong! No concert found.`);
        return;
      }        
      let sport = events[0];
      let name = sport.name;
      let url = sport.url;

      agent.add("Sport: "+name+"\nURL: "+url);

    });
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
  intentMap.set('GetKonzert', konzert);
  intentMap.set('Sport', sport);
  agent.handleRequest(intentMap);
});

app.listen(process.env.PORT, function() {
  console.log('Example app listening.');
});