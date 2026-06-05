"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const async_handler_1 = require("../utils/async-handler");
const auth_controller_1 = require("../controllers/auth.controller");
const protect_1 = require("../middlewares/protect");
exports.router = express_1.default.Router();
// Auth Router
exports.router.get(`/auth/me`, protect_1.AuthGuard, (0, async_handler_1.asyncHandler)(auth_controller_1.GetMe));
exports.router.post(`/auth/login`, (0, async_handler_1.asyncHandler)(auth_controller_1.LoginController));
exports.router.post(`/auth/register`, (0, async_handler_1.asyncHandler)(auth_controller_1.RegisterController));
// Product Router
