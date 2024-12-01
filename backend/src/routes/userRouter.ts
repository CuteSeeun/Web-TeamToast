import  { Router } from "express";
import  express from "express";
import { checkEmail, getInfo, join, login } from "../controller/userController";
import { kakaoLogin, kakaoTokenHandler } from "../controller/kakaoController";
import { checkPhone, sendPhoneVerification, verifyPhoneCode } from "../controller/phoneController";
import { changePw, checkCurrentPw, findUserPassword, vaildateUser } from "../controller/passwdController";
import { updateProfile } from "../controller/profileController";

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

//비밀번호 찾기 라우트(로그인,회원가입 쪽)
router.post('/findPass',findUserPassword);
router.post('/vaildaeUser',vaildateUser);

//프로필 변경 라우트
router.post('/user/profile',updateProfile as express.RequestHandler );

//비밀번호 변경 라우트(프로필 쪽)
router.post('/check-password',checkCurrentPw);
router.post('/change-password',changePw);

export default router;