const { Router } = require("express");
const { checkSignupData } = require("../middlewares");
const { signup, login, refresh } = require("../controllers");

const router = Router();

router.post("/signup", checkSignupData, signup);
router.post("/login", login);
router.post("/refresh", refresh);

module.exports = router;
