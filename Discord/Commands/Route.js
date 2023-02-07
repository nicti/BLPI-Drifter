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
var builders_1 = require("@discordjs/builders");
var Route = /** @class */ (function (_super) {
    __extends(Route, _super);
    function Route(esi, jove, logger, fas) {
        var _this = _super.call(this, esi, jove, logger) || this;
        _this.fas = fas;
        return _this;
    }
    Route.prototype.registerCommand = function () {
        return new builders_1.SlashCommandBuilder()
            .setName('route')
            .setDescription('Finds a route between two regions')
            .addStringOption(function (option) {
            return option.setName('region1')
                .setDescription('First region name')
                .setRequired(true)
                .setAutocomplete(true);
        })
            .addStringOption(function (option) {
            return option.setName('region2')
                .setDescription('Second region name')
                .setRequired(true)
                .setAutocomplete(true);
        });
    };
    Route.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var regions, loc1, loc2, doneFirst, _loop_1, this_1, _i, regions_1, e, state_1, pairs, pad1, pad2, pad, response, parts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        regions = data.join(' ').split('|');
                        if (!(regions.length !== 2)) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.reply('Insufficient region information')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        loc1 = [];
                        loc2 = [];
                        doneFirst = false;
                        _loop_1 = function (e) {
                            var parts_1, region, joves_1, _loop_2, key, e_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        parts_1 = e.split(' ');
                                        parts_1.forEach(function (e, i) { return parts_1[i] = _this.capitalizeFirstLetter(e.toLowerCase()); });
                                        region = parts_1.join('_');
                                        return [4 /*yield*/, this_1.jove.resetOutdated(region)];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2:
                                        _b.trys.push([2, 4, , 6]);
                                        return [4 /*yield*/, this_1.jove.getForRegion(region)];
                                    case 3:
                                        joves_1 = _b.sent();
                                        _loop_2 = function (key) {
                                            joves_1[key].whs.forEach(function (e) {
                                                if (!doneFirst) {
                                                    loc1.push({
                                                        updated: joves_1[key].updated,
                                                        name: key,
                                                        wh: e.replace('-', ''),
                                                        crit: e.includes('-')
                                                    });
                                                }
                                                else {
                                                    loc2.push({
                                                        updated: joves_1[key].updated,
                                                        name: key,
                                                        wh: e.replace('-', ''),
                                                        crit: e.includes('-')
                                                    });
                                                }
                                            });
                                        };
                                        for (key in joves_1) {
                                            _loop_2(key);
                                        }
                                        return [3 /*break*/, 6];
                                    case 4:
                                        e_1 = _b.sent();
                                        return [4 /*yield*/, message.reply("Failed to load data for region `".concat(region, "`"))];
                                    case 5:
                                        _b.sent();
                                        return [2 /*return*/, { value: void 0 }];
                                    case 6:
                                        doneFirst = true;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, regions_1 = regions;
                        _a.label = 3;
                    case 3:
                        if (!(_i < regions_1.length)) return [3 /*break*/, 6];
                        e = regions_1[_i];
                        return [5 /*yield**/, _loop_1(e)];
                    case 4:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
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
                        pad = Math.max(pad1, pad2, regions[0].length, regions[1].length);
                        response = "```".concat(regions[0].padEnd(pad, ' '), " <=====> ").concat(regions[1].padEnd(pad, ' '), "| Oldest\n").concat(''.padEnd(((pad * 2) + 9), '='), "+").concat(''.padEnd(20, '='), "\n");
                        parts = [];
                        if (!(pairs.length === 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, message.reply('No WH pairs found!')];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                    case 8:
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
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Route.prototype.getAccessLevel = function () {
        return 0;
    };
    Route.prototype.help = function () {
        return { name: '`route <region>|<region>`', value: 'Shows matching WH pairs between 2 regions' };
    };
    Route.prototype.capitalizeFirstLetter = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    Route.prototype.executeInteraction = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var focus_1, filtered, filtered, region1, region2, regions, loc1_1, loc2_1, doneFirst_1, _loop_3, this_2, _i, regions_2, e, state_2, pairs_1, pad1, pad2, pad_1, response, parts_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!interaction.isAutocomplete()) return [3 /*break*/, 1];
                        focus_1 = interaction.options.getFocused(true);
                        if (focus_1.name === 'region1') {
                            filtered = this.fas.getRegions().filter(function (e) { return e.toLowerCase().startsWith(focus_1.value.toLowerCase()); }).slice(0, 25);
                            interaction.respond(filtered.map(function (choices) { return ({ name: choices, value: choices }); }));
                        }
                        else if (focus_1.name === 'region2') {
                            filtered = this.fas.getRegions().filter(function (e) { return e.toLowerCase().startsWith(focus_1.value.toLowerCase()); }).slice(0, 25);
                            interaction.respond(filtered.map(function (choices) { return ({ name: choices, value: choices }); }));
                        }
                        return [3 /*break*/, 11];
                    case 1:
                        if (!interaction.isCommand()) return [3 /*break*/, 11];
                        region1 = interaction.options.getString('region1');
                        region2 = interaction.options.getString('region2');
                        regions = [region1, region2];
                        if (!(regions.length !== 2)) return [3 /*break*/, 3];
                        return [4 /*yield*/, interaction.reply({ content: 'Insufficient region information', ephemeral: true })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        loc1_1 = [];
                        loc2_1 = [];
                        doneFirst_1 = false;
                        _loop_3 = function (e) {
                            var parts_3, region, joves_2, _loop_4, key, e_2;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        parts_3 = e.split(' ');
                                        parts_3.forEach(function (e, i) { return parts_3[i] = _this.capitalizeFirstLetter(e.toLowerCase()); });
                                        region = parts_3.join('_');
                                        return [4 /*yield*/, this_2.jove.resetOutdated(region)];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2:
                                        _b.trys.push([2, 4, , 6]);
                                        return [4 /*yield*/, this_2.jove.getForRegion(region)];
                                    case 3:
                                        joves_2 = _b.sent();
                                        _loop_4 = function (key) {
                                            joves_2[key].whs.forEach(function (e) {
                                                if (!doneFirst_1) {
                                                    loc1_1.push({
                                                        updated: joves_2[key].updated,
                                                        name: key,
                                                        wh: e.replace('-', ''),
                                                        crit: e.includes('-')
                                                    });
                                                }
                                                else {
                                                    loc2_1.push({
                                                        updated: joves_2[key].updated,
                                                        name: key,
                                                        wh: e.replace('-', ''),
                                                        crit: e.includes('-')
                                                    });
                                                }
                                            });
                                        };
                                        for (key in joves_2) {
                                            _loop_4(key);
                                        }
                                        return [3 /*break*/, 6];
                                    case 4:
                                        e_2 = _b.sent();
                                        return [4 /*yield*/, interaction.reply({
                                                content: "Failed to load data for region `".concat(region, "`"),
                                                ephemeral: true
                                            })];
                                    case 5:
                                        _b.sent();
                                        return [2 /*return*/, { value: void 0 }];
                                    case 6:
                                        doneFirst_1 = true;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, regions_2 = regions;
                        _a.label = 4;
                    case 4:
                        if (!(_i < regions_2.length)) return [3 /*break*/, 7];
                        e = regions_2[_i];
                        return [5 /*yield**/, _loop_3(e)];
                    case 5:
                        state_2 = _a.sent();
                        if (typeof state_2 === "object")
                            return [2 /*return*/, state_2.value];
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        pairs_1 = [];
                        loc1_1.forEach(function (e) {
                            var matches = loc2_1.filter(function (f) { return e.wh === f.wh; });
                            matches.forEach(function (f) {
                                pairs_1.push({
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
                        pad1 = Math.max.apply(Math, loc1_1.map(function (e) { return e.name.length; })) + 1;
                        pad2 = Math.max.apply(Math, loc2_1.map(function (e) { return e.name.length; })) + 1;
                        pad_1 = Math.max(pad1, pad2, regions[0].length, regions[1].length);
                        response = "```".concat(regions[0].padEnd(pad_1, ' '), " <=====> ").concat(regions[1].padEnd(pad_1, ' '), "| Oldest\n").concat(''.padEnd(((pad_1 * 2) + 9), '='), "+").concat(''.padEnd(20, '='), "\n");
                        parts_2 = [];
                        if (!(pairs_1.length === 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, interaction.reply({ content: 'No WH pairs found!', ephemeral: true })];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                    case 9:
                        pairs_1.forEach(function (e) {
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
                            parts_2.push("".concat(e.one_name.padEnd(pad_1, ' '), " <=").concat(one_crit).concat(e.wh).concat(two_crit, "=> ").concat(e.two_name.padEnd(pad_1, ' '), "|").concat(date));
                        });
                        response += parts_2.join('\n');
                        response += '```';
                        return [4 /*yield*/, interaction.reply({ content: response, ephemeral: true })];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return Route;
}(CommandInterface_1.default));
exports.default = Route;
