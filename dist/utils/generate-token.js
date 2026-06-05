"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const error_response_1 = require("./error-response");
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new error_response_1.ErrorResponse("Token Encoding Conflict", 409);
    }
    const token = jsonwebtoken_1.default.sign(payload, secret);
    return token;
};
exports.generateToken = generateToken;
