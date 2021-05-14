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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var CommandInterface = /** @class */ (function () {
    function CommandInterface(esi, jove) {
        this.esi = esi;
        this.jove = jove;
    }
    CommandInterface.prototype.provideYesNoPrompt = function (message, question) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var reactiveMsg, reaction, e_1, e_2, e_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, message.reply(question)];
                    case 1:
                        reactiveMsg = _c.sent();
                        return [4 /*yield*/, reactiveMsg.react('✅')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, reactiveMsg.react('❎')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, reactiveMsg.awaitReactions(function (reaction, user) { return user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❎'); }, { max: 1, time: 30000 })];
                    case 4:
                        reaction = _c.sent();
                        if (!(((_a = reaction.first()) === null || _a === void 0 ? void 0 : _a.emoji.name) === '✅')) return [3 /*break*/, 10];
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, reactiveMsg.reactions.removeAll()];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _c.sent();
                        if (e_1.code !== 50003) {
                            throw e_1;
                        }
                        return [3 /*break*/, 8];
                    case 8: return [4 /*yield*/, reactiveMsg.edit('~~' + reactiveMsg.content + '~~')];
                    case 9:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 10:
                        if (!(((_b = reaction.first()) === null || _b === void 0 ? void 0 : _b.emoji.name) === '❎')) return [3 /*break*/, 16];
                        _c.label = 11;
                    case 11:
                        _c.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, reactiveMsg.reactions.removeAll()];
                    case 12:
                        _c.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        e_2 = _c.sent();
                        if (e_2.code !== 50003) {
                            throw e_2;
                        }
                        return [3 /*break*/, 14];
                    case 14: return [4 /*yield*/, reactiveMsg.edit('~~' + reactiveMsg.content + '~~')];
                    case 15:
                        _c.sent();
                        return [2 /*return*/, false];
                    case 16:
                        _c.trys.push([16, 18, , 19]);
                        return [4 /*yield*/, reactiveMsg.reactions.removeAll()];
                    case 17:
                        _c.sent();
                        return [3 /*break*/, 19];
                    case 18:
                        e_3 = _c.sent();
                        if (e_3.code !== 50003) {
                            throw e_3;
                        }
                        return [3 /*break*/, 19];
                    case 19: return [4 /*yield*/, reactiveMsg.edit('~~' + reactiveMsg.content + '~~')];
                    case 20:
                        _c.sent();
                        return [2 /*return*/, false];
                }
            });
        });
    };
    return CommandInterface;
}());
exports.default = CommandInterface;
