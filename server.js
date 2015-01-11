// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs = require ('fs'),
    xml = require('xml2js'),
    parser = new xml.Parser();
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

app.get('/api', function(req, res) {
	res.send('SafeTelecom API Server');
});

app.get('/api/dialplans', function(req, res) {
	fs.readdir('../configs/dialplan', function(error, files) {
		var dialplans = new Array();
		files.forEach(function(fileName) {
			if (fileName.search('.xml') != -1) {
				dialplans.push(fileName.substr(0, fileName.length - 4));
			}
		});
		res.send({"dialplans": dialplans});
	});
});

app.get('/api/dialplans/:context', function(req, res) {
	var context = req.params.context;
	fs.readFile('../configs/dialplan/' + context + '.xml', 'utf-8', function (err, file) {
		if (err) throw err;
		parser.parseString(file, function(err, result) {
			var array = new Array();
			if (err) throw err;

			var subArray = new Array();

			var extensions = result.include.context[0].extension;
			extensions.forEach(function(extension) {
				subArray.push(extension.$.name);
			});
			array.push(subArray);

			res.send(Object({extensions: subArray}));
		});
	});
});

app.get('/api/dialplans/:context/:extension', function(req, res) {
	var context = req.params.context;
	var name = req.params.extension;
	var array = [];
	fs.readFile('../configs/dialplan/' + context + '.xml', 'utf-8', function (err, file) {
		if (err) throw err;
		parser.parseString(file, function(err, result) {
			var extensions = result.include.context[0].extension;
			extensions.forEach(function(extension) {
				if(extension.$.name === name) {
					var expression = extension.condition[0].$.expression;
					extension.condition[0].action.forEach(function(action) {
						console.log(action);
						array.push({action: action.$.application, data: action.$.data});
					})
				}
			});

			res.send(Object({extension: array}));

		});
	});
});

app.get('/api/directory', function(req, res) {
	fs.readdir('../configs/directory', function(error, files) {
		var directory = [];
		files.forEach(function(fileName) {
			if (fileName.search('.xml') != -1) {
				directory.push(fileName.substr(0, fileName.length - 4));
			}
		});
		res.send({"directory": directory});
	});
});

app.get('/api/directory/:account', function(req, res) {
	var account = req.params.account;
	fs.readFile('../configs/directory/' + account + '.xml', 'utf-8', function (err, file) {
		if (err) throw err;
		parser.parseString(file, function(err, result) {
//			if (err) throw err;
/*
			var array = new Array();

			var subArray = new Array();

			var extensions = result.include.context[0].extension;
			extensions.forEach(function(extension) {
				subArray.push(extension.$.name);
			});
			array.push(subArray);
*/

			res.send(result);
		});
	});


});