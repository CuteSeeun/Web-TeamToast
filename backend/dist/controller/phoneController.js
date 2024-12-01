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
exports.checkPhone = exports.verifyPhoneCode = exports.sendPhoneVerification = void 0;
const smsServiceController_1 = require("./smsServiceController");
const dbpool_1 = __importDefault(require("../config/dbpool"));
// 6자리 랜덤 인증번호 생성 함수
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();
// sms 인증번호 발송
const sendPhoneVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbpool_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const { phoneNumber } = req.body;
        const verificationCode = generateVerificationCode();
        // 기존 인증번호 삭제
        yield connection.query('DELETE FROM verification WHERE tel = ?', [phoneNumber]);
        // 새 인증번호 저장
        yield connection.query(`INSERT INTO verification (tel, code)
           VALUES (?, ?)`, [phoneNumber, verificationCode]);
        // SMS 발송
        yield (0, smsServiceController_1.sendSMS)(phoneNumber, `인증번호는 [${verificationCode}] 입니다.`);
        // db 저장
        yield connection.commit();
        res.json({ success: true, message: '인증번호가 발송되었습니다.' });
    }
    catch (error) {
        // db 삭제
        yield connection.rollback();
        console.error('sms 발송 실패 : ', error);
        res.status(500).json({ message: '인증번호 발송 실패' });
    }
    finally {
        connection.release();
    }
});
exports.sendPhoneVerification = sendPhoneVerification;
//인증번호 확인 함수
const verifyPhoneCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield dbpool_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const { phoneNumber, code } = req.body;
        console.log('받은 데이터:', { phoneNumber, code });
        //db에서 인증번호 확인
        const [rows] = yield connection.query(`SELECT * FROM verification
           WHERE tel = ? AND code = ? LIMIT 1`, [phoneNumber, code]);
        if (rows.length === 0) {
            res.status(400).json({
                success: false,
                message: '유효하지 않거나 만료된 인증번호 입니다.'
            });
            return;
        }
        // 인증 완료되면 삭제함
        yield connection.query('DELETE FROM verification WHERE tel = ?', [phoneNumber]);
        yield connection.commit();
        res.json({ success: true, message: '인증이 완료되었습니다.' });
    }
    catch (error) {
        yield connection.rollback();
        console.error('인증 확인 실패 :', error);
        res.status(500).json({ success: false, message: '인증확인에 실패했습니다.' });
    }
    finally {
        connection.release();
    }
});
exports.verifyPhoneCode = verifyPhoneCode;
// 핸드폰 중복 체크
const checkPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tel } = req.body;
        // db에서 핸드폰 있는지 체크
        const [rows] = yield dbpool_1.default.query('SELECT * FROM User WHERE tel = ?', [tel]);
        if (rows.length > 0) {
            res.json({ isAvailable: false, message: '이미 사용중인 휴대폰 번호입니다.' });
        }
        else {
            res.json({ isAvailable: true, message: '사용 가능한 휴대폰 번호입니다.' });
        }
    }
    catch (error) {
        console.error('에러 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});
exports.checkPhone = checkPhone;
