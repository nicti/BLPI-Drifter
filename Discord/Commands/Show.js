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
var Show = /** @class */ (function (_super) {
    __extends(Show, _super);
    function Show() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Show.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var regionSearchName, ids, regionId, region, regionName, joveRegionalInfo, str, link, key, systems, date, dateObj;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data.forEach(function (e, i) { return data[i] = _this.capitalizeFirstLetter(e.toLowerCase()); });
                        regionSearchName = data.join(' ');
                        return [4 /*yield*/, this.esi.post('/v1/universe/ids/', [regionSearchName])];
                    case 1:
                        ids = (_a.sent()).data;
                        if (!ids['regions']) return [3 /*break*/, 8];
                        if (!(ids['regions'].length !== 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, message.channel.send('Search resulted in several hits, please specify.')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        regionId = ids['regions'][0].id;
                        return [4 /*yield*/, this.esi.get('/v1/universe/regions/' + regionId + '/')];
                    case 4:
                        region = (_a.sent()).data;
                        regionName = region.name.replace(/ /g, '_');
                        return [4 /*yield*/, this.jove.resetOutdated(regionName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.jove.getForRegion(regionName)];
                    case 6:
                        joveRegionalInfo = _a.sent();
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
                                    dateObj = new Date(joveRegionalInfo[key].updated);
                                    date = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                                        ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC';
                                }
                                str += key + ': ' + systems + ' [' + date + ']\n';
                            }
                        }
                        return [4 /*yield*/, message.channel.send(region.name + ':```' + str + '```https://evemaps.dotlan.net/map/' + regionName + '/' + link.join(':'))];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, message.channel.send('Could not find region matching `' + regionSearchName + '`.')];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Show.prototype.help = function () {
        return { name: "`show <region>`", value: "Shows all drifter data for a given region" };
    };
    Show.prototype.getAccessLevel = function () {
        return 0;
    };
    Show.prototype.capitalizeFirstLetter = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return Show;
}(CommandInterface_1.default));
exports.default = Show;
