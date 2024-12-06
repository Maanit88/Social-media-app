import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv({
  path: "./.env",
});

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to db");
  } catch (error) {
    console.log("Error establising connection with the database", error);
  }
};
