'use strict';
const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  email: String,
  password: {
    type: String,
    required: true,
    unique: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 1
  }
});

// https://www.npmjs.com/package/bcryptjs#usage---async
UserSchema.pre('save', function (next) {
  var user = this;

  if (!(user.isModified('password'))) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.isPasswordCorrect = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, res) => {
      if (err) { reject(); }
      resolve(res);
    });
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
