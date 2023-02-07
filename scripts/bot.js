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
var dotenv_flow_1 = require("dotenv-flow");
var Commands_1 = __importDefault(require("../Discord/Commands"));
var Pings_1 = __importDefault(require("../Bot/Pings"));
var FAS_1 = __importDefault(require("../Storage/FAS"));
var AdvancedLogger_1 = __importDefault(require("../utils/AdvancedLogger"));
(0, dotenv_flow_1.config)();
var logger = new AdvancedLogger_1.default();
var esi = axios_1.default.create({
    baseURL: 'https://esi.evetech.net',
});
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
    ],
    partials: [
        'CHANNEL',
        'MESSAGE',
        'REACTION'
    ]
});
var joveStorage = new JoveStorage_1.default(esi, logger);
var fas = new FAS_1.default(joveStorage);
var pings = new Pings_1.default(logger);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, joveStorage.resetOutdated()];
            case 1:
                _a.sent();
                return [4 /*yield*/, fas.reindex()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
var commandHandler = new Commands_1.default(client, esi, joveStorage, fas, logger, pings);
client.once('ready', function () {
    setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, esiHealth, dateObj, dateString, fasCount, name, a;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, pings.statusAll(client)];
                case 1:
                    data = _c.sent();
                    esiHealth = Math.round(((data.esiHealth.green / data.esiHealth.total) * 100)) + '%';
                    dateObj = new Date();
                    dateString = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                        ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + dateObj.getUTCSeconds().toString().padStart(2, '0') + ' UTC';
                    fasCount = fas.getLength();
                    name = "ESI Ping: ".concat(data.esiPing, " | ESI Health: ").concat(esiHealth, " | Discord Ping: ").concat(data.discordPing, "ms | Discord Health: ").concat(data.discordHealth, " | Index: ").concat(fasCount, " entries | Updated: ").concat(dateString);
                    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity({
                        type: 'WATCHING',
                        name: name
                    });
                    (_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({
                        activities: [
                            {
                                type: 'WATCHING',
                                name: name
                            }
                        ]
                    });
                    a = 'b';
                    return [2 /*return*/];
            }
        });
    }); }, 1000 * 60);
});
client.on('messageCreate', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var botClientId, role;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                botClientId = (_a = client.user) === null || _a === void 0 ? void 0 : _a.id;
                if (message.author.id !== botClientId && message.channel.type !== "DM" && process.env.LOGGING === "true") {
                    logger.logChat("[".concat(message.channel.guild.name, ":").concat(message.channel.guild.id, "][").concat(message.channel.name, ":").concat(message.channel.id, "][").concat(message.author.username, ":").concat(message.author.id, ":").concat((_b = message.member) === null || _b === void 0 ? void 0 : _b.nickname, "]: ").concat(message.content));
                }
                if (typeof botClientId === "undefined") {
                    logger.error('Bot Client ID is not defined! The bot likely did not connect to discord correctly!');
                    return [2 /*return*/];
                }
                if (message.author.id === botClientId) {
                    return [2 /*return*/];
                }
                if (!(process.env.NODE_ENV === "production" && message.channel.type === 'DM')) return [3 /*break*/, 2];
                return [4 /*yield*/, message.channel.send('Please only contact me via registered channels!')];
            case 1:
                _d.sent();
                return [2 /*return*/];
            case 2:
                if (typeof process.env.ALLOWED_CHANNELS === "undefined") {
                    logger.error('ALLOWED_CHANNELS has to be defined in .env!');
                    return [2 /*return*/];
                }
                if (process.env.NODE_ENV === "production" && !process.env.ALLOWED_CHANNELS.split(',').includes(message.channel.id)) {
                    return [2 /*return*/];
                }
                else if (process.env.NODE_ENV === "develop" && message.channel.type !== 'DM') {
                    return [2 /*return*/];
                }
                role = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(function (r) { var _a; return r.name === ((_a = client.user) === null || _a === void 0 ? void 0 : _a.username); });
                if (message.content.startsWith('<@!' + botClientId + '>') ||
                    message.content.startsWith('<@' + botClientId + '>') ||
                    (typeof role !== 'undefined' && message.content.startsWith('<@&' + role.id + '>'))) {
                    return [2 /*return*/, commandHandler.processMessage(message)];
                }
                return [2 /*return*/];
        }
    });
}); });
client.on('interactionCreate', function (interaction) {
    if (typeof process.env.ALLOWED_CHANNELS === "undefined") {
        logger.error('ALLOWED_CHANNELS has to be defined in .env!');
        return;
    }
    var channelId = interaction.channelId;
    if (channelId === null) {
        logger.info('Interaction was not in a channel! (DM?)');
        return;
    }
    if (!process.env.ALLOWED_CHANNELS.split(',').includes(channelId)) {
        return;
    }
    commandHandler.processInteraction(interaction);
});
client.login(process.env.BOT_TOKEN).catch(logger.error);
