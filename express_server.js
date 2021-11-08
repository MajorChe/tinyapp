const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "one": 'http://lighthouselabs.ca',
  "two": 'http://www.google.com'
}

app.get('/',(req,res) => {
  res.send("Hello WOrld!")
});

app.get('/urls.json',(req,res) => {
  res.json(urlDatabase);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})