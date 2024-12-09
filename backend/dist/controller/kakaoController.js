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
// 카카오 로그인 URL 생성
const kakaoLogin = (req, res) => {
    const redirectUri = 'http://localhost:8080/oauth';
    const clientId = 'd0c9831346ea3272b1d4e3fc11176c97';
    if (!redirectUri || !clientId) {
        console.error('환경 변수 확인:', { redirectUri, clientId });
        res.status(500).json({ message: 'KAKAO 환경 변수가 설정되지 않았습니다.' });
        return;
    }
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    console.log('Kakao 로그인 redirectUrl:', kakaoAuthUrl);
    res.json({ redirectUrl: kakaoAuthUrl });
};
exports.kakaoLogin = kakaoLogin;
// 카카오 토큰 처리 및 사용자 정보 저장
const kakaoTokenHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    console.log('Received kakao code:', code);
    try {
        const clientId = 'd0c9831346ea3272b1d4e3fc11176c97';
        const redirectUri = 'http://localhost:8080/oauth';
        console.log('카카오 액세스 토큰 요청 시작');
        const tokenResponse = yield axios_1.default.post('https://kauth.kakao.com/oauth/token', null, {
            params: { grant_type: 'authorization_code', client_id: clientId, redirect_uri: redirectUri, code },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const { access_token } = tokenResponse.data;
        console.log('카카오 액세스 토큰:', access_token);
        console.log('카카오 사용자 정보 요청 시작');
        const userResponse = yield axios_1.default.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const kakaoUser = userResponse.data;
        const { id: social_id, kakao_account } = kakaoUser;
        const { email, profile } = kakao_account;
        console.log('카카오 사용자 데이터:', {
            id: social_id,
            email,
            nickname: profile.nickname,
        });
        if (!email || !(profile === null || profile === void 0 ? void 0 : profile.nickname)) {
            throw new Error('필수 사용자 정보 누락: 이메일 또는 닉네임 없음');
        }
        console.log('DB에서 사용자 조회 시작');
        const [rows] = yield dbpool_1.default.query('SELECT * FROM User WHERE email = ? AND social_id = ?', [email, social_id.toString()]);
        const existingUser = rows;
        console.log('DB 조회 결과:', existingUser);
        let userData;
        if (existingUser.length === 0) {
            console.log('신규 사용자, DB에 추가 시작');
            const [result] = yield dbpool_1.default.query('INSERT INTO User(uname, email, social_id, login_type, provider) VALUES (?, ?, ?, ?, ?)', [profile.nickname, email, social_id.toString(), 'social', 'kakao']);
            console.log('INSERT 결과:', result);
            userData = {
                uid: result.insertId,
                uname: profile.nickname,
                email,
            };
        }
        else {
            console.log('기존 사용자, 데이터 반환');
            userData = {
                uid: existingUser[0].uid,
                uname: existingUser[0].uname,
                email: existingUser[0].email,
            };
        }
        console.log('생성된 사용자 데이터:', userData);
        if (!userData.uid || !userData.uname) {
            throw new Error('Invalid User data');
        }
        console.log('JWT 토큰 생성');
        const token = jsonwebtoken_1.default.sign({ uid: userData.uid, uname: userData.uname }, 'accessSecretKey', { expiresIn: '1h' });
        res.json({ message: '카카오 로그인 성공', token, user: userData });
    }
    catch (error) {
        console.error('카카오 로그인 오류:', error);
        if (error.response) {
            console.error('카카오 API 응답 에러:', error.response.data);
        }
        else if (error.request) {
            console.error('카카오 API 요청 에러:', error.request);
        }
        else {
            console.error('요청 설정 에러:', error.message);
        }
        res.status(500).json({ message: '카카오 로그인 실패' });
    }
});
exports.kakaoTokenHandler = kakaoTokenHandler;
