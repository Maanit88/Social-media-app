import User from "../models/user.model.js";
import bcyrpt from "bcryptjs";
import { hasher } from "../utils/hasher.js";

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

      //Sending response
      res.status(200).json({
        status: "success",
        message: "account created successfully",
        user: user,
      });
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
