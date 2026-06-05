import express from "express";
import { asyncHandler } from "../utils/async-handler";
import {
  GetMe,
  LoginController,
  RegisterController,
} from "../controllers/auth.controller";
import { AuthGuard } from "../middlewares/protect";

export const router = express.Router();

// Auth Router
router.get(`/auth/me`, AuthGuard, asyncHandler(GetMe));
router.post(`/auth/login`, asyncHandler(LoginController));
router.post(`/auth/register`, asyncHandler(RegisterController));

// Product Router
