import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import pool from '../config/dbpool';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// 카카오 API 응답 타입
interface KakaoTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
}

interface KakaoProfile {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
}

interface KakaoAccount {
    email: string;
    profile: KakaoProfile;
}

interface KakaoUserResponse {
    id: number;
    kakao_account: KakaoAccount;
}

interface User extends RowDataPacket {
    uid: number;
    uname: string;
    email: string;
    social_id: string;
    login_type: string;
    provider: string;
}

interface UserData {
    uid: number;
    uname: string;
    email: string;
}

// 카카오 로그인 URL 생성
const kakaoLogin = (req: Request, res: Response): void => {
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

// 카카오 토큰 처리 및 사용자 정보 저장
const kakaoTokenHandler = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    console.log('Received kakao code:', code);

    try {
        const clientId = 'd0c9831346ea3272b1d4e3fc11176c97';
        const redirectUri = 'http://localhost:8080/oauth';

        console.log('카카오 액세스 토큰 요청 시작');
        const tokenResponse = await axios.post<KakaoTokenResponse>('https://kauth.kakao.com/oauth/token', null, {
            params: { grant_type: 'authorization_code', client_id: clientId, redirect_uri: redirectUri, code },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const { access_token } = tokenResponse.data;
        console.log('카카오 액세스 토큰:', access_token);

        console.log('카카오 사용자 정보 요청 시작');
        const userResponse = await axios.get<KakaoUserResponse>('https://kapi.kakao.com/v2/user/me', {
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

        if (!email || !profile?.nickname) {
            throw new Error('필수 사용자 정보 누락: 이메일 또는 닉네임 없음');
        }

        console.log('DB에서 사용자 조회 시작');
        const [rows] = await pool.query<User[]>(
            'SELECT * FROM User WHERE email = ? AND social_id = ?',
            [email, social_id.toString()]
        );
        const existingUser = rows;
        console.log('DB 조회 결과:', existingUser);

        let userData: UserData;

        if (existingUser.length === 0) {
            console.log('신규 사용자, DB에 추가 시작');
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO User(uname, email, social_id, login_type, provider) VALUES (?, ?, ?, ?, ?)',
                [profile.nickname, email, social_id.toString(), 'social', 'kakao']
            );

            console.log('INSERT 결과:', result);

            userData = {
                uid: result.insertId,
                uname: profile.nickname,
                email,
            };
        } else {
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
        const token = jwt.sign(
            { uid: userData.uid, uname: userData.uname },
            'accessSecretKey',
            { expiresIn: '1h' }
        );

        res.json({ message: '카카오 로그인 성공', token, user: userData });
    } catch (error: any) {
        console.error('카카오 로그인 오류:', error);

        if (error.response) {
            console.error('카카오 API 응답 에러:', error.response.data);
        } else if (error.request) {
            console.error('카카오 API 요청 에러:', error.request);
        } else {
            console.error('요청 설정 에러:', error.message);
        }
        res.status(500).json({ message: '카카오 로그인 실패' });
    }
};

export { kakaoLogin, kakaoTokenHandler };
