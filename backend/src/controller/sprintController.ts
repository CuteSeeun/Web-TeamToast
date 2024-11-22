import { Request, Response } from 'express';
import pool from '../config/dbpool'; // 디폴트 익스포트 가져오기

interface Sprint {
    spid: number;
    spname: string;
    status: boolean;
    goal: Date;
    enddate: Date;
    startdate: Date;
    project_id: number;
}

export const getSprint = async (req: Request, res: Response): Promise<void> => {
    const projectId: number = Number(req.params.projectid);
    console.log(`Project ID: ${projectId}`); // 프로젝트 ID 로그 출력
    try {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM Sprint WHERE project_id = ?', [projectId]);
        const sprints: Sprint[] = rows as Sprint[];
        console.log(`Sprints: ${JSON.stringify(sprints)}`); // 스프린트 데이터 로그 출력
        res.json(sprints);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
};
