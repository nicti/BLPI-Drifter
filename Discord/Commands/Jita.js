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
var Jita = /** @class */ (function (_super) {
    __extends(Jita, _super);
    function Jita() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Jita.prototype.help = function () {
        return {
            name: '`jita <region>`',
            value: 'Finds a route between a region and Jita (The Forge, Lonetrek, The Citadel)'
        };
    };
    Jita.prototype.getAccessLevel = function () {
        return 0;
    };
    Jita.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var region, joves, e_1, loc1, loc2, _loop_1, key, _loop_2, this_1, _i, _a, key, pairs, pad1, pad2, pad, response, parts;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data.forEach(function (e, i) { return data[i] = _this.capitalizeFirstLetter(e.toLowerCase()); });
                        region = data.join('_');
                        return [4 /*yield*/, this.jove.resetOutdated(region)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, this.jove.getForRegion(region)];
                    case 3:
                        joves = _b.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _b.sent();
                        return [4 /*yield*/, message.reply("Failed to load data for region `".concat(region, "`"))];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                    case 6:
                        loc1 = [];
                        loc2 = [];
                        _loop_1 = function (key) {
                            joves[key].whs.forEach(function (e) {
                                loc2.push({
                                    updated: joves[key].updated,
                                    name: key,
                                    wh: e.replace('-', ''),
                                    crit: e.includes('-')
                                });
                            });
                        };
                        for (key in joves) {
                            _loop_1(key);
                        }
                        _loop_2 = function (key) {
                            var joves_1, _loop_3, key_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, this_1.jove.getForRegion(key)];
                                    case 1:
                                        joves_1 = _c.sent();
                                        _loop_3 = function (key_1) {
                                            joves_1[key_1].whs.forEach(function (e) {
                                                loc1.push({
                                                    updated: joves_1[key_1].updated,
                                                    name: key_1,
                                                    wh: e.replace('-', ''),
                                                    crit: e.includes('-')
                                                });
                                            });
                                        };
                                        for (key_1 in joves_1) {
                                            _loop_3(key_1);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = ['The_Forge', 'Lonetrek', 'The_Citadel'];
                        _b.label = 7;
                    case 7:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        key = _a[_i];
                        return [5 /*yield**/, _loop_2(key)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10:
                        pairs = [];
                        loc1.forEach(function (e) {
                            var matches = loc2.filter(function (f) { return e.wh === f.wh; });
                            matches.forEach(function (f) {
                                pairs.push({
                                    one_updated: e.updated,
                                    one_name: e.name,
                                    one_crit: e.crit,
                                    two_updated: f.updated,
                                    two_name: f.name,
                                    two_crit: f.crit,
                                    wh: e.wh
                                });
                            });
                        });
                        pad1 = Math.max.apply(Math, loc1.map(function (e) { return e.name.length; })) + 1;
                        pad2 = Math.max.apply(Math, loc2.map(function (e) { return e.name.length; })) + 1;
                        pad = Math.max(pad1, pad2, 4, region.length);
                        response = "```".concat('Jita'.padEnd(pad, ' '), " <=====> ").concat(region.padEnd(pad, ' '), "| Oldest\n").concat(''.padEnd(((pad * 2) + 9), '='), "+").concat(''.padEnd(20, '='), "\n");
                        parts = [];
                        if (!(pairs.length === 0)) return [3 /*break*/, 12];
                        return [4 /*yield*/, message.reply('No WH pairs found!')];
                    case 11:
                        _b.sent();
                        return [2 /*return*/];
                    case 12:
                        pairs.forEach(function (e) {
                            var dateObj;
                            if (e.one_updated > e.two_updated) {
                                dateObj = new Date(e.two_updated);
                            }
                            else {
                                dateObj = new Date(e.one_updated);
                            }
                            var date = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                                ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC';
                            var one_crit = e.one_crit ? '-' : ' ';
                            var two_crit = e.two_crit ? '-' : ' ';
                            parts.push("".concat(e.one_name.padEnd(pad, ' '), " <=").concat(one_crit).concat(e.wh).concat(two_crit, "=> ").concat(e.two_name.padEnd(pad, ' '), "|").concat(date));
                        });
                        response += parts.join('\n');
                        response += '```';
                        return [4 /*yield*/, message.reply(response)];
                    case 13:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Jita.prototype.capitalizeFirstLetter = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return Jita;
}(CommandInterface_1.default));
exports.default = Jita;
