import express from "express";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
  googleAuth,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  googleAuthSchema,
  validate,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/google", validate(googleAuthSchema), googleAuth);

router.get("/me", protect, getMe);

router.post("/refresh", validate(refreshTokenSchema), refresh);

router.post("/logout", protect, validate(logoutSchema), logout);

export default router;
