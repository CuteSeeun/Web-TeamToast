import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Pool, RowDataPacket } from 'mysql2/promise';
import axios from 'axios';
import pool from '../config/dbpool';

// 카카오api 응답 타입
interface KakaoTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
}

// 카카오 프로필 정보 타입
interface KakaoProfile {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
}

// 카카오 계정 정보 타입
interface KakaoAccount {
    email: string;
    profile: KakaoProfile;
}

// 카카오 사용자 응답 타입
interface KakaoUserResponse {
    id: number;
    kakao_account: KakaoAccount;
}

// User 인터페이스를 RowDataPacket을 확장하도록 수정
interface User extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    social_id: string;
    login_type: string;
    provider: string;
}

// UserData 타입 추가
interface UserData {
    id: number;
    name: string;
    email: string;
}

//카카오 로그인 url 생성 및 반환
const kakaoLogin = (req: Request, res: Response): void => {
    // 환경변수에서 설정값 가져옴
    const redirectUri = process.env.KAKAO_REDIRECT_URI;
    const clientId = process.env.KAKAO_REST_API_KEY;
    // 카카오 인증 url 생성
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    
    res.json({ redirectUrl: kakaoAuthUrl });
};

// 카카오 토큰 처리 및 사용자 정보 저장
const kakaoTokenHandler = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    console.log('Received kakao code:', req.body.code);
    
    try {
        //카카오 액세스 토큰 저장
        const tokenResponse = await axios.post<KakaoTokenResponse>('https://kauth.kakao.com/oauth/token', null, {
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
        const userResponse = await axios.get<KakaoUserResponse>('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        
        const kakaoUser = userResponse.data;
        const { id: social_id, kakao_account } = kakaoUser;
        const { email, profile } = kakao_account;

        // DB에서 기존 사용자 확인
        const [existingUser] = await pool.query<User[]>(
            'SELECT * FROM User WHERE email = ? AND social_id = ?',
            [email, social_id.toString()]
        );
        
        let userData: UserData;
        
        //신규 사용자면 db에 저장
        if (existingUser.length === 0) {
            //새 사용자 생성
            const [result] = await pool.query<any>(
                'INSERT INTO User(uname, email, social_id, login_type, provider) VALUES (?, ?, ?, ?, ?)',
                [profile.nickname, email, social_id.toString(), 'social', 'kakao']
            );
            userData = {
                id: result.insertId,
                name: profile.nickname,
                email
            };
        } else {
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
        const token = jwt.sign(
            { id: userData.id, name: userData.name },
            process.env.JWT_SECRET_KEY || 'secretKey',
            { expiresIn: '1h' }
        );
        
        res.json({ message: '카카오 로그인 성공', token, user: userData });

    } catch (error : any) {
        console.error("카카오 로그인 오류:", error);
       
        if (error.response) {
            // 카카오 API 응답 에러
            console.error("카카오 API 응답 에러:", {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
        } else if (error.request) {
            // 요청은 보냈지만 응답을 받지 못한 경우
            console.error("카카오 API 요청 에러:", error.request);
        } else {
            // 요청 설정 과정에서 에러 발생
            console.error("요청 설정 에러:", error.message);
        }

        console.error("환경변수 확인:", {
            KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY?.slice(0, 5) + "...",
            KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
            code: code ? code.slice(0, 5) + "..." : "없음"
        });

        res.status(500).json({ message: '카카오 로그인 실패' });


    }
};

export {
    kakaoLogin,
    kakaoTokenHandler,
};