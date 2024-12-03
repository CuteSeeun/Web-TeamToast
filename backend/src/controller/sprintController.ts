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

export const getSprint = async (req: Request, res: Response): Promise<void> => {
    const projectId: number = Number(req.params.projectid);
    try {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM Sprint WHERE project_id = ?', [projectId]);
        const sprints: Sprint[] = rows as Sprint[];
        res.json(sprints);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
};

export const updateSprintStatus = async (req: Request, res: Response): Promise<void> => {
    const spid: number = Number(req.params.spid);
    const { status }: { status: SprintStatus } = req.body; // ENUM 타입 적용

    try {
        const [result]: any = await pool.query('UPDATE Sprint SET status = ? WHERE spid = ?', [status, spid]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Sprint status updated successfully' });
        } else {
            res.status(404).json({ error: 'Sprint not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: '스프린트 상태 업데이트 오류', details: error.message });
        } else {
            res.status(500).json({ error: '스프린트 상태 업데이트 오류', details: '알 수 없는 오류가 발생했습니다.' });
        }
    }
};


export const InsertSprint = async (req: Request, res: Response): Promise<void> => {
    const { spname, startDate, endDate, goal, project_id } = req.body;

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
