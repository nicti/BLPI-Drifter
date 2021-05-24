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
var axios_1 = __importDefault(require("axios"));
var esi = axios_1.default.create({
    baseURL: 'https://esi.evetech.net',
});
var Pings = /** @class */ (function () {
    function Pings() {
    }
    Pings.statusAll = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, Pings.pingEsi()];
                    case 1:
                        _a.esiPing = _b.sent();
                        return [4 /*yield*/, Pings.healthEsi()];
                    case 2:
                        _a.esiHealth = _b.sent(),
                            _a.discordPing = client.ws.ping;
                        return [4 /*yield*/, Pings.healthDiscord()];
                    case 3: return [2 /*return*/, (_a.discordHealth = _b.sent(),
                            _a)];
                }
            });
        });
    };
    Pings.pingEsi = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, esi.get('/ping')];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    Pings.healthEsi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, status, e_1, length, statusNumbers, i, endpoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, esi.get('/status.json?version=latest')];
                    case 2:
                        data = (_a.sent());
                        if (typeof data.data === "undefined") {
                            data = [];
                        }
                        else {
                            data = data.data;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        status = e_1.response.status;
                        return [3 /*break*/, 4];
                    case 4:
                        if (status === 200) {
                            length = data.length;
                        }
                        else {
                            length = 1;
                        }
                        statusNumbers = {
                            green: 0,
                            yellow: 0,
                            red: 0,
                            unknown: 0,
                            total: length
                        };
                        if (status === 200) {
                            for (i = 0; i < data.length; i++) {
                                endpoint = data[i];
                                switch (endpoint.status) {
                                    case 'green':
                                        statusNumbers.green += 1;
                                        break;
                                    case 'yellow':
                                        statusNumbers.yellow += 1;
                                        break;
                                    case 'red':
                                        statusNumbers.red += 1;
                                        break;
                                    default:
                                        statusNumbers.unknown += 1;
                                }
                            }
                        }
                        return [2 /*return*/, statusNumbers];
                }
            });
        });
    };
    Pings.healthDiscord = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get('https://srhpyqt94yxb.statuspage.io/api/v2/status.json')];
                    case 1:
                        status = (_a.sent()).data.status;
                        switch (status.indicator) {
                            case 'none':
                                return [2 /*return*/, 'GREEN'];
                            case 'minor':
                                return [2 /*return*/, 'YELLOW'];
                            case 'major':
                            case 'critical':
                                return [2 /*return*/, 'RED'];
                            default:
                                return [2 /*return*/, 'UNKNOWN'];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Pings;
}());
exports.default = Pings;
