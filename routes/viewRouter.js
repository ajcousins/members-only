const express = require("express");
const viewController = require("./../controllers/viewController");

const router = express.Router();

router
  .route("/")
  .get(viewController.getMessages)
  .post(viewController.postMessage);

router
  .route("/register")
  .get(viewController.getRegister)
  .post(viewController.postRegister);

router
  .route("/log-in")
  .get(viewController.getLogIn)
  .post(viewController.postLogIn);

router.route("/log-out").get(viewController.logOut);

router
  .route("/membership")
  .get(viewController.getMembership)
  .post(viewController.postMembership);

router.route("/delete").post(viewController.deleteMessage);

router.route("/404").get(viewController.error);

module.exports = router;
