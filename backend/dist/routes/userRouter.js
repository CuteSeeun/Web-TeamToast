"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const kakaoController_1 = require("../controller/kakaoController");
const phoneController_1 = require("../controller/phoneController");
// const express = require('express');
const router = express_1.default.Router();
// 로그인 회원가입 사용자 유지
router.post('/saveUser', userController_1.join);
router.post('/loginUser', userController_1.login);
router.get('/me', userController_1.getInfo);
//카카오 소셜 로그인 라우트
router.get('/kakao-login', kakaoController_1.kakaoLogin);
router.post('/kakao-token', kakaoController_1.kakaoTokenHandler);
//이메일 체크 라우트
router.post('/checkEmail', userController_1.checkEmail);
//휴대폰 인증 관련 라우트
router.post('/checkPhone', phoneController_1.checkPhone);
router.post('/auth/sendverification', phoneController_1.sendPhoneVerification);
router.post('/auth/verifyPhone', phoneController_1.verifyPhoneCode);
exports.default = router;
