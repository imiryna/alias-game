const jwt = require("jsonwebtoken");
const HttpError = require("../utils");

exports.signToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_EXPIRES });

  return { accessToken, refreshToken };
};

exports.checkToken = (token) => {
  if (!token) throw new HttpError(401, "Not logged in..");
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    return id;
  } catch (e) {
    throw new HttpError(401, "Not logged in..");
  }
};
