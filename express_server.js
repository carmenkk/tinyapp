const express = require("express");


const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());



// helper functions
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

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

const urlsForUser = (id, urlDatabase) => {
  let userUrlData = {};
  for (let shortURL in urlDatabase) {
    if ( urlDatabase[shortURL].userID === id) {
      userUrlData[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrlData;
};
  




// database

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
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}



// routes

app.get("/", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  } 
  res.redirect("/login")
});


 app.get("/urls", (req, res) => {
  let userId = req.cookies["user_id"].id;
  let userUrlData = urlsForUser( userId, urlDatabase);
  const templateVars = { urls: userUrlData , user: req.cookies["user_id"]};
  if (req.cookies["user_id"]) {
    
    
    res.render("urls_index", templateVars);
  }
  res.statusCode = 401;
  res.send("Please login your account");

  
});


app.get("/urls/new", (req, res) => {
  
  if (!req.cookies["user_id"]) {
    res.redirect("/login")
  }
  const templateVars = {user: req.cookies["user_id"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { shortURL: req.params.id, longURL:urlDatabase[req.params.id].longURL, user:req.cookies["user_id"]};
  res.render("urls_show", templateVars);
  
});


app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let website = req.body.longURL;
  let userId = req.cookies["user_id"].id;
  

  
  urlDatabase[shortURL] = {
    longURL: website,
    userID: userId
  };
  res.redirect(`/urls/:${shortURL}`);  
  console.log(urlDatabase);     
});



app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");

});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
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
  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = req.body.updatedURL;
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