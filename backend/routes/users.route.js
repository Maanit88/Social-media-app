import express from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import {
  getUserProfile,
  followUnfollowProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:id", checkAuth, getUserProfile);
router.post("/follow/:id", checkAuth, followUnfollowProfile);

export default router;
