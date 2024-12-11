import { Request, Response } from "express";
import pool from "../config/dbpool";
import { RowDataPacket } from "mysql2";


export const getIssueAlarm = async(req:Request,res:Response) =>{
    const userEmail = req.query.userEmail as string;
    console.log('알람 컨트롤러 이메일',userEmail);
    

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
    const {notiId} = req.body; // 알림 ID

    try {
        await pool.execute(
            `update Notification set isread = 1 where nid = ?`, [notiId]
        );
        res.status(200).json({message:'알림 읽음 처리되었습니다.'});
    } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
    res.status(500).json({ message: '알림 읽음 처리 중 오류가 발생했습니다.' });
    }
}

// // 이슈가 생성 또는 업데이트되면 알림처리함
// export const updateAlarm = async(req:Request,res:Response) =>{
//     const {isid, title, detail, type, status, sprint_id, project_id, manager, created_by, priority } = req.body;
//     // 이슈 정보를 프론트에서 받아옴
//     try {
//         const [existingIssues] = await pool.execute<RowDataPacket[]>(
//             `select manager from Issue where isid = ?`,
//             [isid]
//         );



//         if(existingIssues.length > 0){
//             const  existingIssue = existingIssues[0]; // 기존 이슈 데이터
//             // 기존 담당자와 새 담당자가 다를경우 새 담당자에게 알림 발송함
//             if(existingIssue.manager !== manager){
//                 await pool.execute(
//                     `update Issue set title = ?, detail = ?,type = ?, status = ?, sprint_id = ?, manager = ?, priority = ? WHERE isid = ?`,
//                     [title, detail, type, status, sprint_id, manager, priority, isid]
//                 )
//             }

//             await pool.execute(
//                 `
//                 UPDATE Issue 
//                 SET title = ?, detail = ?, type = ?, status = ?, sprint_id = ?, manager = ?, priority = ? 
//                 WHERE isid = ?
//                 `,
//                 [title, detail, type, status, sprint_id, manager, priority, isid]
//             );

//         }else{
//             // 새로운 이슈를 생성
//             await pool.execute(
//                 `insert into Issue (isid, title, detail, type, status, sprint_id, project_id, manager, created_by, priority)
//                 values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//                 `,[isid, title, detail, type, status, sprint_id, project_id, manager, created_by, priority]
//             )
//         }

//         // 현재 로그인한 유저의 이메일을 통해 알림 데이터 반환
//         const [notifications] = await pool.execute<RowDataPacket[]>(
//             ` SELECT 
//                 i.isid, 
//                 i.title AS issueTitle, 
//                 i.detail AS issueDetail, 
//                 i.project_id, 
//                 p.pname AS projectTitle, 
//                 i.manager
//             FROM 
//                 Issue i
//             JOIN 
//                 Project p ON i.project_id = p.pid
//             WHERE 
//                 i.manager = ?
//             `,[manager] // 프론트엔드에서 전달된 현재 로그인한 유저 이메일
//         );
//         res.json(notifications); // 해당 알림 데이터를 반환

//     } catch (error) {
//         console.error("이슈 업데이트 중 오류 발생:", error);
//         res.status(500).json({ message: "이슈 업데이트 중 오류가 발생했습니다." });
//     }

// }