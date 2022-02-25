const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

const findUserByEmail = (email, users) => {
  // loop through the database
  for (let userId in users) {
    const user = users[userId];
    if (email === user.email) {
      return user;
    }
  }

  return false;

};

const urlsForUser = (id, urlDatabase) => {
  let userUrlData = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrlData[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrlData;
};
  
module.exports = {
  generateRandomString,
  findUserByEmail,
  urlsForUser
};