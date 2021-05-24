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
Object.defineProperty(exports, "__esModule", { value: true });
var node_json_db_1 = require("node-json-db");
var google_spreadsheet_1 = require("google-spreadsheet");
var dotenv_1 = require("dotenv");
dotenv_1.config();
var JoveStorage = /** @class */ (function () {
    function JoveStorage(esi) {
        this.db = new node_json_db_1.JsonDB('jove.json');
        this.esi = esi;
    }
    JoveStorage.prototype.importFromGoogle = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var skippedSystems, msg, _a, GOOGLE_API, GOOGLE_SHEET, doc, drifterSheet, drifterInfo, i, drifterRegion, region, systems, j, esiSystem, e_1, drifterSystem;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.db.delete('region');
                        skippedSystems = [];
                        return [4 /*yield*/, message.channel.send('Starting import... 000%')];
                    case 1:
                        msg = _b.sent();
                        _a = process.env, GOOGLE_API = _a.GOOGLE_API, GOOGLE_SHEET = _a.GOOGLE_SHEET;
                        if (typeof GOOGLE_API === "undefined" || typeof GOOGLE_SHEET === "undefined") {
                            return [2 /*return*/, "Please make sure GOOGLE_API and GOOGLE_SHEET are defined in .env!"];
                        }
                        doc = new google_spreadsheet_1.GoogleSpreadsheet(GOOGLE_SHEET);
                        return [4 /*yield*/, doc.useApiKey(GOOGLE_API)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, doc.loadInfo()];
                    case 3:
                        _b.sent();
                        drifterSheet = doc.sheetsByIndex[0];
                        return [4 /*yield*/, drifterSheet.getCellsInRange('A9:AO72')];
                    case 4:
                        drifterInfo = _b.sent();
                        i = 0;
                        _b.label = 5;
                    case 5:
                        if (!(i < drifterInfo.length)) return [3 /*break*/, 17];
                        drifterRegion = drifterInfo[i];
                        drifterRegion.splice(-1, 1);
                        region = drifterRegion.shift();
                        region = region.replace(/ /g, '_');
                        systems = {};
                        j = 0;
                        _b.label = 6;
                    case 6:
                        if (!(j < drifterRegion.length)) return [3 /*break*/, 13];
                        if (drifterRegion[j].length < 3) {
                            skippedSystems.push(drifterRegion[j]);
                            return [3 /*break*/, 12];
                        }
                        esiSystem = null;
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.esi.get('/v2/search/?categories=solar_system&datasource=tranquility&language=en&strict=true&search=' + drifterRegion[j])];
                    case 8:
                        esiSystem = (_b.sent()).data.solar_system;
                        return [3 /*break*/, 10];
                    case 9:
                        e_1 = _b.sent();
                        esiSystem = null;
                        return [3 /*break*/, 10];
                    case 10:
                        if (esiSystem === null) return [3 /*break*/, 7];
                        _b.label = 11;
                    case 11:
                        if (typeof esiSystem === "undefined") {
                            skippedSystems.push(drifterRegion[j]);
                            return [3 /*break*/, 12];
                        }
                        else {
                            esiSystem = esiSystem[0];
                        }
                        drifterSystem = drifterRegion[j].replace(/ /g, '_');
                        if (!systems.hasOwnProperty(drifterSystem)) {
                            systems[drifterSystem] = {
                                updated: '',
                                whs: [],
                                id: esiSystem
                            };
                        }
                        _b.label = 12;
                    case 12:
                        j++;
                        return [3 /*break*/, 6];
                    case 13: return [4 /*yield*/, this.db.push('region/' + region, systems)];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, msg.edit('Starting import... ' + (((i + 1) / drifterInfo.length) * 100).toString().padStart(3, '0') + '%')];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16:
                        i++;
                        return [3 /*break*/, 5];
                    case 17: return [4 /*yield*/, msg.edit('~~' + msg.content + '~~ **DONE**\nSkipped: ' + skippedSystems.join(', '))];
                    case 18:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    JoveStorage.prototype.getForRegion = function (region) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getData('region/' + region)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JoveStorage.prototype.getRegions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getData('region')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JoveStorage.prototype.resetOutdated = function (region) {
        if (region === void 0) { region = null; }
        return __awaiter(this, void 0, void 0, function () {
            var regions, _a, _b, _i, regionsKey, systems, systems;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(region === null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.db.getData('region')];
                    case 1:
                        regions = _c.sent();
                        _a = [];
                        for (_b in regions)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        regionsKey = _a[_i];
                        if (!regions.hasOwnProperty(regionsKey)) return [3 /*break*/, 4];
                        systems = regions[regionsKey];
                        return [4 /*yield*/, this.resetOutdatedRegion(regionsKey, systems)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 11];
                    case 6: return [4 /*yield*/, this.db.exists('region/' + region)];
                    case 7:
                        if (!(_c.sent())) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.db.getData('region/' + region)];
                    case 8:
                        systems = _c.sent();
                        return [4 /*yield*/, this.resetOutdatedRegion(region, systems)];
                    case 9:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        console.error('Region ' + region + ' not found in database!');
                        _c.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    JoveStorage.prototype.resetOutdatedRegion = function (region, systems) {
        return __awaiter(this, void 0, void 0, function () {
            var currentTime, _a, _b, _i, systemsKey, system, diff, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        currentTime = (new Date).valueOf();
                        _a = [];
                        for (_b in systems)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        systemsKey = _a[_i];
                        if (!systems.hasOwnProperty(systemsKey)) return [3 /*break*/, 4];
                        system = systems[systemsKey];
                        diff = (currentTime - system.updated);
                        if (!(diff > (1000 * 60 * 60 * 16))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.push('region/' + region + '/' + systemsKey, {
                                updated: '',
                                whs: [],
                                id: system.id
                            })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (system.whs.filter(function (wh) { return wh.match(/[BCVSR]-/); }) && diff > (1000 * 60 * 60 * 4)) {
                            for (i = 0; i < system.whs.length; i++) {
                                if (system.whs[i].match(/[BCVSR]-/)) {
                                    system.whs.splice(i, 1);
                                }
                            }
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    JoveStorage.prototype.setWHs = function (system, whs) {
        return __awaiter(this, void 0, void 0, function () {
            var i, wh, regions, _a, _b, _i, regionsKey, sys;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        for (i = 0; i < whs.length; i++) {
                            wh = whs[i];
                            if (!JoveStorage.POSSIBLE_VALUES.includes(wh)) {
                                return [2 /*return*/, 'Undefined WH identifier: ' + wh];
                            }
                        }
                        if (whs.length === 1 && whs[0] === '-') {
                            whs = [];
                        }
                        return [4 /*yield*/, this.db.getData('region')];
                    case 1:
                        regions = _c.sent();
                        _a = [];
                        for (_b in regions)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        regionsKey = _a[_i];
                        if (!(regions.hasOwnProperty(regionsKey) && regions[regionsKey].hasOwnProperty(system))) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.db.getData('region/' + regionsKey + '/' + system)];
                    case 3:
                        sys = _c.sent();
                        return [4 /*yield*/, this.db.push('region/' + regionsKey + '/' + system, {
                                updated: (new Date()).valueOf(),
                                whs: whs,
                                id: sys.id
                            })];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, true];
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, 'Could not find system in jove list'];
                }
            });
        });
    };
    JoveStorage.prototype.findByType = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var returns, regions, regionKey, region, systemKey, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        returns = {
                            stable: [],
                            unstable: []
                        };
                        return [4 /*yield*/, this.db.getData('region')];
                    case 1:
                        regions = _a.sent();
                        for (regionKey in regions) {
                            if (regions.hasOwnProperty(regionKey)) {
                                region = regions[regionKey];
                                for (systemKey in region) {
                                    if (region.hasOwnProperty(systemKey)) {
                                        entry = region[systemKey];
                                        if (entry.whs.includes(type)) {
                                            returns.stable.push({
                                                region: regionKey,
                                                system: systemKey,
                                                updated: entry.updated
                                            });
                                        }
                                        if (entry.whs.includes(type + '-')) {
                                            returns.unstable.push({
                                                region: regionKey,
                                                system: systemKey,
                                                updated: entry.updated
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        return [2 /*return*/, returns];
                }
            });
        });
    };
    JoveStorage.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var returnData, regions, regionKey, region, systemKey, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        returnData = {
                            region: "",
                            name: "",
                            data: {}
                        };
                        return [4 /*yield*/, this.db.getData('region')];
                    case 1:
                        regions = _a.sent();
                        for (regionKey in regions) {
                            if (regions.hasOwnProperty(regionKey)) {
                                region = regions[regionKey];
                                for (systemKey in region) {
                                    if (region.hasOwnProperty(systemKey)) {
                                        entry = region[systemKey];
                                        if (entry.id === id) {
                                            returnData.region = regionKey;
                                            returnData.name = systemKey;
                                            returnData.data = entry;
                                        }
                                    }
                                }
                            }
                        }
                        if (returnData.name === "") {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, returnData];
                }
            });
        });
    };
    JoveStorage.POSSIBLE_VALUES = [
        'B', 'C', 'V', 'S', 'R', '-',
        'B-', 'C-', 'V-', 'S-', 'R-'
    ];
    JoveStorage.WHS = [
        'B', 'C', 'V', 'S', 'R'
    ];
    return JoveStorage;
}());
exports.default = JoveStorage;
