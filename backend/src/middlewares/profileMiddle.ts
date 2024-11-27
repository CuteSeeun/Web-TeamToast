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

export const updateProfile = async(req: ProfileRequest, res: Response) =>{
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({
            success:false,
            message:'인증 필요'
        });
    }
    try {
        const decoded = jwt.verify(token,'secretKey') as JwtPayload;
        const {uname , email} = req.body;

        const query = `
        update User set uname = ? , email = ? where uid = ?
        `;

        const [result] = await pool.query<ResultSetHeader>(
            query,[uname,email,decoded.uid]);

        if(result.affectedRows > 0) {

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