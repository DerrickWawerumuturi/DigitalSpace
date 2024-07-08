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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayloadClient = exports.sendVerificationEmail = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var payload_1 = __importDefault(require("payload"));
var node_mailjet_1 = __importDefault(require("node-mailjet"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var crypto_1 = __importDefault(require("crypto"));
var PrimaryActionEmail_1 = require("./components/emails/PrimaryActionEmail");
var bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
// Generate JWT Secret
var generateJWTSecret = function () {
    return crypto_1.default.randomBytes(8).toString("hex");
};
var jwtSecret = generateJWTSecret();
var mailJet = node_mailjet_1.default.apiConnect("".concat(process.env.EMAIL_API_KEY), "".concat(process.env.EMAIL_API_SECRET_KEY));
var cached = global.payload;
if (!cached) {
    cached = global.payload = {
        client: null,
        promise: null,
    };
}
var sendVerificationEmail = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var token, hashedToken, verificationLink, emailHTML, emailData, response, err_1;
    var userEmail = _b.userEmail, userId = _b.userId;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = jsonwebtoken_1.default.sign({ id: userId }, jwtSecret, { expiresIn: "1h" });
                hashedToken = bcrypt_1.default.hashSync(token, 10);
                return [4 /*yield*/, payload_1.default.update({
                        collection: "users",
                        id: userId,
                        data: {
                            _verified: false,
                            _verificationToken: hashedToken,
                        },
                    })];
            case 1:
                _c.sent();
                verificationLink = "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(hashedToken);
                emailHTML = (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                    actionLabel: "Verify Your Account",
                    buttonText: "Verify your account",
                    href: verificationLink,
                });
                emailData = {
                    Messages: [
                        {
                            From: {
                                Email: "wawerumuturi57@gmail.com",
                                Name: "Digital Space",
                            },
                            To: [
                                {
                                    Email: userEmail,
                                    Name: "User",
                                },
                            ],
                            Subject: "Confirm Your Email",
                            HTMLPart: emailHTML,
                        },
                    ],
                };
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, mailJet
                        .post("send", { version: "v3.1" })
                        .request(emailData)];
            case 3:
                response = _c.sent();
                console.log("Email sent:", response.body);
                return [2 /*return*/, true];
            case 4:
                err_1 = _c.sent();
                console.error("Error sending email:", err_1);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.sendVerificationEmail = sendVerificationEmail;
var getPayloadClient = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (_a) {
        var _b, e_1;
        var _c = _a === void 0 ? {} : _a, initOptions = _c.initOptions;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!process.env.PAYLOAD_SECRET) {
                        throw new Error("PAYLOAD_SECRET is missing");
                    }
                    if (cached.client) {
                        return [2 /*return*/, cached.client];
                    }
                    if (!cached.promise) {
                        cached.promise = payload_1.default.init(__assign({ secret: process.env.PAYLOAD_SECRET, local: (initOptions === null || initOptions === void 0 ? void 0 : initOptions.express) ? false : true }, (initOptions || {})));
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    _b = cached;
                    return [4 /*yield*/, cached.promise];
                case 2:
                    _b.client = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _d.sent();
                    cached.promise = null;
                    throw e_1;
                case 4: return [2 /*return*/, cached.client];
            }
        });
    });
};
exports.getPayloadClient = getPayloadClient;
