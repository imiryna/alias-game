const { Router } = require("express");

const { checkSignupData } = require("../middlewares");

const { signup } = require("../controllers");

const router = Router();

router.post("/signup", checkSignupData, signup);
// router.post("/login", authController.login);

module.exports = router;
