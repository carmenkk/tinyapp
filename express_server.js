const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const { generateRandomString, findUserByEmail, urlsForUser } = require('./helpers');

const app = express();
const PORT = 8080;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


//// database////

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};


const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "01234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "56789"
  }
};



//// routes ////

app.get("/", (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    res.redirect("/urls");
  }
  res.redirect("/login");
});


app.get("/urls", (req, res) => {
  let userId = req.session.userId;
  if (!userId) {
    res.statusCode = 403;
    res.send('Please login your account.');
  }
  let userUrlData = urlsForUser(userId, urlDatabase);
  const templateVars = { urls: userUrlData , user: users[req.session.userId]};
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  
  if (!req.session.userId) {
    res.redirect("/login");
  }
  const templateVars = {user: users[req.session.userId]};
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const user = users[req.session.userId];
  
  if (!user) {
    res.statusCode = 403;
    res.send('Please login your account');
  }
  let shortURL = urlDatabase[req.params.id];
  if (shortURL) {
    
    if (shortURL.userID === req.session.userId) {
      const templateVars = {
        shortURL: req.params.id,
        longURL:urlDatabase[req.params.id].longURL,
        user: users[req.session.userId],
      };
      res.render("urls_show", templateVars);
    }
   
  }
  
  res.status = 404;
  res.send('Error: wrong id.');
  
});

app.get("/u/:id", (req, res) => {
 
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
 
});


app.post("/urls", (req, res) => {
  if (req.session.userId) {
    let shortURL = generateRandomString();
    let website = req.body.longURL;
    let userId = req.session.userId;
    urlDatabase[shortURL] = {
      longURL: website,
      userID: userId
    };
    res.redirect(`/urls/${shortURL}`);
    console.log(urlDatabase);
  }
  res.statusCode = 401;
  res.send('Please login your account.');
    
});


app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = req.body.updatedURL;
  res.redirect(`/urls`);
});


app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");

});



app.get("/login", (req, res) => {
  let templateVars = {user: req.session.userId};
  res.render("login", templateVars);
});


app.get("/register", (req, res) => {
  let templateVars = {user: users[req.session.userId]};
  res.render("register", templateVars);
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = findUserByEmail(email, users);
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  
  if (!user) {
    res.statusCode = 403;
    res.send('The email address is not registered.');
  }
  const result = bcrypt.compareSync(password, hashedPassword);
  
  if (!result) {
    res.statusCode = 403;
    res.send('Wrong password. Please enter again.');
  }
  req.session.userId = user.id;
  res.redirect('/urls');
    
  
});


app.post("/register", (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  let user = findUserByEmail(email, users);
  if (!email || !password) {
    res.statusCode = 400;
    res.send('Please enter valid email or password.');
  }

  if (!user) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userId = generateRandomString();
      
    users[userId] = {
      userId: userId,
      email: email,
      password: hashedPassword,
    };
    req.session.userId = userId;
    res.redirect('/urls');
  } else {
    res.statusCode = 400;
    res.send('You already have an account.');
  }
  

});


app.post("/logout", (req, res) => {
  
  req.session = null;
  res.redirect('/urls');
 
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});