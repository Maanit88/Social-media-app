import User from "../models/user.model.js";
import bcyrpt from "bcryptjs";
import { hasher } from "../utils/hasher.js";
import { generateCookies } from "../utils/generateTokens.js";
import { saveCookies } from "../utils/saveCookies.js";
import jwt from "jsonwebtoken";
import client from "../utils/client.redis.js";

const setRefreshToken = async (userId, refreshToken) => {
  await client.set(`refreshToken: ${userId}`, refreshToken, {
    ex: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    //Checking whether user already exists
    let user = await User.findOne({
      email: email,
    });

    console.log(user);
    // if user does not exist create
    if (!user) {
      console.log("here");
      const hashedPassword = await bcyrpt.hash(password, 12); //hashing the password
      const otp = (Math.floor(Math.random() * 999999) + 10000).toString(); //generating otp
      //   console.log(typeof otp);

      const securedOtp = await hasher(otp); // hashing otp
      //   console.log(securedOtp);
      user = await User.create({
        email: email,
        username: username,
        password: hashedPassword,
        verificationToken: securedOtp,
        verificationTokenExpire: new Date(Date.now() + 10 * 60 * 1000),
      });
      const userId = user._id.toString();

      //generating the access and refresh tokens
      const { accessToken, refreshToken } = await generateCookies(userId);
      setRefreshToken(userId, refreshToken);
      saveCookies(accessToken, refreshToken, res); // saving tokens in cookies
      console.log("Access token", accessToken, "RefreshToken", refreshToken);

      //Sending response
      res.status(200).json({
        status: "success",
        message: "account created successfully",
      });

      req.user = user;
    } else {
      res.json({
        message: "User already exists!! login to continue",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // getting required fields

    //Checking user exists or not
    console.log("checking user..");
    const user = await User.findOne({
      email: email,
    }).select("+password");

    if (!user)
      res.status(400).json({
        status: "fail",
        message: "No user found. Please create an account to continue!",
      });
    else {
      console.log("checking password..");
      // checking whether the user password and the saved password in the database match
      const checkPassword = await bcyrpt.compare(password, user.password);
      console.log(checkPassword);

      if (!checkPassword) {
        res.status(400).json({
          status: "fail",
          message: "Passwords do not match.",
        });
      } else {
        console.log("everything good, logged in..");
        // If everything is correct generate tokens and save them in cookies
        const { accessToken, refreshToken } = await generateCookies(
          user._id.toString()
        );
        saveCookies(accessToken, refreshToken, res);

        // response
        res.status(200).json({
          status: "success",
          message: "User logged in successfully",
          user: user,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken, accessToken } = req.cookies;
    console.log(accessToken, refreshToken);

    if (refreshToken) {
      const decoded = jwt.decode(refreshToken, process.env.SECRET);
      console.log(decoded);
      await client.del(`refreshToken : ${decoded.userId}`);
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.json({
      status: "success",
      message: "User logged out sucessfully!!",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error,
    });
  }
};
