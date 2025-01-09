import express from "express";
import { configDotenv } from "dotenv";
import userAuthRoutes from "./routes/userAuth.route.js";
import userRoutes from "./routes/users.route.js";
import { connectDb } from "./utils/connectDb.js";
import cookieParser from "cookie-parser";
import { checkAuth } from "./middlewares/checkAuth.js";

configDotenv({
  path: "./.env",
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userAuthRoutes);
app.use("/users", userRoutes);

app.get("/profile", checkAuth, (req, res) => {
  res.send(`Username: ${req.user.username}`);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started!! at port", port);
  connectDb();
});
