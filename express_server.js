const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
app.use(cookieParser());

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

//Dummy user object that contains manually inputted users----------------------

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("1234", salt),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("5678", salt),
  },
};

//Database object for manually storing shorturl and longurl with shorturl being the key-------

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "userRandomID",
  },
};

//Helper function to generate a random string-----------------------------

const generateRandomString = (longURL) => {
  let result = (Math.random() + 1).toString(36).substring(7);
  return result;
};

//Helper function to check if the user database contains the email id passed as a parameter

const emailCheck = (emailID) => {
  for (let i in users) {
    for (let j in users[i]) {
      if (users[i][j] === emailID) {
        return users[i];
      }
    }
  }
  return false;
};

//Helper function that returns an object of userID's using id from the cookie and the database object

const urlsForUrl = (id, obj) => {
  let urlObj = {};
  for (let url in obj) {
    if (obj[url]["userID"] === id) urlObj[url] = urlDatabase[url];
  }
  return urlObj;
};

// All get routes start here-----------------------------------

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  //function that retuns all the long urls for a respective user
  const func = (id, obj) => {
    let urlObj = {};
    for (let url in obj) {
      if (obj[url]["userID"] === id) urlObj[url] = obj[url]["longURL"];
    }
    return urlObj;
  };
  const idone = req.session.id;
  const result1 = func(idone, urlDatabase);
  const templateVars = { user: users[idone], urls: result1 };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.redirect("/urls");
  }
  const longU = urlDatabase[req.params.shortURL]["longURL"];
  const id = req.session.id;
  const findUrl = urlsForUrl(id, urlDatabase);
  const templateVars = {
    user: users[req.session.id],
  };
  if (findUrl[req.params.shortURL]) {
    if (findUrl[req.params.shortURL]["userID"] === req.session.id) {
      templateVars["shortURL"] = req.params.shortURL;
      templateVars["longURL"] = longU;
    }
  }
  if (!templateVars.longURL) {
    res.redirect("/urls");
  } else {
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

//All post routes start here-------------------------------

app.post("/register", (req, res) => {
  const uID = generateRandomString(req.body.email);
  const checkker = emailCheck(req.body.email);
  if (!checkker) {
    users[uID] = {
      id: uID,
      email: req.body.email,
    };
    hashedPass = bcrypt.hash(req.body.password, salt).then((result) => {
      users[uID]["password"] = result;
    });
    req.session.id = uID;
    res.redirect("/urls");
  } else {
    res
      .status(404)
      .send(
        "email already exists. Please <a href = '/register'>register here</a> or <a href = '/login'>login here</a>"
      );
  }
});

app.post("/urls", (req, res) => {
  const shortedURL = generateRandomString(req.body.longURL);
  const id = req.session.id;
  urlDatabase[shortedURL] = { longURL: req.body.longURL, userID: id };
  res.redirect(`/urls/${shortedURL}`);
});

app.post("/login", (req, res) => {
  const checkker = emailCheck(req.body.email);
  if (!checkker) {
    res
      .status(404)
      .send("User not found. Please <a href = '/login'>try here</a>");
  } else {
    bcrypt.compare(req.body.password, checkker["password"]).then((result) => {
      if (result) {
        req.session.id = checkker["id"];
        res.redirect("/urls");
      } else {
        res
          .status(404)
          .send("incorrect Password. Please <a href = '/login'>try here</a>");
      }
    });
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.id;
  const findUrl = urlsForUrl(id, urlDatabase);
  if (findUrl[req.params.shortURL]) {
    if (findUrl[req.params.shortURL]["userID"] === req.session.id) {
      delete urlDatabase[req.params.shortURL];
      res.redirect("/urls");
    }
  } else {
    res.status(404).send("Please login with right user to delete");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const id = req.session.id;
  const findUrl = urlsForUrl(id, urlDatabase);
  if (findUrl[req.params.shortURL]) {
    if (findUrl[req.params.shortURL]["userID"] === req.session.id) {
      urlDatabase[req.params.shortURL] = {
        longURL: req.body.longURL,
        userID: req.session.id,
      };
      res.redirect("/urls");
    }
  } else {
    res.send("error");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
