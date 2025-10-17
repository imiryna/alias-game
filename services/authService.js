const model = require("../models");
const { HttpError } = require("../utils");

exports.checkUserExists = async (filter) => {
  const userExist = await model.UserModel.exists(filter);

  if (userExist) throw new HttpError(409, "Email in use");
};

exports.signup = async (data) => {
  //   const hash = hashPassword(data.password);
  //   const newUser = await models.UsersModel.create({
  //     email: data.email,
  //     password: hash,
  //     avatarURL: avatarLink,
  //     verificationToken: uuidv4(),
  //   });
  //   newUser.password = undefined;
  //   return { user: newUser };
};

exports.login = async ({ email, password }) => {
  // const user = await models.UsersModel.findOne({ email: email }); //.select("+password")
  // if (!user) throw new HttpError(401, "Not authrized..");
  // const incomePassword = hashPassword(password);
  // if (incomePassword !== user.password) throw new HttpError(401, "Wrong password...");
  // const token = signToken(user.id);
  // user.token = token;
  // await user.save();
  // user.password = undefined;
  // return { user, token };
};
