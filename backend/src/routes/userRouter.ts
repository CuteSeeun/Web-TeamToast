import  { Router } from "express";
import  express from "express";
import { checkEmail, getInfo, join, login } from "../controller/userController";
import { kakaoLogin, kakaoTokenHandler } from "../controller/kakaoController";
import { checkPhone, sendPhoneVerification, verifyPhoneCode } from "../controller/phoneController";

// const express = require('express');
const router:Router = express.Router();

// 로그인 회원가입 사용자 유지
router.post('/saveUser',join);
router.post('/loginUser',login);
router.get('/me',getInfo);

//카카오 소셜 로그인 라우트
router.get('/kakao-login',kakaoLogin);
router.post('/kakao-token',kakaoTokenHandler);

//이메일 체크 라우트
router.post('/checkEmail',checkEmail);

//휴대폰 인증 관련 라우트
router.post('/checkPhone',checkPhone)
router.post('/auth/sendverification',sendPhoneVerification);
router.post('/auth/verifyPhone',verifyPhoneCode);


export default router;