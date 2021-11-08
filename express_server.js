const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "one": 'http://lighthouselabs.ca',
  "two": 'http://www.google.com'
}

app.get('/',(req,res) => {
  res.send("Hello WOrld!");
});

app.get('/urls.json',(req,res) => {
  res.json(urlDatabase);
});

app.get('/hello',(req,res) => {
  res.send('<html><body><h1>Hello JavaScript</h1></body></html>');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})