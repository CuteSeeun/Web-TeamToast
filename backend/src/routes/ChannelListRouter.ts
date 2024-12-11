//채널 목록 가져오는  "채널 목록 조회 API"
import { Request, Response } from 'express';
import pool from '../config/dbpool'; // 디폴트 익스포트 가져오기
import { RowDataPacket } from 'mysql2'; // 추가
import express, { Router } from 'express';

const router = Router(); // Router 객체 생성

router.get('/', async (req: Request, res: Response): Promise<void> => {
  console.log('채팅 채널 목록 가져오는 서버 들어옴');
  const userEmail = req.query.email; // 클라이언트에서 이메일 전달
  const spaceId = req.query.space_id; // 클라이언트에서 space_id 전달
  console.log('클라이언트에서 받은 이메일과 스페이스id:', userEmail, spaceId); // 로그 추가

  try {
    const [roomData] = await pool.query<RowDataPacket[]>(
      `SELECT Room.rid, Room.rname
       FROM RoomMembers
       JOIN Room ON RoomMembers.room_id = Room.rid
       WHERE RoomMembers.user_email = ? AND RoomMembers.space_id = ?`,
      [userEmail, spaceId]
    );

    res.json(roomData);
    console.log('채팅 채널 목록 가져오기 성공');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류 발생.' });
  }
});

//   module.exports = router;
export default router;