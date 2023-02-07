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
var Closest = /** @class */ (function (_super) {
    __extends(Closest, _super);
    function Closest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Closest.prototype.registerCommand = function () {
        return null;
    };
    Closest.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var systemSearchName, ids, solarSystemId, regions, pairs, _i, _a, _b, region, regionData, _c, _d, _e, system_1, systemData, i, j, chunk, chunks, routes, k, chunk_1, request, route, shortest, system, date, dateObj, whList, str;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        systemSearchName = data.join(' ');
                        return [4 /*yield*/, this.esi.post('/v1/universe/ids/', [systemSearchName])];
                    case 1:
                        ids = (_f.sent()).data;
                        if (!ids['systems']) return [3 /*break*/, 11];
                        if (!(ids['systems'].length !== 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, message.channel.send('Search resulted in several hits, please specify.')];
                    case 2:
                        _f.sent();
                        return [2 /*return*/];
                    case 3:
                        solarSystemId = ids['systems'][0].id;
                        return [4 /*yield*/, this.jove.getRegions()];
                    case 4:
                        regions = _f.sent();
                        pairs = [];
                        for (_i = 0, _a = Object.entries(regions); _i < _a.length; _i++) {
                            _b = _a[_i], region = _b[0], regionData = _b[1];
                            for (_c = 0, _d = Object.entries(regionData); _c < _d.length; _c++) {
                                _e = _d[_c], system_1 = _e[0], systemData = _e[1];
                                if (!pairs.includes('30000380|' + systemData.id)) {
                                    pairs.push('30000380|' + systemData.id);
                                }
                            }
                        }
                        i = void 0, j = void 0, chunk = 100, chunks = [];
                        for (i = 0, j = pairs.length; i < j; i += chunk) {
                            chunks.push(pairs.slice(i, i + chunk));
                        }
                        routes = [];
                        k = 0;
                        _f.label = 5;
                    case 5:
                        if (!(k < chunks.length)) return [3 /*break*/, 8];
                        chunk_1 = chunks[k];
                        request = '/v1/route/30000380/' + solarSystemId + '/?connections=' + chunk_1.join(',');
                        return [4 /*yield*/, this.esi.get(request)];
                    case 6:
                        route = (_f.sent()).data;
                        routes.push(route);
                        _f.label = 7;
                    case 7:
                        k++;
                        return [3 /*break*/, 5];
                    case 8:
                        shortest = routes.reduce(function (p, c) { return p.length > c.length ? c : p; }, { length: Infinity });
                        return [4 /*yield*/, this.jove.findById(shortest[1])];
                    case 9:
                        system = _f.sent();
                        date = void 0;
                        if (system.data.updated === "") {
                            date = "";
                        }
                        else {
                            dateObj = new Date(system.data.updated);
                            date = dateObj.getUTCFullYear().toString() + '-' + (dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + (dateObj.getUTCDate()).toString().padStart(2, '0') +
                                ' ' + dateObj.getUTCHours().toString().padStart(2, '0') + ':' + dateObj.getUTCMinutes().toString().padStart(2, '0') + ' UTC';
                        }
                        whList = "-";
                        if (system.data.whs.length) {
                            whList = system.data.whs.join(',');
                        }
                        str = system.name + ': ' + whList + ' [' + date + ']';
                        return [4 /*yield*/, message.reply('Closest Jove system is ' + system.name + '!```' + str + '```https://evemaps.dotlan.net/map/' + system.region + '/' + system.name)];
                    case 10:
                        _f.sent();
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, message.channel.send('Could not find system matching `' + systemSearchName + '`.')];
                    case 12:
                        _f.sent();
                        _f.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Closest.prototype.help = function () {
        return { name: "`closest <system>`", value: "Finds the closest jove system to a given system." };
    };
    Closest.prototype.getAccessLevel = function () {
        return 0;
    };
    Closest.prototype.executeInteraction = function (interaction) {
        return Promise.resolve(undefined);
    };
    return Closest;
}(CommandInterface_1.default));
exports.default = Closest;
