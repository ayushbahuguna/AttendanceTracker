/* global it describe beforeEach */

require('./../../helpers/config.js');
require('./../../helpers/mongoose.js');

const expect = require('expect');
const {ObjectId} = require('mongodb');

const {User} = require('./../../models/user.js');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
  _id: userOneId,
  username: 'prajjwal',
  password: 'user1pass',
  email: 'prajjwaldimri@hotmail.com'
}, {
  _id: userTwoId,
  username: 'jen',
  password: 'user2pass',
  email: 'jen@example.com'
}];

beforeEach((done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
});

describe('User Model', () => {
  it('should not save plain password', (done) => {
    User.findOne({username: users[0].username}, (err, user) => {
      if (err) { done(err); }
      expect(user.password).toNotEqual(users[0].password);
      done();
    });
  });

  it('should not save users with invalid password', (done) => {
    var user = new User({username: 'test', password: '23'});
    user.save().then((err) => {
      done(err);
    });
    User.findOne({username: 'test'}, (err, user) => {
      if (err) { done(err); }
      expect(user).toNotExist();
      done();
    }).catch((err) => done(err));
  });

  it('should return true if username and password is valid', (done) => {
    User.findOne({username: users[0].username}, (e, user) => {
      user.isPasswordCorrect(users[0].password).then((res) => {
        expect(res).toEqual(true);
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return false if username or password is invalid', (done) => {
    User.findOne({username: users[1].username}, (e, user) => {
      user.isPasswordCorrect(users[0].password).then((res) => {
        expect(res).toEqual(false);
        done();
      }).catch((err) => done(err));
    });
  });
});
