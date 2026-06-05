"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrroHandler = void 0;
const ErrroHandler = (err, req, res, next) => {
    const errMsg = err.message || "Internal Error";
    const errStatus = err.status || 500;
    const errField = err.source || "Database";
    res.status(errStatus).json({
        error: { message: errMsg, field: errField },
        success: false,
        timestamp: Date.now(),
    });
};
exports.ErrroHandler = ErrroHandler;
