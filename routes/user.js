const userRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const users = [
  {
    username: "haridebl",
    password: "rticle",
    role: "admin",
  },
  {
    username: "basha",
    password: "shiny",
    role: "user",
  },
];

const accessTokenSecret = "rticletokensecretaccess";
userRoute.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret
    );

    res.json({
      accessToken,
    });
  } else {
    res.send("Username or password incorrect");
  }
});

userRoute.post("/register", (req, res) => {
  users.push(req.body);
  res.send("User Created succesfully");
});

module.exports = userRoute;
