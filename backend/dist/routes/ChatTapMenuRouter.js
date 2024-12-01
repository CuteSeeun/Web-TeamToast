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
const dbpool_1 = __importDefault(require("../config/dbpool")); // 디폴트 익스포트 가져오기
const express_1 = require("express");
const router = (0, express_1.Router)(); // Router 객체 생성
router.get('/channel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.query.email; // 클라이언트에서 이메일 전달
    console.log('받은 이메일:', userEmail); // 로그 추가
    try {
        const [roomData] = yield dbpool_1.default.query(`SELECT Room.rid, Room.rname 
           FROM RoomMembers 
           JOIN Room ON RoomMembers.room_id = Room.rid 
           WHERE RoomMembers.user_email = ?`, [userEmail]);
        res.json(roomData);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류 발생.' });
    }
}));
//   module.exports = router;
exports.default = router;
