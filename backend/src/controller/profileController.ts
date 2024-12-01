import {  Request, Response, RequestHandler } from 'express';
import { ResultSetHeader } from 'mysql2/promise';
import jwt, { JwtPayload } from 'jsonwebtoken';
import pool from '../config/dbpool';

interface ProfileRequest extends Request {
    body: {
        uname: string;
        email: string;
    }
}

// 프로필 업데이트 함수
export const updateProfile = async(req: ProfileRequest, res: Response):Promise<void> =>{
    //jwt 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];

    // 토큰이 없는 경우 인증 오류 반환
    if(!token){
        res.status(401).json({
            success:false,
            message:'인증 필요'
        });
        return;
    }
    try {
        // 토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token,'secretKey') as JwtPayload;
        const {uname , email} = req.body;

        // 사용자 정보 업데이트
        const query = `
        update User set uname = ? , email = ? where uid = ?
        `;

        // 쿼리 실행 및 결과 확인
        const [result] = await pool.query<ResultSetHeader>(
            query,[uname,email,decoded.uid]);

        if(result.affectedRows > 0) {
            // 업데이트 성공 시 최신 사용자 정보 조회
            const [row] = await pool.query(
                'SELECT uid, uname, email FROM User WHERE uid = ?',
                [decoded.uid]
            );
            res.json({
                success : true,
                message:'프로필이 성공적으로 수정되었습니다.',
                user: row // 업데이트 유저 정보
            })
        }else{
            res.status(404).json({
                success:false,
                message:'사용자를 찾을 수 없습니다.'
            })
        }
    } catch (error) {
    console.error('프로필 수정 에러 : ',error);
    res.status(500).json({
        success:false,
        message:'서버 오류가 발생했습니다.'
    })
           
    }
}