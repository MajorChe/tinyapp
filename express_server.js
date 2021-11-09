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

const generateRandomString = () => {

}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/urls",(req,res) => {
  const templateVars = {urls:urlDatabase};
  res.render('urls_index',templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body.longURL);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:shortURL',(req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render('urls_show',templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
