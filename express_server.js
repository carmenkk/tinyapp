const express = require("express");


const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());




function generateRandomString() {
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = "";
  let charactersLength = characters.length;

  for ( let i = 0; i < 5 ; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;

}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
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
}

const findUser = (email, database) => {
  // loop through the database
  for (let user in database) {
      
      if (email === database[user].email) {
          return database[user];
      }
  }

  return false;
  // and if i find an email that matches THE SAME EMAIL
  // i will return that user.
  // if i find no user i will return null/false/undefined
}


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});


app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

 app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase , user: req.cookies["user_id"]};
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {user: req.cookies["user_id"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL], user:req.cookies["user_id"]};
  res.render("urls_show", templateVars);
  
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/:${shortURL}`);       
});



app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");

});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
 
});

app.get("/register", (req, res) => {
  let templateVars = {user: req.cookies['user_id']};
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {user: req.cookies['user_id']};
  res.render("login", templateVars);
});


app.post("/urls/:id", (req, res) => {
  const id = req.params.shortURL;
  urlDatabase[id] = req.body.updatedURL;
  res.redirect(`/urls/${shortURL}`)
});

app.post("/login", (req, res) => {
  let user = findUser(req.body.email, users);
  
  if (user) {
    if (req.body.password === user.password) {
      res.cookie('user_id',user);
      res.redirect('/urls');
    } else {
      res.statusCode = 403;
      res.send('Wrong password. Please enter again.');
    }
  } else {
    res.statusCode = 403;
    res.send('The email address is not registered.')
  }
});

app.post("/logout", (req, res) => {
  
  res.clearCookie('user_id');
  res.redirect('/urls');
 
});

app.post("/register", (req, res) => {
  let user = findUser(req.body.email, users);
  if(req.body.email && req.body.password){
    if (!user) {
      let userId = generateRandomString();
      users[userId] = {
      userId,
      email: req.body.email,
      password: req.body.password
    }
    res.cookie('user_id', userId); 
    res.redirect('/urls');
    } else {
      res.statusCode = 400;
      res.send('You already have an account.')
    }
  } else {
      res.statusCode = 400;
      res.send('Please enter valid email or password.')
    }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});