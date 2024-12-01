import { Request, Response } from 'express'; // Express에서 Request, Response 타입 가져오기
import { RowDataPacket } from 'mysql2/promise'; // mysql2의 Pool 타입 정의
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
}

// 회원가입 함수
export const join = async (req: Request, res: Response): Promise<void> => {
  const { name, email, userpw, tel } = req.body as {
    name: string;
    email: string;
    userpw: string;
    tel: string;
  };

  const connection = await pool.getConnection();

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
    console.log('DB에서 가져온 사용자:', user);

    const isPw = await bcrypt.compare(userpw, user.passwd);
    if (!isPw) {
      res.status(401).json({ message: '비밀번호 틀림' });
      return;
    }

    const token = jwt.sign(
      { uid: user.uid, uname: user.uname },
      'secretKey',
      { expiresIn: '1h' }
    );
    // 리프레시 토큰 사용하려면 두번째 토큰 생성 (추후 예정)
    // const token2 = jwt.sign(
    //   { uid: user.uid, uname: user.uname },
    //   'secretKey',
    //   { expiresIn: '1h' }
    // );

    res.json({
      message: '로그인 성공',
      token,
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

// 사용자 정보 조회 (토큰 검증) 함수 // 새로고침
export const getInfo = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: '토큰이 없습니다.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'secretKey') as JwtPayload;

    const [rows] = await pool.query<UserRow[]>(
      'SELECT uid, uname, email FROM User WHERE uid = ?',
      [decoded.uid]
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
