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
  const templateVars = { urls: urlDatabase , username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL], username:req.cookies["username"]};
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

app.post("/urls/:id", (req, res) => {
  const id = req.params.shortURL;
  urlDatabase[id] = req.body.updatedURL;
  res.redirect(`/urls/${shortURL}`)
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username',username);
  res.redirect('/urls');
 
});

app.post("/logout", (req, res) => {
  const username = req.body.username;
  res.clearCookie('username');
  res.redirect('/urls');
 
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});