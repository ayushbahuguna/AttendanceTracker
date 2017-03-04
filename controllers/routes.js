'use strict';

const express = require('express');
const passport = require('passport');
var router = express.Router();

const {User} = require('./../models/user.js');
const {isLoggedIn} = require('./../middlewares/authenticate.js');

router.get('/', (req, res) => {
  res.render('index', {title: 'Index', body: 'Hello from HandleBars!'});
});

router.get('/login', (req, res) => {
  res.render('login', {title: 'Login'});
});

router.get('/signup', (req, res) => {
  res.render('signup', {title: 'Signup'});
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', {title: 'Profile', user: req.user});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/signup', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  var user = new User({username, email, password});
  user.save((err) => {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send();
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/profile');
});

router.get('/ping', (req, res) => {
  res.status(200).send('pong!');
});

module.exports = {router};
