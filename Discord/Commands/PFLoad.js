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
var mysql_1 = __importDefault(require("mysql"));
var PFLoad = /** @class */ (function (_super) {
    __extends(PFLoad, _super);
    function PFLoad(esi, jove) {
        var _this = _super.call(this, esi, jove) || this;
        _this.connection = mysql_1.default.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DATA
        });
        return _this;
    }
    PFLoad.prototype.execute = function (message, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.connection.query('SELECT `sourceTbl`.`systemId` AS `src`,`targetTbl`.`systemId` as `tgt`,`connection`.`updated` as `updated` FROM `connection`\n' +
                    'JOIN `system` AS sourceTbl ON `connection`.`source`=`sourceTbl`.`id`\n' +
                    'JOIN `system` AS targetTbl ON `connection`.`target`=`targetTbl`.`id`\n' +
                    'WHERE (`sourceTbl`.`systemId` IN (31000003,31000006,31000001,31000002,31000004)\n' +
                    'OR `targetTbl`.`systemId` IN (31000003,31000006,31000001,31000002,31000004))\n' +
                    'AND `connection`.`updated` > DATE_SUB(CURDATE(), INTERVAL 16 HOUR);', function (error, results) { return __awaiter(_this, void 0, void 0, function () {
                    var changes, _loop_1, this_1, _i, results_1, v, changesGroupedByRegion, _a, changes_1, change, msg, _b, _c, _d, key, value, i, v, pfloadMsg, _e, changes_2, change;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!error) return [3 /*break*/, 2];
                                return [4 /*yield*/, message.reply('SQL Connection failed: `' + error + '`')];
                            case 1:
                                _f.sent();
                                return [2 /*return*/];
                            case 2:
                                changes = [];
                                _loop_1 = function (v) {
                                    var src, tgt, wh, oldData, existingChange;
                                    return __generator(this, function (_g) {
                                        switch (_g.label) {
                                            case 0:
                                                src = '', tgt = '';
                                                if (!PFLoad.drifterIds.includes(v.src)) return [3 /*break*/, 1];
                                                src = v.src;
                                                tgt = v.tgt;
                                                return [3 /*break*/, 4];
                                            case 1:
                                                if (!PFLoad.drifterIds.includes(v.tgt)) return [3 /*break*/, 2];
                                                src = v.tgt;
                                                tgt = v.src;
                                                return [3 /*break*/, 4];
                                            case 2: return [4 /*yield*/, message.reply('Could not define source and target system!')];
                                            case 3:
                                                _g.sent();
                                                return [2 /*return*/, "continue"];
                                            case 4:
                                                wh = '';
                                                switch (src.toString()) {
                                                    case '31000003':
                                                        wh = 'V';
                                                        break;
                                                    case '31000006':
                                                        wh = 'R';
                                                        break;
                                                    case '31000001':
                                                        wh = 'S';
                                                        break;
                                                    case '31000002':
                                                        wh = 'B';
                                                        break;
                                                    case '31000004':
                                                        wh = 'C';
                                                        break;
                                                }
                                                return [4 /*yield*/, this_1.jove.findById(parseInt(tgt))];
                                            case 5:
                                                oldData = _g.sent();
                                                existingChange = changes.find(function (entry) { return entry.id === src; });
                                                if (typeof existingChange !== 'undefined' && existingChange.length > 0) {
                                                    existingChange.newData.push(wh);
                                                }
                                                else {
                                                    changes.push({
                                                        region: oldData.region,
                                                        id: oldData.data.id,
                                                        system: oldData.name,
                                                        oldData: oldData.data.whs,
                                                        newData: [wh]
                                                    });
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                this_1 = this;
                                _i = 0, results_1 = results;
                                _f.label = 3;
                            case 3:
                                if (!(_i < results_1.length)) return [3 /*break*/, 6];
                                v = results_1[_i];
                                return [5 /*yield**/, _loop_1(v)];
                            case 4:
                                _f.sent();
                                _f.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 3];
                            case 6:
                                changesGroupedByRegion = {};
                                for (_a = 0, changes_1 = changes; _a < changes_1.length; _a++) {
                                    change = changes_1[_a];
                                    if (changesGroupedByRegion.hasOwnProperty(change.region)) {
                                        changesGroupedByRegion[change.region].push(change);
                                    }
                                    else {
                                        changesGroupedByRegion[change.region] = [];
                                        changesGroupedByRegion[change.region].push(change);
                                    }
                                }
                                msg = 'The following changes will get pulled from the pathfinder database:\n';
                                for (_b = 0, _c = Object.entries(changesGroupedByRegion); _b < _c.length; _b++) {
                                    _d = _c[_b], key = _d[0], value = _d[1];
                                    if (value.length) {
                                        msg += key + '```';
                                        for (i = 0; i < value.length; i++) {
                                            v = value[i];
                                            msg += v.system + ' [' + v.oldData.join(',') + '] => [' + v.newData.join(',') + ']';
                                        }
                                        msg += '```';
                                    }
                                }
                                return [4 /*yield*/, message.reply(msg)];
                            case 7:
                                _f.sent();
                                return [4 /*yield*/, this.provideYesNoPrompt(message, 'Do you want to pull these changes?')];
                            case 8:
                                if (!_f.sent()) return [3 /*break*/, 15];
                                return [4 /*yield*/, message.reply('Pathfinder loading starting...')];
                            case 9:
                                pfloadMsg = _f.sent();
                                _e = 0, changes_2 = changes;
                                _f.label = 10;
                            case 10:
                                if (!(_e < changes_2.length)) return [3 /*break*/, 13];
                                change = changes_2[_e];
                                return [4 /*yield*/, this.jove.setWHs(change.system, change.newData)];
                            case 11:
                                _f.sent();
                                _f.label = 12;
                            case 12:
                                _e++;
                                return [3 /*break*/, 10];
                            case 13: return [4 /*yield*/, pfloadMsg.edit('Pathfinder loading complete!')];
                            case 14:
                                _f.sent();
                                return [3 /*break*/, 17];
                            case 15: return [4 /*yield*/, message.reply('Pathfinder loading canceled!')];
                            case 16:
                                _f.sent();
                                _f.label = 17;
                            case 17: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    PFLoad.prototype.getAccessLevel = function () {
        return 1;
    };
    PFLoad.prototype.help = function () {
        return { name: "`pfload`", value: "Loads connections from pathfinder." };
    };
    PFLoad.drifterIds = [31000003, 31000006, 31000001, 31000002, 31000004];
    return PFLoad;
}(CommandInterface_1.default));
exports.default = PFLoad;
