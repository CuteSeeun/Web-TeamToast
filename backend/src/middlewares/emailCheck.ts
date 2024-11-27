import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/dbpool';

// DB 연결

// 타입 정의
interface EmailCheckRequest {
  email: string;
}

interface EmailCheckResponse {
  isAvailable: boolean;
}

// DB의 user 테이블 데이터 타입
interface UserRow extends RowDataPacket {
  email: string;
  // 필요한 다른 user 테이블 필드들 추가
}

export  const checkEmail = async (
  req: Request<{}, {}, EmailCheckRequest>,
  res: Response<EmailCheckResponse>
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
