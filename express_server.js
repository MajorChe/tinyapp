const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "one": "http://lighthouselabs.ca",
  "two": "http://www.google.com",
};

const generateRandomString = (longURL) => {
  let result = (Math.random() + 1).toString(36).substring(7);
  return result;
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/urls",(req,res) => {
  const templateVars = {urls:urlDatabase};
  res.render('urls_index',templateVars);
});

app.post("/urls", (req, res) => {
  const shortedURL = generateRandomString(req.body.longURL)
  urlDatabase[shortedURL] = req.body.longURL;
  // const templateVars = {shortURL: shortedURL,longURL: req.body.longURL}
  // res.render('urls_show',templateVars);  //can also be done this way instead of redirect
  res.redirect(`/urls/${shortedURL}`);  
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:shortURL',(req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  if(!templateVars.longURL) {
    res.redirect('/urls');
  } else{
    res.render('urls_show',templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post("/urls/:shortURL",(req,res) => {
  //const templateVars = {shortURL: req.params.shortURL, longURL: req.body.longURL}
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
