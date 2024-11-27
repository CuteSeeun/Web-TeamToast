"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailCheck_1 = require("../middlewares/emailCheck");
const kakaoMiddle_1 = require("../middlewares/kakaoMiddle");
const userMiddle_1 = require("../middlewares/userMiddle");
const profileMiddle_1 = require("../middlewares/profileMiddle");
const passwdMiddle_1 = require("../middlewares/passwdMiddle");
// const express = require('express');
const router = express_1.default.Router();
// 로그인 회원가입 사용자 유지
router.post('/saveUser', userMiddle_1.join);
router.post('/loginUser', userMiddle_1.login);
router.get('/me', userMiddle_1.getInfo);
//카카오 소셜 로그인 라우트
router.get('/kakao-login', kakaoMiddle_1.kakaoLogin);
router.post('/kakao-token', kakaoMiddle_1.kakaoTokenHandler);
//이메일 체크 라우트
router.post('/checkEmail', emailCheck_1.checkEmail);
//프로필 변경 라우트
router.post('/user/profile', profileMiddle_1.updateProfile);
//비밀번호 변경 라우트(로그인,회원가입 쪽 파트)
router.post('/findPass', passwdMiddle_1.findUserPassword);
router.post('/vaildaeUser', passwdMiddle_1.vaildateUser);
//비밀번호 변경 라우트(프로필 쪽 파트)
router.post('/check-password', passwdMiddle_1.checkCurrentPw);
router.post('/change-password', passwdMiddle_1.changePw);
exports.default = router;
