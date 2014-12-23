var express = require('express');
var router = express.Router();
var fb = require('fb');
var config = require('./config');

fb.api('oauth/access_token', {
	client_id: config.client_id,
	client_secret: config.client_secret,
	grant_type: 'client_credentials'
}, function (res) {
	if(!res || res.error) {
		console.log(!res ? 'error occurred' : res.error);
		return;
	}
	var accessToken = res.access_token;
	fb.setAccessToken(accessToken);
});

router.post('/', function(req, res, next) {
	fb.api('406603402849183', {fields: ['attending_count']}, function (fb_res) {
		if(!fb_res || fb_res.error) {
			console.log(!fb_res ? 'error occurred' : fb_res.error);
			next(fb_res.error);
			return;
		}
		res.status(200).send(''+fb_res.attending_count);
	});
});

module.exports = router;

