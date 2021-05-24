const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const Message = require("../models/messageModel");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("user", "-password");

    res.status(200).render("getMessages", { messages, user: req.user });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.postMessage = (req, res, next) => {
  console.log(req.body);
  console.log(req.user);
  const message = new Message({
    text: req.body.newMessage,
    user: req.user._id,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.getRegister = (req, res) => {
  console.log(req.query);
  let errorMessage;
  if (req.query.e === "01") errorMessage = "Please enter a username.";
  if (req.query.e === "02") errorMessage = "Please enter a password.";
  if (req.query.e === "03")
    errorMessage = "Password confirmation does not match.";

  res.status(200).render("register", { errorMessage });
};

exports.postRegister = (req, res, next) => {
  if (!req.body.username) res.redirect("/register?e=01");
  if (!req.body.password) res.redirect("/register?e=02");
  if (req.body.password != req.body.confirm) {
    res.redirect("/register?e=03");
  }

  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/log-in");
    });
  });
};

exports.getLogIn = (req, res) => {
  res.status(200).render("logIn");
};

// exports.logIn = () => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/",
//   });
// };

// exports.logOut = (req, res) => {
//   req.logout();
//   res.redirect("/");
// };

// Passport Function
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
