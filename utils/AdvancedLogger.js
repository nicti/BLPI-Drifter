"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var simple_node_logger_1 = __importDefault(require("simple-node-logger"));
var AdvancedLogger = /** @class */ (function () {
    function AdvancedLogger() {
        this.chatLog = null;
        this.appLog = null;
        this.chatLog = simple_node_logger_1.default.createSimpleFileLogger('./logs/chat.log');
        this.appLog = simple_node_logger_1.default.createSimpleFileLogger('./logs/app.log');
    }
    AdvancedLogger.prototype.logChat = function (msg, level) {
        var _a;
        if (level === void 0) { level = 'info'; }
        (_a = this.chatLog) === null || _a === void 0 ? void 0 : _a.log(level, msg);
    };
    AdvancedLogger.prototype.logApp = function (level, msg) {
        var _a;
        (_a = this.appLog) === null || _a === void 0 ? void 0 : _a.log(level, msg);
    };
    AdvancedLogger.prototype.fatal = function (msg) {
        this.logApp('fatal', msg);
    };
    AdvancedLogger.prototype.error = function (msg) {
        this.logApp('error', msg);
    };
    AdvancedLogger.prototype.warn = function (msg) {
        this.logApp('warn', msg);
    };
    AdvancedLogger.prototype.info = function (msg) {
        this.logApp('info', msg);
    };
    AdvancedLogger.prototype.debug = function (msg) {
        this.logApp('debug', msg);
    };
    return AdvancedLogger;
}());
exports.default = AdvancedLogger;
