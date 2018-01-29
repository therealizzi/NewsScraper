// Initialize NPM requirements
var express = require('express');
var mongojs = require("mongojs");

var request = require('request');
var cheerio = require('cheerio');

// Initialize Express
var router = express.Router();

// Database configuration
var databaseUrl = "techcrunch";
var collections = ["startups"];

var models = require("./../models");

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

router.get("/scrape", function(req, res) {

	request("https://techcrunch.com/startups/", function(err, response, html) {

		var $ = cheerio.load(html);

		$(".block-content").each(function(i, element) {

			title = $(element).children(".post-title").text();
			link = $(element).children().children().attr("href");
			excerpt = $(element).children(".excerpt").text();

			if (title) {
				db.news.insert({
					title: title,
					excerpt: excerpt,
					link: link
				},
				function(err, inserted) {
					if (err) {
						console.log(err);
						res.redirect('/');
					}
				})
			}
		});
	res.redirect('/');
	});
});

router.get("/", function(req, res) {

	db.news.find({}, function(error, found){
		if (error) {
			console.log(error);
		}
		else {

			var hbsObject = {article: found};

			res.render("jumbotron", hbsObject);
		}
	});
});

router.get("/delete/:id", function(req, res){

	console.log(req.params.id);

	db.news.remove({'_id': db.ObjectId(req.params.id)}, function(error, found){
		if (error) {
			console.log(error);
		}
		else {
			
			res.redirect('/')
		}
	});
});

module.exports = router;
