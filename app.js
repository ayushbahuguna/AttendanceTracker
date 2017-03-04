'use strict';

require('./helpers/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressSession = require('express-session');

const port = process.env.PORT || 3000;
require('./helpers/mongoose.js');
const {router} = require('./controllers/routes.js');
const {User} = require('./models/user.js');

var app = express();

app.set('views', './views');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
// Passport Config
require('./helpers/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use('/', router);

app.listen(port, () => {
  console.log(`Started server on ${port}`);
});
