import express from "express";
import { asyncHandler } from "../utils/async-handler";
import {
  GetMe,
  LoginController,
  RegisterController,
} from "../controllers/auth.controller";
import { AuthGuard } from "../middlewares/protect";
import {
  CreateTodoList,
  FinishTodoList,
  GetAllTodoList,
  UpdateTodoList,
} from "../controllers/todo-list.controller";

export const router = express.Router();

// Auth Router
router.get(`/auth/me`, AuthGuard, asyncHandler(GetMe));
router.post(`/auth/login`, asyncHandler(LoginController));
router.post(`/auth/register`, asyncHandler(RegisterController));

// Todo List Router

router.get(`/todo-list/get-all`, AuthGuard, asyncHandler(GetAllTodoList));
router.post(`/todo-list/create`, AuthGuard, asyncHandler(CreateTodoList));
router.patch(
  `/todo-list/finish/:list_id`,
  AuthGuard,
  asyncHandler(FinishTodoList),
);
router.patch(
  `/todo-list/update/:list_id`,
  AuthGuard,
  asyncHandler(UpdateTodoList),
);
