const model = require("../models");
const { HttpError } = require("../utils");
const bcrypt = require("bcryptjs");
const { signToken } = require("./jwtService");

const hashPassword = (password) => {
  const salt = process.env.BCRYPT_SALT;
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

exports.signup = async (data) => {
  const hash = hashPassword(data.password);

  const newUser = await model.UsersModel.create({
    email: data.email,
    password: hash,
  });
  newUser.password = undefined;

  const token = signToken(newUser.id);

  return { user: newUser, token };
};

exports.login = async ({ email, password }) => {
  const user = await model.UsersModel.findOne({ email: email }); //.select("+password")

  if (!user) throw new HttpError(401, "Not authrized..");

  const incomePassword = hashPassword(password);

  if (incomePassword !== user.password) throw new HttpError(401, "Wrong password...");

  const token = signToken(user.id);
  user.token = token;
  await user.save();
  user.password = undefined;
  return { user, token };
};
