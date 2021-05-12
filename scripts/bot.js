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
var axios_1 = __importDefault(require("axios"));
var JoveStorage_1 = __importDefault(require("../Storage/JoveStorage"));
var dotenv_1 = require("dotenv");
dotenv_1.config();
var client = new discord_js_1.Client();
var esi = axios_1.default.create({
    baseURL: 'https://esi.evetech.net',
});
var joveStorage = new JoveStorage_1.default();
joveStorage.resetOutdated().then();
client.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var botClientId, fullCommand, command, _a, show, searchResults, region, regionName, joveRegionalInfo, str, link, key, systems, date, dateObj_1, set, system, whs, result, find, results, stableReturns, unstableReturns, dateObj, i, result_1, i, result_2, resultMessage, reactiveMsg_1, embed;
    var _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                botClientId = (_c = client.user) === null || _c === void 0 ? void 0 : _c.id;
                if (typeof botClientId === "undefined") {
                    console.error('Bot Client ID is not defined! The bot likely did not connect to discord correctly!');
                    return [2 /*return*/];
                }
                if (message.author.id === botClientId) {
                    return [2 /*return*/];
                }
                if (!(process.env.NODE_ENV === "production" && message.channel.type === 'dm')) return [3 /*break*/, 2];
                return [4 /*yield*/, message.channel.send('Please only contact me via registered channels!')];
            case 1:
                _e.sent();
                return [2 /*return*/];
            case 2:
                if (typeof process.env.ALLOWED_CHANNELS === "undefined") {
                    console.error('ALLOWED_CHANNELS has to be defined in .env!');
                    return [2 /*return*/];
                }
                if (process.env.NODE_ENV === "production" && !process.env.ALLOWED_CHANNELS.split(',').includes(message.channel.id)) {
                    return [2 /*return*/];
                }
                else if (process.env.NODE_ENV === "develop" && message.channel.type !== 'dm') {
                    return [2 /*return*/];
                }
                if (!message.content.startsWith('<@!' + botClientId + '>')) return [3 /*break*/, 36];
                fullCommand = message.content.replace('<@!' + botClientId + '> ', '');
                command = fullCommand.split(' ')[0];
                _a = command;
                switch (_a) {
                    case 'show': return [3 /*break*/, 3];
                    case 'set': return [3 /*break*/, 15];
                    case 'search': return [3 /*break*/, 23];
                    case 'find': return [3 /*break*/, 25];
                    case 'loadDataFromGoogle': return [3 /*break*/, 30];
                    case 'help': return [3 /*break*/, 34];
                }
                return [3 /*break*/, 34];
            case 3:
                show = fullCommand.replace('<@!' + botClientId + '> ', '').replace('show ', '');
                if (!(show.length < 3)) return [3 /*break*/, 5];
                return [4 /*yield*/, message.channel.send('Region name must be at least 3 characters long.')];
            case 4:
                _e.sent();
                return [3 /*break*/, 36];
            case 5: return [4 /*yield*/, esi.get('/v2/search/?categories=region&datasource=tranquility&language=en&strict=false&search=' + show)];
            case 6:
                searchResults = (_e.sent()).data.region;
                if (!(typeof searchResults === "undefined")) return [3 /*break*/, 8];
                return [4 /*yield*/, message.channel.send('Could not find region matching `' + show + '`.')];
            case 7:
                _e.sent();
                return [3 /*break*/, 36];
            case 8:
                if (!(searchResults.length > 1)) return [3 /*break*/, 10];
                return [4 /*yield*/, message.channel.send('Search resulted in several hits, please specify.')];
            case 9:
                _e.sent();
                return [3 /*break*/, 36];
            case 10: return [4 /*yield*/, esi.get('/v1/universe/regions/' + searchResults[0] + '/')];
            case 11:
                region = (_e.sent()).data;
                regionName = region.name.replace(/ /g, '_');
                return [4 /*yield*/, joveStorage.resetOutdated()];
            case 12:
                _e.sent();
                return [4 /*yield*/, joveStorage.getForRegion(regionName)];
            case 13:
                joveRegionalInfo = _e.sent();
                str = '';
                link = [];
                for (key in joveRegionalInfo) {
                    if (joveRegionalInfo.hasOwnProperty(key)) {
                        link.push(key);
                        systems = '';
                        systems = joveRegionalInfo[key].whs.join(',');
                        if (systems === '')
                            systems = '-';
                        date = void 0;
                        if (joveRegionalInfo[key].updated === '') {
                            date = '';
                        }
                        else {
                            dateObj_1 = new Date(joveRegionalInfo[key].updated);
                            date = dateObj_1.getUTCFullYear().toString() + '-' + (dateObj_1.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj_1.getUTCDate()).toString().padStart(2, '0') +
                                ' ' + dateObj_1.getUTCHours().toString().padStart(2, '0') + ':' + dateObj_1.getUTCMinutes().toString().padStart(2, '0') + ' UTC';
                        }
                        str += key + ': ' + systems + ' [' + date + ']\n';
                    }
                }
                return [4 /*yield*/, message.channel.send(region.name + ':```' + str + '```https://evemaps.dotlan.net/map/' + regionName + '/' + link.join(':'))];
            case 14:
                _e.sent();
                return [3 /*break*/, 36];
            case 15:
                set = fullCommand.replace('<@!' + botClientId + '> ', '').replace('set ', '');
                if (!(((_d = set.match(/ /g)) === null || _d === void 0 ? void 0 : _d.length) != 1)) return [3 /*break*/, 17];
                return [4 /*yield*/, message.channel.send('Your message did not follow the pattern. Usage: `@BLPI Drifter set <system> <pipe split drifter letters>`')];
            case 16:
                _e.sent();
                return [3 /*break*/, 36];
            case 17:
                system = void 0, whs = void 0;
                _b = set.split(' '), system = _b[0], whs = _b[1];
                return [4 /*yield*/, joveStorage.setWHs(system, whs.split('|'))];
            case 18:
                result = _e.sent();
                if (!(result === true)) return [3 /*break*/, 20];
                return [4 /*yield*/, message.react('✅')];
            case 19:
                _e.sent();
                return [3 /*break*/, 22];
            case 20:
                if (!(typeof result === 'string')) return [3 /*break*/, 22];
                return [4 /*yield*/, message.reply(result)];
            case 21:
                _e.sent();
                _e.label = 22;
            case 22: return [3 /*break*/, 36];
            case 23: return [4 /*yield*/, message.channel.send('To be implemented')];
            case 24:
                _e.sent();
                return [3 /*break*/, 36];
            case 25:
                find = fullCommand.replace('<@!' + botClientId + '> ', '').replace('find ', '').toUpperCase();
                if (!!JoveStorage_1.default.WHS.includes(find)) return [3 /*break*/, 27];
                return [4 /*yield*/, message.reply('Insert correct wh type please: B,C,V,S,R')];
            case 26:
                _e.sent();
                return [2 /*return*/];
            case 27: return [4 /*yield*/, joveStorage.findByType(find)];
            case 28:
                results = _e.sent();
                stableReturns = [];
                unstableReturns = [];
                dateObj = void 0;
                for (i = 0; i < results.stable.length; i++) {
                    result_1 = results.stable[i];
                    dateObj = new Date(result_1.updated);
                    stableReturns.push(result_1.system + " - " + result_1.region + " [" + dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                        ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC' + "]");
                }
                for (i = 0; i < results.unstable.length; i++) {
                    result_2 = results.unstable[i];
                    dateObj = new Date(result_2.updated);
                    unstableReturns.push(result_2.system + " - " + result_2.region + " [" + dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
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
                    resultMessage += '```Unstable ' + find + ' WHs:```' + unstableReturns.join("\n") + '```';
                }
                return [4 /*yield*/, message.channel.send(resultMessage)];
            case 29:
                _e.sent();
                return [3 /*break*/, 36];
            case 30: return [4 /*yield*/, message.reply('Are you sure you want to reload all the data? This will delete saved data!')];
            case 31:
                reactiveMsg_1 = _e.sent();
                return [4 /*yield*/, reactiveMsg_1.react('✅')];
            case 32:
                _e.sent();
                return [4 /*yield*/, reactiveMsg_1.react('❎')];
            case 33:
                _e.sent();
                reactiveMsg_1.awaitReactions(function (reaction, user) { return user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❎'); }, { max: 1, time: 30000 }).then(function (collected) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(((_a = collected.first()) === null || _a === void 0 ? void 0 : _a.emoji.name) == '✅')) return [3 /*break*/, 4];
                                return [4 /*yield*/, reactiveMsg_1.reactions.removeAll()];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, joveStorage.importFromGoogle()];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, reactiveMsg_1.edit('~~' + (reactiveMsg_1.content) + '~~\n**Done!**')];
                            case 3:
                                _c.sent();
                                return [3 /*break*/, 7];
                            case 4:
                                if (!(((_b = collected.first()) === null || _b === void 0 ? void 0 : _b.emoji.name) == '❎')) return [3 /*break*/, 7];
                                return [4 /*yield*/, reactiveMsg_1.edit('~~' + (reactiveMsg_1.content) + '~~\n**Aborted!**')];
                            case 5:
                                _c.sent();
                                return [4 /*yield*/, reactiveMsg_1.reactions.removeAll()];
                            case 6:
                                _c.sent();
                                _c.label = 7;
                            case 7: return [2 /*return*/];
                        }
                    });
                }); }).catch(function (error) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, reactiveMsg_1.edit('~~' + (reactiveMsg_1.content) + '~~\n**Error:**```' + error.toString() + '```')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 36];
            case 34:
                embed = new discord_js_1.MessageEmbed()
                    .setTitle('Commands')
                    .addFields({ name: 'show <region>', value: 'Shows drifter info for a certain region.' }, { name: 'set <system> <pipe split drifter identifier>', value: 'Sets drifter info for a certain system. Use letter for WH identifier. Concat - for EOL/crit. E.g.: `C|C-`' }, { name: 'loadDataFromGoogle', value: 'Reloads jove system list from public spreadsheet.' });
                return [4 /*yield*/, message.channel.send(embed)];
            case 35:
                _e.sent();
                return [3 /*break*/, 36];
            case 36: return [2 /*return*/];
        }
    });
}); });
client.login(process.env.BOT_TOKEN).then().catch(console.error);
