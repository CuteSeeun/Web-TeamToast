import { Request, Response } from 'express';
import {PoolConnection} from 'mysql2/promise';
import pool from '../config/dbpool';


export const spaceList = async(req:Request , res:Response):Promise<void> => {
    const connection:PoolConnection = await pool.getConnection();

    try {
        const {sname} = req.body;
        const createEmail = req.user?.email;

        if(!createEmail){
            res.status(401).json({message:'인증 정보가 없습니다.'});
            return;
        }

        await connection.beginTransaction();

        // 스페이스테이블에 추가
        const [spaceResult]:any = await connection.query(
            'insert into Space (sname) values (?)',
            [sname]
        );
        const spaceId = spaceResult.insertId;

        // UserRole 테이블에 생성자 권한 추가
        await connection.query(
            'insert into UserRole (role, user, space_id) values (?, ?, ?)',
            ['top_manager', createEmail,spaceId]
        );

        await connection.commit();
        res.status(201).json({
            message:'스페이스 생성 성공',
            spaceId,
            spaceName:sname
        });

    } catch (error) {
        await connection.rollback();
        console.error('스페이스 생성 에러 : ',error);
        res.status(500).json({message:"스페이스 생성 실패"});
    }finally{
        await connection.release();
    }

}

export const getMySpaces = async(req:Request , res:Response):Promise<void>=>{
    const connection:PoolConnection =await pool.getConnection();

    try {
        const userEmail = req.user?.email;
        
        if(!userEmail){
            res.status(401).json({message:'인증 정보가 없습니다.'});
            return;
        }

         // 디버깅을 위한 로그 추가
         console.log('Fetching spaces for user:', userEmail);

        // space 랑 userrole 테이블 조인해서 사용자의 스페이스 목록 조회함
        const [spaces] = await connection.query(`
            select 
                s.sid as spaceId,
                s.sname as spaceName,
                ur.role
            from Space s join UserRole ur ON s.sid = ur.space_id
            where ur.user = ?
            `,[userEmail])

            // 결과 확인을 위한 로그
        console.log('Query result:', spaces);

            res.json({spaces});
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
            res.status(401).json({ message: '인증 정보가 없습니다.' });
            return;
        }

        // UserRole 테이블에서 현재 사용자가 마지막으로 선택한 스페이스 조회
        const [result]: any = await connection.query(
            `SELECT space_id AS spaceId 
            FROM UserRole 
            WHERE user = ? 
            LIMIT 1`, // LIMIT 1으로 첫 번째 항목 조회
            [userEmail]
        );

        if (!result.length) {
            res.status(404).json({ message: '현재 선택된 스페이스가 없습니다.' });
            return;
        }

        // 선택된 스페이스가 없으면 null 반환
        res.status(200).json({ spaceId: result.length ? result[0].spaceId : null, });
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
        const { spaceId } = req.body;
        const userEmail = req.user?.email;

        if (!userEmail || !spaceId) {
            res.status(400).json({ message: '유효하지 않은 요청입니다.' });
            return;
        }

        // UserRole 테이블에서 해당 스페이스의 권한 확인
        const [result]: any = await connection.query(
            `SELECT COUNT(*) AS count 
             FROM UserRole 
             WHERE user = ? AND space_id = ?`,
            [userEmail, spaceId]
        );

        if (!result[0].count) {
            res.status(403).json({ message: '해당 스페이스에 접근 권한이 없습니다.' });
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