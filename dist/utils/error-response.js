"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(msg, code, fieldsErrors = {}) {
        super(msg);
        this.message = msg;
        this.status = code;
        this.source = fieldsErrors;
    }
}
exports.ErrorResponse = ErrorResponse;
