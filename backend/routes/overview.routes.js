import express from "express";
import { getOverview } from "../controllers/overview.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getOverview);

export default router;
