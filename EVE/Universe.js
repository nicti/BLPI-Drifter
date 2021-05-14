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
var node_json_db_1 = require("node-json-db");
var axios_1 = __importDefault(require("axios"));
var esi = axios_1.default.create({
    baseURL: 'https://esi.evetech.net',
});
var Universe = /** @class */ (function () {
    function Universe() {
        this.db = new node_json_db_1.JsonDB('universe.json');
    }
    Universe.prototype.secureCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, cacheType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < Universe.CACHE_TYPES.length)) return [3 /*break*/, 5];
                        cacheType = Universe.CACHE_TYPES[i];
                        return [4 /*yield*/, this.cacheExists(cacheType)];
                    case 2:
                        if (!!(_a.sent())) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.buildCache(cacheType)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Universe.prototype.buildCache = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = type;
                        switch (_a) {
                            case "regions": return [3 /*break*/, 1];
                            case "constellations": return [3 /*break*/, 3];
                            case "systems": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.buildRegionCache()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, this.buildConstellationCache()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.buildSystemCache()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Universe.prototype.buildRegionCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                esi.get('/v1/universe/regions/').then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var i, regionId, region;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < response.data.length)) return [3 /*break*/, 5];
                                regionId = response.data[i];
                                return [4 /*yield*/, esi.get('/v1/universe/regions/' + regionId + '/')];
                            case 2:
                                region = _a.sent();
                                return [4 /*yield*/, this.db.push('universe/regions/' + regionId, {
                                        id: regionId,
                                        name: region.data.name,
                                        constellations: region.data.constellations
                                    })];
                            case 3:
                                _a.sent();
                                console.log('[region cache]: ' + (i + 1) + '/' + response.data.length);
                                _a.label = 4;
                            case 4:
                                i++;
                                return [3 /*break*/, 1];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Universe.prototype.buildConstellationCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                esi.get('/v1/universe/constellations/').then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var i, constellationsId, constellations;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < response.data.length)) return [3 /*break*/, 5];
                                constellationsId = response.data[i];
                                return [4 /*yield*/, esi.get('/v1/universe/constellations/' + constellationsId + '/')];
                            case 2:
                                constellations = _a.sent();
                                return [4 /*yield*/, this.db.push('universe/constellations/' + constellationsId, {
                                        id: constellationsId,
                                        name: constellations.data.name,
                                        systems: constellations.data.systems,
                                        region_id: constellations.data.region_id
                                    })];
                            case 3:
                                _a.sent();
                                console.log('[constellation cache]: ' + (i + 1) + '/' + response.data.length);
                                _a.label = 4;
                            case 4:
                                i++;
                                return [3 /*break*/, 1];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Universe.prototype.buildSystemCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                esi.get('/v1/universe/systems/').then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var i, systemId, system, adjustedSystems, j, stargateId, stargate;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < response.data.length)) return [3 /*break*/, 9];
                                systemId = response.data[i];
                                return [4 /*yield*/, esi.get('/v4/universe/systems/' + systemId + '/')];
                            case 2:
                                system = _a.sent();
                                adjustedSystems = [];
                                j = 0;
                                _a.label = 3;
                            case 3:
                                if (!(j < system.data.stargates.length)) return [3 /*break*/, 6];
                                stargateId = system.data.stargates[j];
                                return [4 /*yield*/, esi.get('/v1/universe/stargates/' + stargateId + '/')];
                            case 4:
                                stargate = _a.sent();
                                adjustedSystems.push(stargate.data.destination.system_id);
                                _a.label = 5;
                            case 5:
                                j++;
                                return [3 /*break*/, 3];
                            case 6: return [4 /*yield*/, this.db.push('universe/systems/' + systemId, {
                                    id: systemId,
                                    name: system.data.name,
                                    constellation_id: system.data.constellation_id,
                                    adjusted: adjustedSystems
                                })];
                            case 7:
                                _a.sent();
                                console.log('[System cache]: ' + (i + 1) + '/' + response.data.length);
                                _a.label = 8;
                            case 8:
                                i++;
                                return [3 /*break*/, 1];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Universe.prototype.cacheExists = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var idCount, typeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, esi.get('/latest/universe/' + type + '/')];
                    case 1:
                        idCount = _a.sent();
                        if (!this.db.exists('universe/' + type)) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.db.getData('universe/' + type)];
                    case 2:
                        typeData = _a.sent();
                        return [2 /*return*/, (idCount.data.length === Object.keys(typeData).length)];
                }
            });
        });
    };
    Universe.CACHE_TYPES = [
        'regions',
        'constellations',
        'systems'
    ];
    return Universe;
}());
exports.default = Universe;
