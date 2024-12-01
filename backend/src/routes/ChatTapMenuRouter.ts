import { Request, Response } from 'express';
import pool from '../config/dbpool'; // 디폴트 익스포트 가져오기
import { RowDataPacket } from 'mysql2'; // 추가
import express, { Router } from 'express';

const router = Router(); // Router 객체 생성

router.get('/channel', async (req: Request, res: Response) => {
    const userEmail = req.query.email; // 클라이언트에서 이메일 전달
    console.log('받은 이메일:', userEmail); // 로그 추가
  
    try {
        const [roomData] = await pool.query<RowDataPacket[]>(
          `SELECT Room.rid, Room.rname 
           FROM RoomMembers 
           JOIN Room ON RoomMembers.room_id = Room.rid 
           WHERE RoomMembers.user_email = ?`,
          [userEmail]
        );
    
        res.json(roomData);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류 발생.' });
      }
  });
  
//   module.exports = router;
export default router;