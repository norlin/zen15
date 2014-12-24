var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var count = req.app.get('count') || 0;
	res.render('index', { count: count });
});

module.exports = router;
