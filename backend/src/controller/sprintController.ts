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
