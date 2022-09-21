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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var Show_1 = __importDefault(require("./Commands/Show"));
var Set_1 = __importDefault(require("./Commands/Set"));
var Find_1 = __importDefault(require("./Commands/Find"));
var LoadDataFromGoogle_1 = __importDefault(require("./Commands/LoadDataFromGoogle"));
var Closest_1 = __importDefault(require("./Commands/Closest"));
var Health_1 = __importDefault(require("./Commands/Health"));
var Summary_1 = __importDefault(require("./Commands/Summary"));
var Reindex_1 = __importDefault(require("./Commands/Reindex"));
var JoveAdd_1 = __importDefault(require("./Commands/JoveAdd"));
var JoveRemove_1 = __importDefault(require("./Commands/JoveRemove"));
var PFLoad_1 = __importDefault(require("./Commands/PFLoad"));
var Changelog_1 = __importDefault(require("./Commands/Changelog"));
var Route_1 = __importDefault(require("./Commands/Route"));
var Commands = /** @class */ (function () {
    function Commands(client, esi, jove, fas, logger, pings) {
        var _a;
        this.client = client;
        this.esi = esi;
        this.jove = jove;
        this.fas = fas;
        this.logger = logger;
        this.pings = pings;
        this.commands = new Map();
        this.commands.set('show', (new Show_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('set', (new Set_1.default(this.esi, this.jove, this.logger, this.fas)));
        this.commands.set('find', (new Find_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('loaddatafromgoogle', (new LoadDataFromGoogle_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('closest', (new Closest_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('health', (new Health_1.default(this.esi, this.jove, this.logger, this.client, this.fas, this.pings)));
        this.commands.set('summary', (new Summary_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('reindex', (new Reindex_1.default(this.esi, this.jove, this.logger, this.fas)));
        this.commands.set('joveadd', (new JoveAdd_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('joveremove', (new JoveRemove_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('pfload', (new PFLoad_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('changelog', (new Changelog_1.default(this.esi, this.jove, this.logger)));
        this.commands.set('route', (new Route_1.default(this.esi, this.jove, this.logger)));
        var admins = (_a = process.env.ADMINS) === null || _a === void 0 ? void 0 : _a.split(',');
        if (typeof admins === "undefined") {
            throw "Unable to find admins in .env file. Please specify admins in your .env file.";
        }
        this.admins = admins;
    }
    Commands.prototype.processMessage = function (message) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var accessLevel, trimmedMessage, strippedName, role, splitData, command, executeObject;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        accessLevel = 0;
                        if (this.admins.includes(message.author.id)) {
                            accessLevel = 1;
                        }
                        trimmedMessage = message.content.replace(/\s+/g, ' ');
                        strippedName = trimmedMessage.replace('<@!' + ((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id) + '> ', '').replace('<@' + ((_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id) + '> ', '');
                        role = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(function (r) { var _a; return r.name === ((_a = message.client.user) === null || _a === void 0 ? void 0 : _a.username); });
                        if (typeof role !== "undefined") {
                            strippedName = strippedName.replace('<@&' + role.id + '> ', '');
                        }
                        splitData = strippedName.split(' ');
                        command = (_d = splitData.shift()) === null || _d === void 0 ? void 0 : _d.toString().toLowerCase();
                        if (!(typeof command !== "undefined")) return [3 /*break*/, 8];
                        executeObject = this.commands.get(command);
                        if (!(typeof executeObject !== "undefined")) return [3 /*break*/, 5];
                        if (!(accessLevel >= executeObject.getAccessLevel())) return [3 /*break*/, 2];
                        return [4 /*yield*/, executeObject.execute(message, splitData)];
                    case 1:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, message.reply('You do not have access to this command!')];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        this.logger.warn('Unknown command: ' + message.author.username + ': ' + message.content);
                        return [4 /*yield*/, this.help(message)];
                    case 6:
                        _e.sent();
                        _e.label = 7;
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        this.logger.warn('Unknown command: ' + message.author.username + ': ' + message.content);
                        return [4 /*yield*/, this.help(message)];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Commands.prototype.help = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var embed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        embed = new discord_js_1.MessageEmbed()
                            .setTitle('Commands');
                        this.commands.forEach(function (command) {
                            embed.addFields(command.help());
                        });
                        return [4 /*yield*/, message.reply({ embeds: [embed] })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Commands;
}());
exports.default = Commands;
