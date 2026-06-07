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
exports.CreateTodoList = CreateTodoList;
exports.GetAllTodoList = GetAllTodoList;
exports.FinishTodoList = FinishTodoList;
exports.UpdateTodoList = UpdateTodoList;
const server_1 = require("../server");
const uuid_1 = require("uuid");
const error_response_1 = require("../utils/error-response");
function CreateTodoList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { listName, expired_at } = req.body;
        if (!listName || !expired_at) {
            return next(new error_response_1.ErrorResponse("Bad Request", 400));
        }
        const user_id = req.user_id;
        yield server_1.pool.execute("INSERT INTO `todo_list` (list_name,list_id,expired_at,owner) VALUES (?,?,?,?)", [listName, (0, uuid_1.v4)(), new Date(expired_at).toISOString(), user_id]);
        res.status(201).json({
            data: "Successful create list",
            success: true,
            timestamp: Date.now(),
        });
    });
}
function GetAllTodoList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.user_id;
        const [result] = yield server_1.pool.execute("SELECT list_name,list_id,created_at,expired_at FROM todo_list WHERE owner = ? AND isActive = true", [user_id]);
        res.status(200).json({
            data: result,
            success: true,
            timestamp: Date.now(),
        });
    });
}
function FinishTodoList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.user_id;
        const { list_id } = req.params;
        if (!list_id) {
            return next(new error_response_1.ErrorResponse("Bad Request", 400, { PARAM: "TODO_LIST_ID_REQUIRED" }));
        }
        yield server_1.pool.execute("UPDATE todo_list SET isActive = false WHERE owner = ? AND list_id = ?", [user_id, list_id]);
        res.status(201).json({
            data: "Successful Finish Todo List",
            success: true,
            timestamp: Date.now(),
        });
    });
}
function UpdateTodoList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { newName, newExpired } = req.body;
        const { list_id } = req.params;
        const user_id = req.user_id;
        if (!newName && !newExpired) {
            return next(new error_response_1.ErrorResponse("Bad Request", 400, {
                PARAMS: "REQUIRED_AT_LEAST_ONE_PARAM",
            }));
        }
        let query = `UPDATE todo_list SET `;
        const payload = [];
        if (newName) {
            query = query + `list_name = ? `;
            payload.push(newName);
        }
        if (newExpired) {
            query = query + `expired_at = ? `;
            payload.push(new Date(newExpired).toISOString());
        }
        query = query + `WHERE list_id = ? AND owner = ?`;
        const toUpdate = [...payload, list_id, user_id];
        yield server_1.pool.execute(query, toUpdate);
        res.status(201).json({
            data: `Successful Update Todo List`,
            success: true,
            timestamp: Date.now(),
        });
    });
}
