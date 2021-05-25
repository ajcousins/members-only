const express = require("express");
const viewController = require("./../controllers/viewController");
const passport = require("passport");

const router = express.Router();

router
  .route("/")
  .get(viewController.getMessages)
  .post(viewController.postMessage);

router
  .route("/register")
  .get(viewController.getRegister)
  .post(viewController.postRegister);

router.route("/log-in").get(viewController.getLogIn);

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router
  .route("/membership")
  .get(viewController.getMembership)
  .post(viewController.postMembership);

router.route("/delete").post(viewController.deleteMessage);

router.route("/404").get(viewController.error);

module.exports = router;
