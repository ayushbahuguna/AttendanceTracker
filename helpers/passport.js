const LocalStrategy = require('passport-local').Strategy;
const {User} = require('./../models/user.js');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({username}, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message: 'Incorrent Username'});
      }

      user.isPasswordCorrect(password).then((res) => {
        if (!res) {
          return done(null, false, {message: 'Incorrect Password'});
        }
      });

      return done(null, user);
    });
  }));
};
