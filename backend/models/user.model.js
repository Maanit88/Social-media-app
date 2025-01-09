import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  bio: String,
  coverImg: String,

  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  profileImage: String,
  verificationToken: String,
  verificationTokenExpire: Date,

  passwordResetToken: String,
  passwordResetTokenExpire: Date,
});

const User = mongoose.model("User", userSchema);
export default User;
