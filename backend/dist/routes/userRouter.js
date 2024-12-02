"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");

const router = express_1.default.Router();
router.get('/project/:projectid/managers', userController_1.getProjectManagers);

const kakaoController_1 = require("../controller/kakaoController");
const phoneController_1 = require("../controller/phoneController");
const passwdController_1 = require("../controller/passwdController");
const profileController_1 = require("../controller/profileController");
const refreshController_1 = require("../controller/refreshController");
const authMiddleware_1 = require("../middlewares/authMiddleware");

// const express = require('express');
const router = express_1.default.Router();
// 로그인 회원가입 사용자 유지
router.post('/saveUser', userController_1.join);
router.post('/loginUser', userController_1.login);
router.post('/logout', authMiddleware_1.checkToken, userController_1.logout);
router.get('/me', authMiddleware_1.checkToken, userController_1.getInfo);
//리프레시 토큰생성
router.post('/refresh', refreshController_1.RefreshToken);
//액세스 토큰 재발급
router.post('/refresh/token', refreshController_1.reAccessToken);

//카카오 소셜 로그인 라우트
router.get('/kakao-login', kakaoController_1.kakaoLogin);
router.post('/kakao-token', kakaoController_1.kakaoTokenHandler);
//이메일 체크 라우트
router.post('/checkEmail', userController_1.checkEmail);
//휴대폰 인증 관련 라우트
router.post('/checkPhone', phoneController_1.checkPhone);
router.post('/auth/sendverification', phoneController_1.sendPhoneVerification);
router.post('/auth/verifyPhone', phoneController_1.verifyPhoneCode);
//비밀번호 찾기 라우트(로그인,회원가입 쪽)
router.post('/findPass', passwdController_1.findUserPassword);
router.post('/vaildaeUser', passwdController_1.vaildateUser);
//프로필 변경 라우트
router.post('/user/profile', authMiddleware_1.checkToken, profileController_1.updateProfile);
//비밀번호 변경 라우트(프로필 쪽)
router.post('/check-password', authMiddleware_1.checkToken, passwdController_1.checkCurrentPw);
router.post('/change-password', authMiddleware_1.checkToken, passwdController_1.changePw);


exports.default = router;
