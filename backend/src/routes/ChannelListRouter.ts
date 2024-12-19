//채널 목록 가져오는  "채널 목록 조회 API"
import { Request, Response } from 'express';
import pool from '../config/dbpool'; // 디폴트 익스포트 가져오기
import { RowDataPacket, ResultSetHeader } from 'mysql2'; // 추가
import express, { Router } from 'express';

const router = Router(); // Router 객체 생성

//채팅 목록 가져오기
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const userEmail = req.query.email; // 클라이언트에서 이메일 전달
  const spaceId = req.query.space_id; // 클라이언트에서 space_id 전달

  try {
    const [roomData] = await pool.query<RowDataPacket[]>(
      `SELECT Room.rid, Room.rname
       FROM RoomMembers
       JOIN Room ON RoomMembers.room_id = Room.rid
       WHERE RoomMembers.user_email = ? AND RoomMembers.space_id = ?`,
      [userEmail, spaceId]
    );

    res.json(roomData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류 발생.' });
  }
});

//채팅방 나가기
router.delete('/exit', async (req: Request, res: Response): Promise<void> => {
  const { email, rid } = req.body;

  if (!email || !rid) {
    res.status(400).json({ error: 'email과 rid는 필수입니다.' });
    return;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM RoomMembers WHERE user_email = ? AND room_id = ?',
      [email, rid]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: '채팅방에서 성공적으로 퇴장했습니다.' });
    } else {
      res.status(404).json({ error: '레코드를 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.error('채팅방 나가기 오류:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});


//   module.exports = router;
export default router;