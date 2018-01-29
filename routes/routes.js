var express = require('express');
var router = express.Router();

var articleController = require("../controllers/articleController");

router.get('/', articleController.displayAll);

router.get('/scrape', articleController.newScrape);

router.get('/delete/:id', articleController.delete);

// router.post('/add/:id', articleController.addComment);

// router.get('/deletecomment/:id', articleController.deleteComment);

module.exports = router;