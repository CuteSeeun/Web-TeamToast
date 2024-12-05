//해당 채팅방의 메시지를 가져오는, 메시지 조회 API

import { Request, Response } from 'express';
import pool from '../config/dbpool'; // 디폴트 익스포트 가져오기
import { RowDataPacket } from 'mysql2'; // 추가
import express, { Router } from 'express';

const router = Router(); // Router 객체 생성

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const rid = req.query.rid; // 클라이언트에서 채널 ID 전달
    console.log('클라이언트에서 받은 rid:', rid);
  
    try {
      const [messages] = await pool.query<RowDataPacket[]>(
        `SELECT mid, content, timestamp, email as user_email, uname as user
         FROM Message m
         JOIN User u ON user_email = email
         WHERE rid = ?
         ORDER BY timestamp ASC;`,
        [rid]
      );
      console.log('쿼리 결과:', messages);
      res.json(messages);
      console.log('해당 채팅 방의 메시지 리스트 가져오기 성공');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '서버 오류 발생.' });
    }
  });
  
  export default router;