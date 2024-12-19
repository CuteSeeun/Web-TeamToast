import { Request, Response } from 'express';
import {RowDataPacket} from 'mysql2/promise'
import pool from '../config/dbpool';
import jwt from 'jsonwebtoken';


interface UserRow extends RowDataPacket {
    uid: number;
    uname: string;
    email: string;
    passwd: string;
    tel: string;
  }


export const RefreshToken =async(req:Request , res:Response):Promise<void>=>{
    const {uid} = req.body;

    try {
        //리프레시 토큰 생성
        const refreshToken = jwt.sign({},'refreshSecretKey',{expiresIn:'15d'});
        
        //db 저장
        await pool.query(
            `insert into RefreshTokens (user_id, refresh_token, expires_at) values (?, ?, DATE_ADD(NOW(), INTERVAL 15 DAY))`,
            [uid, refreshToken]
        );
        res.status(201).json({refreshToken});
    } catch (error) {
        console.error('리프레시 토큰 발급 중 오류 : ',error);
        res.status(500).json({message:'리프레시 토큰 발급 실패'});
    }
};

export const reAccessToken = async(req:Request,res:Response):Promise<void>=>{
    
    try {
        const userId = req.body.uid || req.user?.uid; // 미들웨어 또는 클라이언트에서 uid 가져옴
        
        if(!userId){
            res.status(401).json({message:'사용자 정보가 없습니다.'});
            return;
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            'select refresh_token from RefreshTokens where user_id = ?',
            [userId]
        )

        if(!rows.length){
           res.status(403).json({message : '유효하지않은 리프레시 토큰'})
           return;
        }

        const refreshToken = rows[0].refresh_token;

        try {
            jwt.verify(refreshToken,'refreshSecretKey');
        } catch (error) {
            console.error('리프레시 토큰 검증 실패 :',error);
            res.status(403).json({ message: '유효하지 않은 리프레시 토큰입니다.' });
            return;
        }

        const [userInfo] = await pool.query<UserRow[]>(
            'SELECT uid, uname, email FROM User WHERE uid = ?',
            [userId]
        );

        

        const accessToken = jwt.sign(
            {
                uid : userId,
                uname: userInfo[0].uname,
                email : userInfo[0].email
            },
            'accessSecretKey',
            {expiresIn:'15m'}
        );
        res.status(200).json({
            accessToken,
            user: {
                uid: userInfo[0].uid,
                uname: userInfo[0].uname,
                email: userInfo[0].email
            }
        });

    } catch (error) {
        console.error('리프레시 토큰 검증 실패:', error);
        res.status(403).json({ message: '리프레시 토큰 검증 실패' });
    }
}