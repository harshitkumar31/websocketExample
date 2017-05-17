const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9003 });



var admin = require("firebase-admin");

var serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://saeligram-c1718.firebaseio.com"
});

wss.on('connection', function connection(ws) {
	console.log('connected');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var database = admin.database();
    var d = new Date();
    var x = database.ref('IOTdata/'+d.valueOf());
    x.set({
    	data: message,
    });
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
      	//Send the message all other clients
        client.send(JSON.stringify({message, time: d.valueOf()}));
      }
    });
  });

});