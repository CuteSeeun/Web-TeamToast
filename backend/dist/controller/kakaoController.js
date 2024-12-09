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
exports.kakaoTokenHandler = exports.kakaoLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const dbpool_1 = __importDefault(require("../config/dbpool"));
//카카오 로그인 url 생성 및 반환
const kakaoLogin = (req, res) => {
    // 환경변수에서 설정값 가져옴
    const redirectUri = process.env.KAKAO_REDIRECT_URI;
    const clientId = process.env.KAKAO_REST_API_KEY;
    // 카카오 인증 url 생성
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    res.json({ redirectUrl: kakaoAuthUrl });
};
exports.kakaoLogin = kakaoLogin;
// 카카오 토큰 처리 및 사용자 정보 저장
const kakaoTokenHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { code } = req.body;
    console.log('Received kakao code:', req.body.code);
    try {
        //카카오 액세스 토큰 저장
        const tokenResponse = yield axios_1.default.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_REST_API_KEY,
                redirect_uri: process.env.KAKAO_REDIRECT_URI,
                code,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const { access_token } = tokenResponse.data;
        // 카카오 사용자 정보 저장
        const userResponse = yield axios_1.default.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const kakaoUser = userResponse.data;
        const { id: social_id, kakao_account } = kakaoUser;
        const { email, profile } = kakao_account;
        // DB에서 기존 사용자 확인
        const [existingUser] = yield dbpool_1.default.query('SELECT * FROM User WHERE email = ? AND social_id = ?', [email, social_id.toString()]);
        let userData;
        //신규 사용자면 db에 저장
        if (existingUser.length === 0) {
            //새 사용자 생성
            const [result] = yield dbpool_1.default.query('INSERT INTO User(uname, email, social_id, login_type, provider) VALUES (?, ?, ?, ?, ?)', [profile.nickname, email, social_id.toString(), 'social', 'kakao']);
            userData = {
                id: result.insertId,
                name: profile.nickname,
                email
            };
        }
        else {
            //기존 사용자 데이터 사용
            userData = {
                id: existingUser[0].id,
                name: existingUser[0].name,
                email: existingUser[0].email
            };
        }
        // 데이터 유효성 검사
        if (!userData.id || !userData.name) {
            throw new Error('Invalid User data');
        }
        //jwt 토큰 생성
        const token = jsonwebtoken_1.default.sign({ id: userData.id, name: userData.name }, process.env.JWT_SECRET_KEY || 'accessSecretKey', { expiresIn: '1h' });
        res.json({ message: '카카오 로그인 성공', token, user: userData });
    }
    catch (error) {
        console.error("카카오 로그인 오류:", error);
        if (error.response) {
            // 카카오 API 응답 에러
            console.error("카카오 API 응답 에러:", {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
        }
        else if (error.request) {
            // 요청은 보냈지만 응답을 받지 못한 경우
            console.error("카카오 API 요청 에러:", error.request);
        }
        else {
            // 요청 설정 과정에서 에러 발생
            console.error("요청 설정 에러:", error.message);
        }
        console.error("환경변수 확인:", {
            KAKAO_REST_API_KEY: ((_a = process.env.KAKAO_REST_API_KEY) === null || _a === void 0 ? void 0 : _a.slice(0, 5)) + "...",
            KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
            code: code ? code.slice(0, 5) + "..." : "없음"
        });
        res.status(500).json({ message: '카카오 로그인 실패' });
    }
});
exports.kakaoTokenHandler = kakaoTokenHandler;
