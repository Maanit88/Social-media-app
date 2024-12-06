import express from "express";
import { configDotenv } from "dotenv";
import userRoutes from "./routes/userAuth.route.js";
import { connectDb } from "./utils/connectDb.js";

configDotenv({
  path: "./.env",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRoutes);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started!! at port", port);
  connectDb();
});
