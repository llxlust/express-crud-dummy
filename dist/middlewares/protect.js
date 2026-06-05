"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = AuthGuard;
const error_response_1 = require("../utils/error-response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function AuthGuard(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return next(new error_response_1.ErrorResponse("Unauthorize Request", 401, {
                    AUTH: "TOKEN_MISSING",
                }));
            }
            const decode_payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (!decode_payload) {
                return next(new error_response_1.ErrorResponse("Unauthorize Request", 401, {
                    AUTH: "TOKEN_MISSING",
                }));
            }
            const user_id = decode_payload.user_id;
            if (!user_id) {
                return next(new error_response_1.ErrorResponse("Unauthorize Request", 401, {
                    AUTH: "USER_ID_MISSING",
                }));
            }
            req.user_id = user_id;
            next();
        }
        catch (error) {
            next(new error_response_1.ErrorResponse("Internal Erorr", 500));
        }
    });
}
