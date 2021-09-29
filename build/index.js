"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var core = __importStar(require("@actions/core"));
var path_1 = require("path");
var process_1 = require("process");
var fs_1 = require("fs");
function getInputs() {
    var package_path = core.getInput('package-path');
    var append_str = core.getInput('append');
    var set_str = core.getInput('set');
    var remove_str = core.getInput('remove');
    return [package_path, JSON.parse(append_str), JSON.parse(set_str), JSON.parse(remove_str)];
}
function checkRepository(package_path) {
    return __awaiter(this, void 0, void 0, function () {
        var dirs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readdir((0, path_1.join)(process_1.env['GITHUB_WORKSPACE'], package_path))];
                case 1:
                    dirs = _a.sent();
                    if (dirs.findIndex(function (value) { return value === 'package.json'; }) === -1) {
                        throw new Error('Unable to find \"package.json\"');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getDefault(data, elem, defaulty) {
    if (elem in data) {
        return data[elem];
    }
    else {
        return defaulty;
    }
}
function packageJSON(packagejson, append, set, remove) {
    for (var elem in packagejson) {
        if (typeof packagejson[elem] === 'object') {
            if (elem in append) {
                if (Array.isArray(packagejson[elem])) {
                    packagejson[elem].push(append[elem]);
                }
                else {
                    packagejson[elem] = __assign(__assign({}, packagejson[elem]), append[elem]);
                }
            }
            if (elem in set) {
                packagejson[elem] = set[elem];
            }
            var removeBool = false;
            if (elem in remove) {
                delete packagejson[elem];
                removeBool = true;
            }
            if (!removeBool) {
                packageJSON(packagejson[elem], getDefault(append, elem, {}), getDefault(set, elem, {}), getDefault(remove, elem, {}));
            }
        }
        else {
            if (elem in append) {
                packagejson[elem] += append[elem];
            }
            if (elem in set) {
                packagejson[elem] = set[elem];
            }
            if (elem in remove) {
                delete packagejson[elem];
            }
        }
    }
}
function modifyPackageJSON(package_path, append, set, remove) {
    return __awaiter(this, void 0, void 0, function () {
        var packagejson, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs_1.promises.readFile((0, path_1.join)(process_1.env['GITHUB_WORKSPACE'], package_path, 'package.json'), { encoding: 'utf-8', flag: 'r' })];
                case 1:
                    packagejson = _b.apply(_a, [_c.sent()]);
                    packageJSON(packagejson, append, set, remove);
                    return [4 /*yield*/, fs_1.promises.writeFile((0, path_1.join)(process_1.env['GITHUB_WORKSPACE'], package_path, 'package.json'), JSON.stringify(packagejson), { encoding: 'utf-8', flag: 'w' })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, package_path, append, set, remove;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = getInputs(), package_path = _a[0], append = _a[1], set = _a[2], remove = _a[3];
                    return [4 /*yield*/, checkRepository(package_path)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, modifyPackageJSON(package_path, append, set, remove)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    core.setFailed('Action failed with error: ' + e.message);
});
