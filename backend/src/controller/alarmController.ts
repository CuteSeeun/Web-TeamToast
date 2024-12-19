import { Request, Response } from "express";
import pool from "../config/dbpool";
import { RowDataPacket } from "mysql2";


export const getIssueAlarm = async(req:Request,res:Response) =>{
    const userEmail = req.query.userEmail as string;

    // 로그인한 유저 이메일 프론트에서 받아옴
    // 그래야 로그인한 사람한테 알림을 줄수있으니
    try {
        const [notification] = await pool.execute(
           `SELECT 
          n.nid AS isid,
          n.timestamp AS createdAt,
          n.isread,
          n.issue_id,
          n.user AS manager,
          p.pid AS project_id, 
          p.pname AS projectTitle,
          i.title AS issueTitle,
          i.detail AS issueDetail
       FROM 
          Notification n
       JOIN 
          Issue i ON n.issue_id = i.isid
       JOIN 
          Project p ON i.project_id = p.pid
       WHERE 
          n.user = ? AND n.isread = 0`, // 읽지 않은 알림만 가져옴
                [userEmail]
        );
        // 이메일로 비교해서 같은 이메일을 가진사람의 정보값을 저장해서 다시 보냄
        res.json(notification);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
}

//알림 읽음 처리
export const NotificationRead = async(req:Request,res:Response)=>{
    const {issueId } = req.body; // 알림 ID

    try {
        await pool.execute(
            `update Notification set isread = 1 where issue_id = ?`, [issueId ]
        );
        res.status(200).json({message:'알림 읽음 처리되었습니다.'});
    } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
    res.status(500).json({ message: '알림 읽음 처리 중 오류가 발생했습니다.' });
    }
}
