import { Request, Response } from 'express'; // Express에서 Request, Response 타입 가져오기
import { RowDataPacket, PoolConnection } from 'mysql2/promise'; // mysql2의 Pool 타입 정의
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/dbpool'; // 기존 db 연결 모듈 사용

interface UserRow extends RowDataPacket {
    uid: number;
    uname: string;
    email: string;
    passwd: string;
    tel: string;
  }

// JWT Payload 타입 정의
interface JwtPayload {
  uid: number;
  uname: string;
  email:string; // 스페이스 때문에 email 추가
}

// 회원가입 함수
export const join = async (req: Request, res: Response): Promise<void> => {
  const { name, email, userpw, tel } = req.body as {
    name: string;
    email: string;
    userpw: string;
    tel: string;
  };

  const connection:PoolConnection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const hashPw = await bcrypt.hash(userpw, 10);
    // 사용자 정보 저장
    const [userResult]:any = await connection.query(
      'INSERT INTO User(uname, email, passwd, tel) VALUES (?, ?, ?, ?)',
      [name, email, hashPw, tel]
    );
    await connection.commit();
    res.status(201).json({ message: '회원가입 성공' });

  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({ message: '회원가입 실패' });
    await connection.rollback();
  }finally{
    connection.release();
  }
};

// 로그인 함수
export const login = async (req: Request, res: Response): Promise<void> => {
  
  const { useremail, userpw } = req.body;

  try {

    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM User WHERE email = ?',
      [useremail]
    );

    if (rows.length === 0) {
      res.status(401).json({ message: '사용자 없음' });
      return;
    }

    const user = rows[0];

    const isPw = await bcrypt.compare(userpw, user.passwd);

    if (!isPw) {
      res.status(401).json({ message: '비밀번호 틀림' });
      return;
    }

    const accessToken = jwt.sign(
      { uid: user.uid,
        uname: user.uname,
        email:user.email 
      },
      'accessSecretKey',
      { expiresIn: '15m' }
    );

     // 기존 리프레시 토큰 삭제
     await pool.query(
      'DELETE FROM RefreshTokens WHERE user_id = ?',
      [user.uid]
    );

    const refreshToken = jwt.sign(
      {},
      'refreshSecretKey',
      { expiresIn: '15d' }
  );

    await pool.query(
      `INSERT INTO RefreshTokens (user_id, refresh_token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 DAY))`,
      [user.uid, refreshToken]
  );
  
    res.json({
      message: '로그인 성공',
      accessToken,
      // refreshToken,
      user: {
        uid: user.uid,
        uname: user.uname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '로그인 중 오류 발생' });
  }
};

//----------------------------------------------------------------------------------------

//로그아웃 함수
export const logout = async (req:Request , res:Response):Promise<void> =>{
  try {
    const userId = req.user?.uid;
    
    if(userId){
      await pool.query('delete from RefreshTokens where user_id = ?',[userId]);
    }
    res.status(200).json({message:'로그아웃 성공'});
  } catch (error) {
    console.error('로그아웃 처리 중 에러:', error);
    res.status(500).json({ message: '로그아웃 처리 중 에러가 발생했습니다.' });
  }
}

//--------------------------------------------------------------------------------
// 사용자 정보 조회 (토큰 검증) 함수 // 새로고침

/* 
요청 받은 헤더의 Authorization에서 토큰을 추출하고
토큰이 없으면 리턴시킴

토큰 검증 및 디코딩을함 (jwt.verify로 토큰 유효성 검사)
디코딩 된 uid로 db에서 uid uname email 값을 가져옴

*/


export const getInfo = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: '토큰이 없습니다.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'accessSecretKey') as JwtPayload;

    const [rows] = await pool.query<UserRow[]>(
      'SELECT uid, uname, email FROM User WHERE uid = ?',
      [decoded.uid]
      /* 토큰에는 최소한의 정보만 담아서 사용함 보통 uid만 씀
        토큰에서 먼저 uid만 추출하고 그 uid로 나머지를 조회하는게 안전함
      */
    );

    if (rows.length === 0) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const user = rows[0];
    res.json({ user });
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    res.status(401).json({ message: '유효하지 않은 토큰' });
  }
};

 // ------------------------------------------------------------------------------
//이메일 중복확인 체크 하는 함수

  //RowDataPacket을 extends 해서 mysql이랑 호환성을 보장
  interface UserRow extends RowDataPacket {
    email: string;
  }
  
  export  const checkEmail = async (
    req: Request<{}, {}, {email:string}>,
    res: Response<{isAvailable:boolean}>
  ): Promise<void> => {
    const { email } = req.body;
  
    try {
      const [result] = await pool.query<UserRow[]>(
        'SELECT * FROM User WHERE email = ?',
        [email]
      );
  
      res.json({ isAvailable: result.length === 0 });
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
      res.status(500).json({ isAvailable: false });
    }
  };
