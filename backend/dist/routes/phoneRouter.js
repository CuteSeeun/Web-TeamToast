"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const phoneMiddle_1 = require("../middlewares/phoneMiddle");
const express = require('express');
const router = express.Router();
//휴대폰 인증 관련 라우트
router.post('/checkPhone', phoneMiddle_1.checkPhone);
router.post('/auth/sendverification', phoneMiddle_1.sendPhoneVerification);
router.post('/auth/verifyPhone', phoneMiddle_1.verifyPhoneCode);
exports.default = router;
