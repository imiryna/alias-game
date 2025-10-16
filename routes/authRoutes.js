const { Router } = require("express");

const authMiddleware = require("../middlewares");
const authController = require("../controllers");

const router = Router();

router.post("/signup", authMiddleware.checkSignupData, authController.signup);
router.post("/login", authController.login);
