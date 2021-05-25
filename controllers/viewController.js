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
  new Message({
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
  let errorMessage;
  if (req.query.e === "01") errorMessage = "Please enter a username.";
  if (req.query.e === "02") errorMessage = "Please enter a password.";
  if (req.query.e === "03")
    errorMessage = "Password confirmation does not match.";

  res.status(200).render("register", { errorMessage });
};

exports.postRegister = (req, res, next) => {
  if (!req.body.username) res.redirect("/register?e=01");
  else if (!req.body.password) res.redirect("/register?e=02");
  else if (req.body.password != req.body.confirm) {
    res.redirect("/register?e=03");
  } else {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      new User({
        username: req.body.username,
        password: hashedPassword,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/log-in");
      });
    });
  }
};

exports.getLogIn = (req, res) => {
  res.status(200).render("logIn");
};

exports.postLogIn = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});

exports.logOut = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.getMembership = (req, res) => {
  let errorMessage;
  if (req.query.e === "01") errorMessage = "Incorrect Password";
  res.status(200).render("membership", { errorMessage });
};

exports.postMembership = async (req, res) => {
  if (
    req.body.password !== process.env.MEMBERSHIP &&
    req.body.password !== process.env.ADMIN
  ) {
    res.redirect("/membership?e=01");
  } else if (req.body.password === process.env.ADMIN) {
    try {
      await User.findByIdAndUpdate(
        req.body.userId,
        {
          isMember: true,
          isAdmin: true,
        },
        { runValidators: true }
      );
      res.redirect("/");
    } catch (err) {
      res.status(404).render("404", { message: err });
    }
  } else {
    try {
      await User.findByIdAndUpdate(
        req.body.userId,
        {
          isMember: true,
        },
        { runValidators: true }
      );
      res.redirect("/");
    } catch (err) {
      res.status(404).render("404", { message: err });
    }
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.body.messageId);
    res.redirect("/");
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
};

exports.error = (req, res) => {
  res.status(200).render("404");
};

// Passport Functions
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
