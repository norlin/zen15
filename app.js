var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var check_ip = require('./routes/check_ip');

var routes = require('./routes/index');
var count = require('./routes/count');
var kitty = require('./routes/kitty');

var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var expressLess = require('express-less');

var app = express();

// view engine setup
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/kitty', kitty);
app.use(check_ip);

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31536000000}));

app.use('/css', expressLess(__dirname + '/less', { compress: true }));

app.use('/', routes);
app.use('/count', count);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (false) {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('index', {
		message: err.message
	});
});


module.exports = app;
