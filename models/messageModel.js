const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Message text is required"],
    },
    user: {
      type: String,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);
