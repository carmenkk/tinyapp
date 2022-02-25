const { assert } = require('chai');

const { findUserByEmail } = require('../helpers.js');
const { generateRandomString } = require('../helpers.js');
const { urlsForUser } = require('../helpers.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

describe('generateRandomString', function() {

  it('should return a string with six characters', function() {
    const stringLength = generateRandomString().length;
    const expectedLength = 6;
    assert.equal(stringLength, expectedLength);
  });
});

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, testUsers[expectedUserID]);
    
  });
});

describe('urlsForUser', function() {

  it('should return an object of url of id', function() {
    const userUrlData = urlsForUser("aJ48lW", testUrlDatabase);
    const expectedObject = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
      },
      i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW"
      }
    };
    assert.deepEqual(userUrlData, expectedObject);
  });


});