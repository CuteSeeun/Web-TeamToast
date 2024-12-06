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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const solapi_1 = require("solapi");
// solapi 메시지 서비스 인스턴스 생성
// 환경 변수에서 api키와 시크릿 키를 가져와 초기화
const messageService = new solapi_1.SolapiMessageService(process.env.COOLSMS_API_KEY, process.env.COOLSMS_SECRET_KEY);
//sms 전송 함수
// 수신 번호와 메시지 내용 받아 sms를 전송하고 결과 반환
const sendSMS = (to, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 디버깅을 위한 인증 정보 로깅
        console.log('Using credentials:', {
            apiKey: process.env.COOLSMS_API_KEY,
            secretKey: process.env.COOLSMS_SECRET_KEY
        });
        // 메시지 데이터 구성
        const messageData = {
            to, // 수신번호
            from: process.env.COOLSMS_SENDER_NUMBER, // 발신번호
            text // 문자내용
        };
        // sms 전송 요청 및 응답 수신
        const response = (yield messageService.send(messageData));
        console.log('SMS sent successfully:', response);
        return response;
    }
    catch (error) {
        console.error('SMS 발송 오류:', error);
        throw error;
    }
});
exports.sendSMS = sendSMS;
