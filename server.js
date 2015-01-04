// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    path = require('path'),
    bodyParser = require('body-parser'); //Parser for reading request body

//Create server
var app = express();

//Where to serve static content
app.use( express.static( path.join( application_root, 'site') ) );
app.use(bodyParser.urlencoded( {'extended' : false} ));
app.use(bodyParser.json());

//Start server
var port = 4711;

app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});

app.get('/', function(req, res) {
	res.send('safetelecom.net is up and running');
});