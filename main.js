var express = require('express');
var app = express();
var bodyParser = request('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


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

  function test(agent) {
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
  intentMap.set('Konzert', test);
  intentMap.set('Sport', test);
  agent.handleRequest(intentMap);
});

app.listen(process.env.PORT, function() {
  console.log('Example app listening.');
});