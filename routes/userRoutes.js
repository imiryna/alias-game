const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  //createUser,
  updateUserStats,
  deleteUser,
} = require("../controllers/userController");

//const { authMiddleware } = require("../middlewares");

// routes for users
router.get("/", getAllUsers);
router.get("/:id", getUserById);
//router.post("/", createUser);
router.patch("/:id/stats", updateUserStats);
router.delete("/:id", deleteUser);

module.exports = router;
