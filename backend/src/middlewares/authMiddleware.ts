import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    uid: number;
    uname: string;
    email: string;
}

export const checkToken = (req:Request , res:Response, next: NextFunction):void=>{
    const token = req.headers.authorization?.split(' ')[1];
    // console.log("Authorization Header Received:", req.headers.authorization);
    // console.log('Extracted token:', token);

    if(!token){
       res.status(401).json({message:'토큰이 없습니다.'})
        return;
    }

    try {
        const decoded = jwt.verify(token,'accessSecretKey') as JwtPayload;
        // console.log('Decoded token:', decoded);
        
        //req.user 에 토큰에서 가져온 정보 저장함
        req.user = {
            uid:decoded.uid,
            uname:decoded.uname,
            email:decoded.email
        }
        console.log(req.user);
        next();
    } catch (error) {
        console.error('토큰 검증 오류:', error);
        // 구체적인 에러 메시지 제공
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ 
                message: '유효하지 않은 토큰입니다.',
                error: error.message 
            });
        } else {
            res.status(401).json({ message: '토큰 검증 중 오류가 발생했습니다.' });
        }
        
    }
}
