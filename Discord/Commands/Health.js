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
var discord_js_1 = require("discord.js");
var Pings_1 = __importDefault(require("../../Bot/Pings"));
var Health = /** @class */ (function (_super) {
    __extends(Health, _super);
    function Health(esi, jove, client) {
        var _this = _super.call(this, esi, jove) || this;
        _this.client = client;
        return _this;
    }
    Health.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var attachment, info, esiHealth, embeded, dateObj, dateString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attachment = new discord_js_1.MessageAttachment('assets/blpi.png', 'blpi.png');
                        return [4 /*yield*/, Pings_1.default.statusAll(this.client)];
                    case 1:
                        info = _a.sent();
                        esiHealth = Math.round(((info.esiHealth.green / info.esiHealth.total) * 100)) + '%';
                        embeded = new discord_js_1.MessageEmbed();
                        embeded.setTitle('Health Report');
                        embeded.addField('ESI Ping', info.esiPing, true);
                        embeded.addField('ESI Health', esiHealth, true);
                        embeded.addField('Discord Ping', info.discordPing + ' ms', true);
                        embeded.addField('Discord Health', info.discordHealth, true);
                        if (info.esiPing === "ok" && info.discordHealth === "GREEN") {
                            embeded.setColor('GREEN');
                        }
                        else if (info.esiPing !== "ok" && info.discordHealth !== "GREEN") {
                            embeded.setColor("RED");
                        }
                        else if (info.esiPing !== "ok" || info.discordHealth !== "GREEN") {
                            embeded.setColor("YELLOW");
                        }
                        embeded.attachFiles([attachment]);
                        embeded.setThumbnail('attachment://blpi.png');
                        dateObj = new Date();
                        dateString = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                            ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + dateObj.getUTCSeconds().toString().padStart(2, '0') + ' UTC';
                        embeded.setFooter(dateString);
                        return [4 /*yield*/, message.channel.send(embeded)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Health.prototype.help = function () {
        return { name: "`health`", value: "Reports health of connected APIs" };
    };
    return Health;
}(CommandInterface_1.default));
exports.default = Health;