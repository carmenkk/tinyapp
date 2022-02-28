// generate six random alphanumeric characters for shortURL
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};


const findUserByEmail = (email, users) => {
  // loop through the database
  for (let userID in users) {
    const user = users[userID];
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