const express = require('express');
const app = express();
const PORT = 8080;

app.get('/',(req,res) => {
  res.send("Hello WOrld!")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})