var request = require('request');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var express = require('express');
var mongoose = require('mongoose');
var hbs = require('express-handlebars');
var path = require('path');
var fs = require('fs');

// Generate the express app
var app = express();

// Designate PORT
var PORT = process.env.PORT || 3000;

fs.readdirSync(__dirname + '/models').forEach(function(filename){
  if (~filename.indexOf('.fs')) require(__dirname + '/models/' + filename)
});

// Require server routes
var routes = require('./routes/routes.js');

// Assigning routes
app.use('/', routes);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://therealizzi:tyu890@ds119078.mlab.com:19078/techcrunch";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
