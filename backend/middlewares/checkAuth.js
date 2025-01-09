import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import User from "../models/user.model.js";

configDotenv({
  path: "./.env",
});

export const checkAuth = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  console.log(accessToken, refreshToken);
  if (!accessToken) {
    if (!refreshToken)
      return res.status(403).json({
        status: "fail",
        error: "No refreshToken found!!!",
      });
    next();
  } else {
    const isJWTVerified = jwt.verify(accessToken, process.env.SECRET);

    if (!isJWTVerified)
      return res.status(403).json({
        message: "Invalid access token!!",
      });
    else {
      console.log(isJWTVerified);
      const user = await User.findById(isJWTVerified.payload);

      req.user = user;
      next();
    }
  }
};
