const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserStats,
  deleteUser,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware.js");

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.patch("/:id/stats", authMiddleware, updateUserStats);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
