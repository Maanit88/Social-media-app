import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv({
  path: "./.env",
});

console.log(process.env.SECRET);

export const generateCookies = async (payload) => {
  const accessToken = jwt.sign({ payload }, process.env.SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ payload }, process.env.SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
