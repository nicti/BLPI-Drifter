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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CommandInterface_1 = __importDefault(require("./CommandInterface"));
var builders_1 = require("@discordjs/builders");
var Summary = /** @class */ (function (_super) {
    __extends(Summary, _super);
    function Summary() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Summary.prototype.registerCommand = function () {
        return new builders_1.SlashCommandBuilder()
            .setName('summary')
            .setDescription('Shows a summary of the current state of the Drifter WHs in the current channel');
    };
    Summary.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var regionalData, regions, regionKey, scanned, hasWh, whs, region, systemName, system, headline, str, regionalDataKey, regionData, i, j, chunk, chunks, i_1, regStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jove.resetOutdated()];
                    case 1:
                        _a.sent();
                        regionalData = {};
                        return [4 /*yield*/, this.jove.getRegions()];
                    case 2:
                        regions = _a.sent();
                        for (regionKey in regions) {
                            if (regions.hasOwnProperty(regionKey)) {
                                scanned = 0;
                                hasWh = 0;
                                whs = [];
                                region = regions[regionKey];
                                for (systemName in region) {
                                    if (region.hasOwnProperty(systemName)) {
                                        system = region[systemName];
                                        if (system.updated !== '') {
                                            scanned++;
                                        }
                                        if (system.whs.length) {
                                            hasWh++;
                                            whs = __spreadArray(__spreadArray([], whs, true), system.whs, true);
                                        }
                                    }
                                }
                                regionalData[regionKey] = {
                                    scanned: scanned,
                                    hasWh: hasWh,
                                    total: Object.keys(region).length,
                                    whs: whs
                                };
                            }
                        }
                        headline = ('Region').toString().padEnd(20, ' ') + '|Total|Scanned|Has WH|WHs\n';
                        str = [];
                        for (regionalDataKey in regionalData) {
                            if (regionalData.hasOwnProperty(regionalDataKey)) {
                                regionData = regionalData[regionalDataKey];
                                str.push((regionalDataKey).toString().padEnd(20, ' ') + '|' + (regionData.total).toString().padStart(5, ' ') + '|' + (regionData.scanned).toString().padStart(7, ' ') + '|' + (regionData.hasWh).toString().padStart(6, ' ') + '|' + (regionData.whs.join(',')).toString() + '\n');
                            }
                        }
                        chunk = 30, chunks = [];
                        for (i = 0, j = str.length; i < j; i += chunk) {
                            chunks.push(str.slice(i, i + chunk));
                        }
                        return [4 /*yield*/, message.channel.send('**Summary**')];
                    case 3:
                        _a.sent();
                        i_1 = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i_1 < chunks.length)) return [3 /*break*/, 7];
                        regStr = chunks[i_1];
                        return [4 /*yield*/, message.channel.send('```' + headline + ('+'.padStart(20 + 1, '-') + '+'.padStart(5 + 1, '-') + '+'.padStart(7 + 1, '-') + '+'.padStart(6 + 1, '-') + ''.padStart(10, '-') + '\n') + regStr.join('') + '```')];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i_1++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Summary.prototype.help = function () {
        return { name: '`summary`', value: 'Provides a summary of known data.' };
    };
    Summary.prototype.getAccessLevel = function () {
        return 0;
    };
    Summary.prototype.executeInteraction = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var regionalData, regions, regionKey, scanned, hasWh, whs, region, systemName, system, headline_1, str, regionalDataKey, regionData, i, j, chunk, chunks_1, channelMgr;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!interaction.isCommand()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.jove.resetOutdated()];
                    case 1:
                        _a.sent();
                        regionalData = {};
                        return [4 /*yield*/, this.jove.getRegions()];
                    case 2:
                        regions = _a.sent();
                        for (regionKey in regions) {
                            if (regions.hasOwnProperty(regionKey)) {
                                scanned = 0;
                                hasWh = 0;
                                whs = [];
                                region = regions[regionKey];
                                for (systemName in region) {
                                    if (region.hasOwnProperty(systemName)) {
                                        system = region[systemName];
                                        if (system.updated !== '') {
                                            scanned++;
                                        }
                                        if (system.whs.length) {
                                            hasWh++;
                                            whs = __spreadArray(__spreadArray([], whs, true), system.whs, true);
                                        }
                                    }
                                }
                                regionalData[regionKey] = {
                                    scanned: scanned,
                                    hasWh: hasWh,
                                    total: Object.keys(region).length,
                                    whs: whs
                                };
                            }
                        }
                        headline_1 = ('Region').toString().padEnd(20, ' ') + '|Total|Scanned|Has WH|WHs\n';
                        str = [];
                        for (regionalDataKey in regionalData) {
                            if (regionalData.hasOwnProperty(regionalDataKey)) {
                                regionData = regionalData[regionalDataKey];
                                str.push((regionalDataKey).toString().padEnd(20, ' ') + '|' + (regionData.total).toString().padStart(5, ' ') + '|' + (regionData.scanned).toString().padStart(7, ' ') + '|' + (regionData.hasWh).toString().padStart(6, ' ') + '|' + (regionData.whs.join(',')).toString() + '\n');
                            }
                        }
                        i = void 0, j = void 0, chunk = 30, chunks_1 = [];
                        for (i = 0, j = str.length; i < j; i += chunk) {
                            chunks_1.push(str.slice(i, i + chunk));
                        }
                        channelMgr = interaction.client.channels;
                        return [4 /*yield*/, interaction.reply({ content: 'Sending summary to channel...', ephemeral: true })];
                    case 3:
                        _a.sent();
                        channelMgr.fetch(interaction.channelId).then(function (channel) { return __awaiter(_this, void 0, void 0, function () {
                            var i_2, regStr, e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 6, , 9]);
                                        return [4 /*yield*/, channel.send('**Summary**')];
                                    case 1:
                                        _a.sent();
                                        i_2 = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(i_2 < chunks_1.length)) return [3 /*break*/, 5];
                                        regStr = chunks_1[i_2];
                                        return [4 /*yield*/, channel.send('```' + headline_1 + ('+'.padStart(20 + 1, '-') + '+'.padStart(5 + 1, '-') + '+'.padStart(7 + 1, '-') + '+'.padStart(6 + 1, '-') + ''.padStart(10, '-') + '\n') + regStr.join('') + '```')];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        i_2++;
                                        return [3 /*break*/, 2];
                                    case 5: return [3 /*break*/, 9];
                                    case 6:
                                        e_1 = _a.sent();
                                        if (!(e_1.message === 'Missing Access')) return [3 /*break*/, 8];
                                        return [4 /*yield*/, interaction.reply({ content: 'I need the `SEND_MESSAGES` permission in this channel to do that!', ephemeral: true })];
                                    case 7:
                                        _a.sent();
                                        _a.label = 8;
                                    case 8: return [3 /*break*/, 9];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Summary;
}(CommandInterface_1.default));
exports.default = Summary;
