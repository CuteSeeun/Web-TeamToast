import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Pool, RowDataPacket } from 'mysql2/promise';
import axios from 'axios';
import pool from '../config/dbpool';

// 인터페이스 정의
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

const kakaoLogin = (req: Request, res: Response): void => {
    const redirectUri = process.env.KAKAO_REDIRECT_URI;
    const clientId = process.env.KAKAO_REST_API_KEY;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    
    res.json({ redirectUrl: kakaoAuthUrl });
};

const kakaoTokenHandler = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    console.log('Received kakao code:', req.body.code);
    
    try {
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

        const userResponse = await axios.get<KakaoUserResponse>('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        
        const kakaoUser = userResponse.data;
        const { id: social_id, kakao_account } = kakaoUser;
        const { email, profile } = kakao_account;

        const [existingUser] = await pool.query<User[]>(
            'SELECT * FROM User WHERE email = ? AND social_id = ?',
            [email, social_id.toString()]
        );
        
        let userData: UserData;
        
        if (existingUser.length === 0) {
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
            userData = {
                id: existingUser[0].id,
                name: existingUser[0].name,
                email: existingUser[0].email
            };
        }

        if (!userData.id || !userData.name) {
            throw new Error('Invalid User data');
        }
        
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