const { model, Schema } = require("mongoose");

const usersSchema = new Schema({
  /*
  - name
  - email
  - stats

  - owner
  */
});

const UsersModel = model("user", usersSchema);

module.exports = UsersModel;
