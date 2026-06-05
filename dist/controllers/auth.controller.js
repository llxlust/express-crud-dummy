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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterController = RegisterController;
exports.LoginController = LoginController;
exports.GetMe = GetMe;
const error_response_1 = require("../utils/error-response");
const server_1 = require("../server");
const uuid_1 = require("uuid");
const generate_token_1 = require("../utils/generate-token");
function RegisterController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return next(new error_response_1.ErrorResponse("Bad Request", 400));
        }
        const user_id = (0, uuid_1.v4)();
        const [results, fields] = yield server_1.pool.execute("INSERT INTO `users` (user_id,email,password,username) VALUES (?,?,?,?)", [user_id, email, password, username]);
        const payload = {
            user_id: user_id,
        };
        const encode = (0, generate_token_1.generateToken)(payload);
        const userResponse = {
            token: encode,
            user: {
                email,
                username,
            },
        };
        res.status(201).json({
            data: userResponse,
            success: true,
            timestamp: Date.now(),
        });
    });
}
function LoginController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            return next(new error_response_1.ErrorResponse("Bad Request", 400));
        }
        const [results, fields] = yield server_1.pool.execute("SELECT * from `users` where username = ? ", [username]);
        const userData = results[0];
        if (!userData || userData.password !== password || !userData.user_id) {
            return next(new error_response_1.ErrorResponse("Invalid Credentials", 401));
        }
        const userId = Buffer.from(userData.user_id)
            .toString("utf-8")
            .replace(/\0/g, "");
        const payload = {
            user_id: userId,
        };
        const token = (0, generate_token_1.generateToken)(payload);
        const userResponse = {
            token,
            user: {
                email: userData.email,
                username: userData.username,
            },
        };
        res.status(201).json({
            data: userResponse,
            success: true,
            timestamp: Date.now(),
        });
    });
}
function GetMe(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.user_id;
        if (!user_id) {
            return next(new error_response_1.ErrorResponse("Unauthorize Request", 401, {
                AUTH: "USER_ID_MISSING",
            }));
        }
        const [rows] = yield server_1.pool.execute("SELECT * FROM `users` WHERE TRIM(TRAILING '\0' FROM CAST(user_id AS CHAR)) = ?", [user_id]);
        const userData = rows[0];
        if (!userData) {
            return next(new error_response_1.ErrorResponse("Invalid Credentials", 401, {
                AUTH: "USER_NOT_FOUND",
            }));
        }
        const userResponse = {
            user: {
                email: userData.email,
                username: userData.username,
            },
        };
        res.status(201).json({
            data: userResponse,
            success: true,
            timestamp: Date.now(),
        });
    });
}
