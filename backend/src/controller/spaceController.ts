import { Request, Response } from 'express';
import {PoolConnection} from 'mysql2/promise';
import pool from '../config/dbpool';
import { v4 as uuidv4 } from "uuid";


// 프로젝트헤더에서도  값 불러옴
export const getSpaceByUuid = async(req:Request , res:Response) :Promise<void>=>{
    const connection = await pool.getConnection();
    try {
        const {uuid} =req.params;

        const [result]:any = await connection.query(
            `select sid as spaceId, sname as spaceName, uuid
            from Space where uuid = ?
            `,
            [uuid]
        )
        
        if(!result.length){
            res.status(404).json({message:'스페이스를 찾을 수 없습니다.'});
            return;
        }

        res.status(200).json(result[0]);
    } catch (error) {
    console.error('스페이스 조회 실패 : ',error);
    res.status(500).json({message:'서버 오류'});
    }finally{
        connection.release();
    }
}

// 새 스페이스 생성
export const createSpace = async (req: Request, res: Response): Promise<void> => {
    const connection: PoolConnection = await pool.getConnection();
    try {
        const { sname,uname } = req.body;
        const spaceUuid = uuidv4();
        const createEmail = req.user?.email;

        if (!createEmail) {
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }

        await connection.beginTransaction();

        // Space 테이블에 추가
        const [spaceResult]: any = await connection.query(
            `INSERT INTO Space (sname, uuid) VALUES (?, ?)`,
            [sname, spaceUuid]
        );
        const spaceId = spaceResult.insertId;

        // UserRole 테이블에 생성자 권한 추가
        await connection.query(
            `INSERT INTO UserRole (role, user, space_id, uname) VALUES (?, ?, ?, ?)`,
            ['top_manager', createEmail, spaceId , uname]
        );

         // Subscription 테이블에 기본 구독 정보 추가
         await connection.query(
            "INSERT INTO Subscription (spaceId, email, plan, `limit`) VALUES (?, ?, ?, ?)",
            [spaceId, createEmail, 'basic', 10]
        );

        await connection.commit();
        res.status(201).json({
            message: '스페이스 생성 성공',
            spaceId,
            spaceName: sname,
            spaceUuid,
        });
    } catch (error) {
        await connection.rollback();
        console.error('스페이스 생성 에러:', error);
        res.status(500).json({ message: '스페이스 생성 실패' });
    } finally {
        connection.release();
    }
};


export const getMySpaces = async(req:Request , res:Response):Promise<void>=>{
    const connection: PoolConnection = await pool.getConnection();
    try {
        const userEmail = req.user?.email;

        if (!userEmail) {
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }

        // UserRole을 기반으로 스페이스 목록 조회
        const [space]: any = await connection.query(
            `SELECT s.sid AS spaceId, s.sname AS spaceName, ur.role, s.uuid
            FROM Space s 
            JOIN UserRole ur ON s.sid = ur.space_id 
            WHERE ur.user = ?`,
            [userEmail]
        );
            res.json({space});
    } catch (error) {
        console.error('스페이스 목록 조회 실패 : ',error);
        res.status(500).json({message:'스페이스 목록 조회 실패'});
    }
}

// 현재 스페이스 조회
export const getCurrentSpace = async (req: Request, res: Response): Promise<void> => {
    const connection: PoolConnection = await pool.getConnection();
    try {
        const userEmail = req.user?.email;

        if (!userEmail) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }

        // UUID와 UserRole을 기준으로 Space 조회
        const [result]: any = await connection.query(
            `SELECT s.sid AS spaceId, s.sname AS spaceName, s.uuid
             FROM Space s 
             JOIN UserRole ur ON s.sid = ur.space_id 
             WHERE ur.user = ?
             ORDER BY s.last_accessed_at DESC LIMIT 1`,
            [userEmail]
        );

        if (!result.length) {
            res.status(404).json({ message: '현재 선택된 스페이스가 없습니다.' });
            return;
        }

        res.status(200).json({
            spaceId: result[0].spaceId,
            spaceName: result[0].spaceName,
            uuid: result[0].uuid, // UUID도 반환
        });
    } catch (error) {
        console.error('현재 스페이스 조회 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    } finally {
        connection.release();
    }
};

// 스페이스 선택
export const selectSpace = async (req: Request, res: Response): Promise<void> => {
    const connection: PoolConnection = await pool.getConnection();
    try {
        const { uuid } = req.body;
        const userEmail = req.user?.email;

        if (!userEmail || !uuid) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }

         // UUID로 Space를 선택하고 마지막 접근 시간 업데이트
        const [result]: any = await connection.query(
            `UPDATE Space SET last_accessed_at = NOW() WHERE uuid = ?`,
            [uuid]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ message: '해당 스페이스를 찾을 수 없습니다.' });
            return;
        }
       

        res.status(200).json({ message: '스페이스 선택 완료' });
    } catch (error) {
        console.error('스페이스 선택 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    } finally {
        connection.release();
    }
};

//스페이스 이름 수정
export const updateSpace = async(req:Request,res:Response):Promise<void> =>{
    const connection = await pool.getConnection();
    try {
        const {uuid} = req.params;
        const {sname} = req.body;
        const userEmail = req.user?.email;

        if (!userEmail || !uuid || !sname) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }

        // 해당 스페이스가 유효한지 확인
        const [spaceCheck]:any = await connection.query(
            `select * from Space where uuid = ? `,
            [uuid]
        )

        if(!spaceCheck.length){
            res.status(404).json({message:'스페이스를 찾을 수 없습니다.'});
            return;
        }

        //스페이스 이름 업데이트
        const [updateResult]:any = await connection.query(
            `update Space set sname = ? where uuid = ?`,
            [sname , uuid]
        );

        if(updateResult.affectedRows === 0){
            res.status(400).json({message:'스페이스 이름 수정 실패'});
            return;
        }

        res.status(200).json({message:'스페이스 이름 수정 성공'});
    } catch (error) {
        console.error('스페이스 이름 수정 실패 : ',error);
        res.status(500).json({message:'서버 오류'});
    }finally{
        connection.release();
    }
}

//스페이스 삭제
export const deleteSpace = async(req:Request , res:Response):Promise<void>=>{
    const connection = await pool.getConnection();
    try {
        const {uuid} = req.params; // uuid 가져옴
        const userEmail = req.user?.email;

        if (!userEmail || !uuid) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }

        //해당 스페이스가 유효한지 확인
        const [spaceCheck]:any = await connection.query(
            `select * from Space where uuid`,[uuid]
        )

        if (!spaceCheck.length) {
            res.status(404).json({ message: '스페이스를 찾을 수 없습니다.' });
            return;
        }

        //트랜잭션 시작
        await connection.beginTransaction();

        // 관련된 유저롤 삭제
        await connection.query(
            `delete from UserRole where space_id = (select sid from Space where uuid = ?)`,
            [uuid]
        )
        
        // 관련된 구독 삭제
        await connection.query(
            `delete from Subscription where spaceId = (select sid from Space where uuid = ?)`,
            [uuid]
        );

        //스페이스 삭제
        const [deleteResult]:any = await connection.query(
            `delete from Space where uuid = ?`,
            [uuid]
        );

        if(deleteResult.affectedRows === 0){
            await connection.rollback();
            res.status(400).json({message:'스페이스 삭제 실패'});
            return;
        }

        await connection.commit(); // 저장
        res.status(200).json({ message: '스페이스 삭제 성공' });
    } catch (error) {
        await connection.rollback(); // 오류나면 롤백함
        console.error('스페이스 삭제 실패 :', error);
        res.status(500).json({ message: '서버 오류' });
    }finally {
        connection.release();
    }
}

