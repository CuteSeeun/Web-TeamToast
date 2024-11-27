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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const [result] = yield dbpool_1.default.query('SELECT * FROM User WHERE email = ?', [email]);
        res.json({ isAvailable: result.length === 0 });
    }
    catch (error) {
        console.error('이메일 중복 확인 오류:', error);
        res.status(500).json({ isAvailable: false });
    }
});
exports.checkEmail = checkEmail;
