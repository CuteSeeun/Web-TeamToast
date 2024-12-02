import  { Router } from "express";
import  express from "express";
import { checkEmail, getInfo, join, login, logout } from "../controller/userController";
import { kakaoLogin, kakaoTokenHandler } from "../controller/kakaoController";
import { checkPhone, sendPhoneVerification, verifyPhoneCode } from "../controller/phoneController";
import { changePw, checkCurrentPw, findUserPassword, vaildateUser } from "../controller/passwdController";
import { updateProfile } from "../controller/profileController";
import { reAccessToken, RefreshToken } from "../controller/refreshController";
import { checkToken } from "../middlewares/authMiddleware";

// const express = require('express');
const router:Router = express.Router();

// 로그인 회원가입 사용자 유지
router.post('/saveUser',join);
router.post('/loginUser',login);
router.post('/logout',checkToken,logout);
router.get('/me',checkToken,getInfo);

//리프레시 토큰생성
router.post('/refresh', RefreshToken);
//액세스 토큰 재발급
router.post('/refresh/token',reAccessToken);

//카카오 소셜 로그인 라우트
router.get('/kakao-login',kakaoLogin);
router.post('/kakao-token',kakaoTokenHandler);

//이메일 체크 라우트
router.post('/checkEmail',checkEmail);

//휴대폰 인증 관련 라우트
router.post('/checkPhone',checkPhone)
router.post('/auth/sendverification',sendPhoneVerification);
router.post('/auth/verifyPhone',verifyPhoneCode);

//비밀번호 찾기 라우트(로그인,회원가입 쪽)
router.post('/findPass',findUserPassword);
router.post('/vaildaeUser',vaildateUser);

//프로필 변경 라우트
router.post('/user/profile',checkToken,updateProfile );

//비밀번호 변경 라우트(프로필 쪽)
router.post('/check-password',checkToken,checkCurrentPw);
router.post('/change-password',checkToken,changePw);

export default router;