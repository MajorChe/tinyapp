const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "5678",
  },
};

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

const generateRandomID = (email) => {
  let result = (Math.random() + 1).toString(36).substring(8);
  return result;
};
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

// const urlDatabase = {
//   "one": "http://lighthouselabs.ca",
//   "two": "http://www.google.com",
// };

const generateRandomString = (longURL) => {
  let result = (Math.random() + 1).toString(36).substring(7);
  return result;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const uID = generateRandomID(req.body.email);
  const checkker = emailCheck(req.body.email);
  if (!checkker) {
    const templateVars = { email: req.body.email, password: req.body.password };
    users[uID] = {
      id: uID,
      email: templateVars.email,
      password: templateVars.password,
    };
    res.cookie("uID", uID);
    res.redirect("/urls");
  } else {
    res.status(404).send("email already exists");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/urls", (req, res) => {
  const func = (id, obj) => {
    let urlObj = {};
    for (let url in obj) {
      if (obj[url]["userID"] === id) urlObj[url] = obj[url]["longURL"];
    }
    return urlObj;
  };
  const result1 = func(req.cookies["uID"], urlDatabase);
  const templateVars = { user: users[req.cookies["uID"]], urls: result1 };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortedURL = generateRandomString(req.body.longURL);
  const id = req.cookies["uID"];
  urlDatabase[shortedURL] = { longURL: req.body.longURL, userID: id };
  res.redirect(`/urls/${shortedURL}`);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["uID"]] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("Page not found");
  }
  const longU = urlDatabase[req.params.shortURL]["longURL"];
  const templateVars = {
    user: users[req.cookies["uID"]],
    shortURL: req.params.shortURL,
    longURL: longU,
  };
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

app.post("/login", (req, res) => {
  const checkker = emailCheck(req.body.email);
  if (!checkker) {
    res.status(404).send("User not found");
  } else if (checkker["password"] !== req.body.password) {
    res.status(404).send("Password Incorrect");
  }
  res.cookie("uID", checkker["id"]);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("uID");
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["uID"],
  };
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
