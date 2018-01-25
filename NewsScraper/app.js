var request = require('request');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var express = require('express');
var mongoose = require('mongoose');
var hbs = require('express-handlebars');

// Generate the express app
var app = express();

// Require databases
var db = require("./models");

var PORT = 3000;

// Require server routes
var index = require('./routes/index');
var users = require('./routes/users');

// Assigning routes
app.use('/', index);
app.use('/users', users);

// Setting mongoose to use promises for async queries (.then syntex)
mongoose.Promise = Promise;

// Connect to Mongo DB
mongoose.connect("mongodb://localhost/NewsScraper", {
	useMongoClient: true
});

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