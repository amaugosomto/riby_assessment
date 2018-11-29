var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

var usersRouter = require('./routes/users');
var savesRouter = require('./routes/savers');

var app = express();

const mongooseConnectString = 'mongodb://localhost:27017/saverApp';
mongoose.connect(mongooseConnectString, { useNewUrlParser: true });
mongoose.connection.on('connected', function(err) {
  console.log("Connected to DB using chain: " + mongooseConnectString);
});

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin:"http://127.0.0.1:5500"}));
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

app.use('/users', usersRouter);
app.use('/saves', savesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
