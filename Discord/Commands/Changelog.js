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
var child_process_1 = require("child_process");
var changelog_parser_1 = __importDefault(require("changelog-parser"));
var Changelog = /** @class */ (function (_super) {
    __extends(Changelog, _super);
    function Changelog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Changelog.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, log, versions, versionStr, embed, _i, _a, version, str, _b, _c, _d, key, value;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        limit = 3;
                        return [4 /*yield*/, (0, changelog_parser_1.default)('./CHANGELOG.md')];
                    case 1:
                        log = _e.sent();
                        versions = log.versions;
                        if (!(data[0] && !data[0].includes('.'))) return [3 /*break*/, 2];
                        limit = parseInt(data[0]);
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(data[0] && data[0].includes('.'))) return [3 /*break*/, 4];
                        versions = versions.filter(function (o) { return o.version === data[0]; });
                        limit = 1;
                        if (!(versions.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, message.reply('Version string `' + data[0] + '` was not found!')];
                    case 3:
                        _e.sent();
                        return [2 /*return*/];
                    case 4:
                        versionStr = new TextDecoder().decode((0, child_process_1.execSync)("git describe --tag --always")).replace('\n', '');
                        embed = new discord_js_1.MessageEmbed();
                        embed.setTitle('Changelog');
                        embed.setDescription("Current version: **".concat(versionStr, "**"));
                        for (_i = 0, _a = versions.splice(0, limit); _i < _a.length; _i++) {
                            version = _a[_i];
                            str = '';
                            for (_b = 0, _c = Object.entries(version.parsed); _b < _c.length; _b++) {
                                _d = _c[_b], key = _d[0], value = _d[1];
                                if (key === '_')
                                    continue;
                                str += '**' + key + '**\n-';
                                // @ts-ignore
                                str += value.join('\n-');
                                str += '\n';
                            }
                            embed.addField(version.version, '>>> ' + str + '');
                        }
                        embed.setURL('https://github.com/nicti/blpi-drifter/blob/main/README.md');
                        return [4 /*yield*/, message.reply({ embeds: [embed] })];
                    case 5:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Changelog.prototype.getAccessLevel = function () {
        return 0;
    };
    Changelog.prototype.help = function () {
        return { name: "`changelog`", value: "Displays current tag and the changelog" };
    };
    return Changelog;
}(CommandInterface_1.default));
exports.default = Changelog;
