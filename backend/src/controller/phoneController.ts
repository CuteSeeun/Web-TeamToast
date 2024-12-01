import { Request, Response } from 'express';
import { PoolConnection } from 'mysql2/promise';
import { sendSMS } from './smsServiceController';
import pool from '../config/dbpool';

// 6자리 랜덤 인증번호 생성 함수
const generateVerificationCode = (): string => 
   Math.floor(100000 + Math.random() * 900000).toString();

// sms 인증번호 발송
const sendPhoneVerification = async (
   req: Request<{}, {}, {phoneNumber:string}>,
   res: Response
): Promise<void> => {
   const connection: PoolConnection = await pool.getConnection();
   try {
       await connection.beginTransaction();

       const { phoneNumber } = req.body;
       const verificationCode = generateVerificationCode();

       // 기존 인증번호 삭제
       await connection.query(
           'DELETE FROM verification WHERE tel = ?',
           [phoneNumber]
       );
       
       // 새 인증번호 저장
       await connection.query(
           `INSERT INTO verification (tel, code)
           VALUES (?, ?)`,
           [phoneNumber, verificationCode]
       );

       // SMS 발송
       await sendSMS(phoneNumber, `인증번호는 [${verificationCode}] 입니다.`);

       // db 저장
       await connection.commit();
       res.json({ success: true, message: '인증번호가 발송되었습니다.' });

   } catch (error) {
       // db 삭제
       await connection.rollback();
       console.error('sms 발송 실패 : ', error);
       res.status(500).json({ message: '인증번호 발송 실패' });
   } finally {
       connection.release();
   }
}

//인증번호 확인 함수
const verifyPhoneCode = async (
   req: Request<{}, {}, {phoneNumber:string,code:string}>,
   res: Response
): Promise<void> => {
   const connection: PoolConnection = await pool.getConnection();

   try {
       await connection.beginTransaction();

       const { phoneNumber, code } = req.body;
       console.log('받은 데이터:', { phoneNumber, code }); 

       //db에서 인증번호 확인
       const [rows] = await connection.query<any[]>(
           `SELECT * FROM verification
           WHERE tel = ? AND code = ? LIMIT 1`,
           [phoneNumber, code]
       );

       if (rows.length === 0) {
           res.status(400).json({
               success: false,
               message: '유효하지 않거나 만료된 인증번호 입니다.'
           });
           return;
       }
       // 인증 완료되면 삭제함
       await connection.query(
           'DELETE FROM verification WHERE tel = ?',
           [phoneNumber]
       );

       await connection.commit();
       res.json({ success: true, message: '인증이 완료되었습니다.' });

   } catch (error) {
       await connection.rollback();
       console.error('인증 확인 실패 :', error);
       res.status(500).json({ success: false, message: '인증확인에 실패했습니다.' });
   } finally {
       connection.release();
   }
}

// 핸드폰 중복 체크
const checkPhone = async (
   req: Request<{}, {}, {tel:string}>, 
   res: Response
): Promise<void> => {
   try {
       const { tel } = req.body;

       // db에서 핸드폰 있는지 체크
       const [rows] = await pool.query<any[]>(
           'SELECT * FROM User WHERE tel = ?',
           [tel]
       );
       
       if (rows.length > 0) {
           res.json({ isAvailable: false, message: '이미 사용중인 휴대폰 번호입니다.' });
       } else {
           res.json({ isAvailable: true, message: '사용 가능한 휴대폰 번호입니다.' });
       }
   } catch (error) {
        console.error('에러 발생:', error);
       res.status(500).json({ message: '서버 오류가 발생했습니다.' });
   }
}

export {
   sendPhoneVerification,
   verifyPhoneCode,
   checkPhone
}