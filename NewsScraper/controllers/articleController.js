
var express = require('express');
var models = require('../models');
var mongoose = require('mongoose');

var request = require('request');
var cheerio = require('cheerio');

// This route displays everything in the database
exports.displayAll = function(req, res, next) {
	console.log("display all");

	models.Article.find({}, function(err, docs) {
		if (!err) {
			console.log("display all works!");
			
			var hbsObject = {article: docs}

			res.render('jumbotron', hbsObject)

		} else {throw err;}
	});
};

// This route initiates a new scrape and redirects to '/'
exports.newScrape = function(req, res, next) {
	console.log("new scrape");

	request("https://techcrunch.com/startups/", function(err, response, html) {

		var $ = cheerio.load(html);

		$(".block-content").each(function(i, element) {

			title = $(element).children(".post-title").text();
			link = $(element).children().children().attr("href");
			excerpt = $(element).children(".excerpt").text();

			if (title) {
				models.Article.findOneAndUpdate({
					title: title,
					excerpt: excerpt,
					link: link
				},
				models.Article({
					title: title,
					excerpt: excerpt,
					link: link
				}),
				{	upsert: true, 
					new: true, 
					runValidators: true
				},
				function(err, inserted) {
					if (err) {
						console.log(err);
					}
				})
			}
		});
	res.redirect('/');
	});
};	

exports.delete = function(req, res, next) {
	console.log("delete this!");

	models.Article.remove({'_id': req.params.id}), function (err, found) {
		if (err) {	
			return handleError (err);
		} 
		else {
			console.log("delete this works!")
			res.redirect('/');
		}
	}
};