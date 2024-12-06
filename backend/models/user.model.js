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

  profileImage: String,
  verificationToken: String,
  verificationTokenExpire: Date,

  passwordResetToken: String,
  passwordResetTokenExpire: Date,
});

const User = mongoose.model("User", userSchema);
export default User;
