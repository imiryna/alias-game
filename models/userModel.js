const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  stat: {
    type: Number,
    default: 0,
  },
});

const UserModel = model("user", userSchema);

module.exports = UserModel;
