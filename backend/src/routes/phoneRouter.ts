import { Router } from "express";
import { checkPhone, sendPhoneVerification, verifyPhoneCode } from "../middlewares/phoneMiddle";

const express = require('express');
const router:Router = express.Router();



//휴대폰 인증 관련 라우트
router.post('/checkPhone',checkPhone)
router.post('/auth/sendverification',sendPhoneVerification);
router.post('/auth/verifyPhone',verifyPhoneCode);

export default router;