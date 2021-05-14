"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CommandInterface_1 = __importDefault(require("./CommandInterface"));
var JoveStorage_1 = __importDefault(require("../../Storage/JoveStorage"));
var Find = /** @class */ (function (_super) {
    __extends(Find, _super);
    function Find() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Find.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var find, results, stableReturns, unstableReturns, dateObj, i, result, i, result, resultMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        find = data[0];
                        if (!!JoveStorage_1.default.WHS.includes(find)) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.reply('Insert correct wh type please: B,C,V,S,R')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.jove.resetOutdated()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.jove.findByType(find)];
                    case 4:
                        results = _a.sent();
                        stableReturns = [];
                        unstableReturns = [];
                        for (i = 0; i < results.stable.length; i++) {
                            result = results.stable[i];
                            dateObj = new Date(result.updated);
                            stableReturns.push(result.system + " - " + result.region + " [" + dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                                ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC' + "]");
                        }
                        for (i = 0; i < results.unstable.length; i++) {
                            result = results.unstable[i];
                            dateObj = new Date(result.updated);
                            unstableReturns.push(result.system + " - " + result.region + " [" + dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                                ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC' + "]");
                        }
                        resultMessage = "";
                        if (stableReturns.length === 0 && unstableReturns.length === 0) {
                            resultMessage = "No " + find + " WHs found!";
                        }
                        if (stableReturns.length > 0) {
                            resultMessage += 'Stable ' + find + ' WHs:```' + stableReturns.join("\n") + '```';
                        }
                        if (unstableReturns.length > 0) {
                            resultMessage += 'Unstable ' + find + ' WHs:```' + unstableReturns.join("\n") + '```';
                        }
                        return [4 /*yield*/, message.channel.send(resultMessage)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Find.prototype.help = function () {
        return { name: "`find <WH identifier>`", value: "Finds al WHs of a certain type" };
    };
    return Find;
}(CommandInterface_1.default));
exports.default = Find;
