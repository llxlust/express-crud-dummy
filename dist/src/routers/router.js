"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const async_handler_1 = require("../utils/async-handler");
const auth_controller_1 = require("../controllers/auth.controller");
exports.router = express_1.default.Router();
exports.router.post(`/auth/register`, (0, async_handler_1.asyncHandler)(auth_controller_1.RegisterController));
