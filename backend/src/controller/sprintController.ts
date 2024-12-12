// sprintController.ts
import { Request, Response } from 'express';
import pool from '../config/dbpool';

type SprintStatus = 'disabled' | 'enabled' | 'end'; // ENUM 타입 정의

interface Sprint {
    spid: number;
    spname: string;
    status: SprintStatus;
    goal: Date;
    enddate: Date;
    startdate: Date;
    project_id: number;
}

// 스프린트 전체 호출 컨트롤러
export const getAllSprints = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM Sprint');
        const sprints: Sprint[] = rows as Sprint[];
        res.json(sprints);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('오류:', error.message);
        } else {
            console.error('알 수 없는 오류가 발생했습니다:', error);
        }
    }
};


// 스프린트 호출 컨트롤러
export const getSprint = async (req: Request, res: Response): Promise<void> => {
    const projectId: number = Number(req.params.projectid);
    try {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM Sprint WHERE project_id = ?', [projectId]);
        const sprints: Sprint[] = rows as Sprint[];
        res.json(sprints);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('오류:', error.message);
        } else {
            console.error('알 수 없는 오류가 발생했습니다:', error);
        }
    }
};

// 스프린트 활성 상태 변경 컨트롤러
export const updateSprintStatus = async (req: Request, res: Response): Promise<void> => {
    const spid: number = Number(req.params.spid);
    const { status }: { status: SprintStatus } = req.body; // ENUM 타입 적용

    try {
        const [result]: any = await pool.query('UPDATE Sprint SET status = ? WHERE spid = ?', [status, spid]);
        if (result.affectedRows > 0) {
            res.json({ message: '스프린트 상태가 성공적으로 업데이트되었습니다.' });
        } else {
            res.status(404).json({ error: '스프린트를 찾을 수 없습니다.' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: '스프린트 상태 업데이트 오류', details: error.message });
        } else {
            res.status(500).json({ error: '스프린트 상태 업데이트 오류', details: '알 수 없는 오류가 발생했습니다.' });
        }
    }
};

// 스프린트 생성 컨트롤러
export const InsertSprint = async (req: Request, res: Response): Promise<void> => {
    const { spname, startDate, endDate, goal, project_id } = req.body; // 추가된 project_id 확인
    const { pid } = req.params; // URL에서 pid 추출

    console.log('Request Body:', req.body); // 요청 본문 데이터 출력
    console.log('Request Params:', req.params); // 요청 경로 파라미터 출력

    // 모든 필드가 제대로 전달되었는지 확인
    if (!spname || !startDate || !endDate || !project_id) {
        res.status(400).json({ success: false, message: '필수 필드를 입력해 주세요.' });
        return;
    }

    try {
        const query = 'INSERT INTO Sprint (spname, startdate, enddate, goal, project_id) VALUES (?, ?, ?, ?, ?)';
        const values = [spname, startDate, endDate, goal, project_id];
        await pool.query(query, values);

        res.status(201).json({ success: true, message: '스프린트가 성공적으로 생성되었습니다.' });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ success: false, message: '서버 에러로 인해 스프린트를 생성하지 못했습니다.', error: err.message });
    }
};


// 스프린트 수정 컨트롤러
export const ModifiySprint = async (req: Request, res: Response): Promise<void> => {
    const { spid, spname, startdate, enddate, goal, status, project_id } = req.body;

    try {
        const query = `
            UPDATE Sprint
            SET spname = ?, startdate = ?, enddate = ?, goal = ?, status = ?, project_id = ?
            WHERE spid = ?
        `;
        const values = [spname, startdate, enddate, goal, status, project_id, spid];

        await pool.query(query, values);

        res.json({ success: true, message: '스프린트가 수정되었습니다.' });
    } catch (error) {
        console.error('스프린트를 수정하는 중 오류가 발생했습니다:', error);
        res.status(500).json({ success: false, message: '스프린트를 수정하는 중 오류가 발생했습니다.' });
    }
};

// 스프린트 삭제 컨트롤러
export const DeleteSprint = async (req: Request, res: Response): Promise<void> => {
    const { spid } = req.params;
    try {
        const query = 'DELETE FROM Sprint WHERE spid = ?';
        await pool.query(query, [spid]);

        res.json({ success: true, message: '스프린트가 삭제되었습니다.' });
    } catch (error) {
        console.error('스프린트를 삭제하는 중 오류가 발생했습니다:', error);
        res.status(500).json({ success: false, message: '스프린트를 삭제하는 중 오류가 발생했습니다.' });
    }
};
