var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var db = require('./config/db');
var port = process.env.PORT || 3000;
mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
require('./app/routes')(app);

app.listen(port);
console.log('App Starts...')