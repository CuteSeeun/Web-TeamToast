import { Request, Response } from "express";
import db from "../config/dbpool";


export const getAlarm = async(req:Request , res:Response):Promise<void> =>{
    // const userEmail = req.user?.email;
    const userEmail = 'kh32100@naver.com';

    if(!userEmail){
        res.status(401).json({message:'로그인이 필요합니다.'});
        return
        
    }

    try {
        const [notifications]:any = await db.execute(
            `select 
            n.nid,
            p.title as projectTitle, -- 프로젝트 제목
            i.title as issueTitle, -- 이슈 제목
            i.detail as issueDetail, -- 이슈 내용
            n.project_id as projectId, -- 프로젝트 제목 
            i.id as issueId  -- 이슈 아이디
            from Notification n join
            Project p on n.project_id = p.id
            join Issue i on n.issue_id = i.id
            where n.user = ?
            order by n.timestamp desc`,
            [userEmail]
        );
        res.status(200).json(notifications); // 알림 데이터 보냄
    } catch (error) {
        console.log('알림 데이터 가져오는 중에 오류 발생함 :',error);
        res.status(500).json({message:'알림 데이터 가져오는 중 오류가 발생함'}); // 알림 데이터 보냄
    }
}

export const getProjectid = async(req:Request,res:Response):Promise<void>=>{
    const {nid} = req.params; // 요청 url 알림id(nid)

    if(!nid){
        res.status(500).json({message:'알림 ID가 필요합니다.'});
    }

    try {
       const [rows]:any = await db.execute(
        `select n.project_id as projectId From Notification n where n.nid = ? `,[nid]
        )

        if(rows.length === 0){
            res.status(404).json({message:"해당 알림을 찾을 수 없습니다."});
            return
        }
        res.status(200).json({projectId:rows[0].projectId})
    } catch (error) {
        console.error("프로젝트 ID를 가져오는 중 오류 발생: ", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }

}