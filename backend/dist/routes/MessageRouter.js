"use strict";
//해당 채팅방의 메시지를 가져오는, 메시지 조회 API
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
const dbpool_1 = __importDefault(require("../config/dbpool")); // 디폴트 익스포트 가져오기
const express_1 = require("express");
const router = (0, express_1.Router)(); // Router 객체 생성
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rid = req.query.rid; // 클라이언트에서 채널 ID 전달
    console.log('클라이언트에서 받은 rid:', rid);
    try {
        const [messages] = yield dbpool_1.default.query(`SELECT mid, content, timestamp, email as user_email, uname as user
         FROM Message m
         JOIN User u ON user_email = email
         WHERE room_id = ?
         ORDER BY timestamp ASC;`, [rid]);
        console.log('쿼리 결과:', messages);
        res.json(messages);
        console.log('해당 채팅 방의 메시지 리스트 가져오기 성공');
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류 발생.' });
    }
}));
exports.default = router;
