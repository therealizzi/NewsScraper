// Initialize NPM requirements
var express = require('express');
var mongojs = require("mongojs");

var request = require('request');
var cheerio = require('cheerio');

// Initialize Express
var router = express.Router();

// Database configuration
var databaseUrl = "ycomb";
var collections = ["news"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

router.get("/data", function(req, res) {
	db.news.find({}, function(error, found){
		if (error) {
			console.log(error);
		}
		else {
			res.json(found);
		}
	});
});

router.get("/scrape", function(req, res) {

	request("https://news.ycombinator.com/news", function(err, response, html) {

		var $ = cheerio.load(html);

		$(".title a").each(function(i, element) {

			title = $(element).text();
			link = $(element).attr("href");

			if (title) {
				db.news.insert({
					title: title,
					link: link
				},
				function(err, inserted) {
					if (err) {
						console.log(err)
					}
					else {
						console.log(inserted)
					}
				})
			}
		});
	});
});

module.exports = router;
