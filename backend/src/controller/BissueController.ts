// issueController.ts
import { Request, Response } from 'express';
import pool from '../config/dbpool'; 
import { RowDataPacket } from 'mysql2'; 

type IssueStatus = 'Backlog' | 'Working' | 'Dev' | 'QA';
type IssuePriority = 'high' | 'normal' | 'low';

interface Issue extends RowDataPacket { 
    isid: number;
    title: string;
    detail: string;
    type: boolean;
    status: IssueStatus;
    priority: IssuePriority;
    sprint_id: number;
    project_id: number;
    manager: string; 
    created_by: string;
    file: string;
}

// 특정 이슈를 issueId로 가져오는 컨트롤러
export const getIssueById = async (req: Request, res: Response): Promise<void> => {
    const issueId = parseInt(req.params.isid, 10);
    const projectId = parseInt(req.params.projectid, 10);

    try {
        console.log('Received request to fetch issue with projectId:', projectId, 'and issueId:', issueId);
        const query = `
            SELECT 
                Issue.isid, Issue.title, Issue.detail, Issue.type, 
                Issue.status, Issue.priority, Issue.sprint_id, Issue.project_id, 
                mgr.uname AS manager, crt.uname AS created_by, Issue.file
            FROM Issue
            JOIN User AS mgr ON Issue.manager = mgr.email
            JOIN User AS crt ON Issue.created_by = crt.email
            WHERE Issue.project_id = ? AND Issue.isid = ?;
        `;
        console.log('Executing query with projectId:', projectId, 'and issueId:', issueId);
        const [rows] = await pool.query<Issue[]>(query, [projectId, issueId]);
        console.log('Query result:', rows);
        res.json(rows);
    } catch (error: unknown) {
        console.error('Error fetching issue:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: '이슈 호출 오류', details: error.message });
        } else {
            res.status(500).json({ error: '이슈 호출 오류', details: '알 수 없는 오류가 발생했습니다.' });
        }
    }
};


export const getIssue = async (req: Request, res: Response): Promise<void> => {
    const sprintId = parseInt(req.params.issueid, 10);
    const projectId = parseInt(req.params.projectid, 10);

    try {
        const query = `
            SELECT 
                Issue.isid, Issue.title, Issue.detail, Issue.type, 
                Issue.status, Issue.priority, Issue.sprint_id, Issue.project_id, 
                mgr.uname AS manager, crt.uname AS created_by, Issue.file
            FROM Issue
            JOIN User AS mgr ON Issue.manager = mgr.email
            JOIN User AS crt ON Issue.created_by = crt.email
            WHERE Issue.project_id = ? AND Issue.sprint_id = ?;
        `;
        const [rows] = await pool.query<Issue[]>(query, [projectId, sprintId]); // 타입 지정
        res.json(rows);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: '이슈 호출 오류', details: error.message });
        } else {
            res.status(500).json({ error: '이슈 호출 오류', details: '알 수 없는 오류가 발생했습니다.' });
        }
    }
};


export const getBacklogIssue = async (req: Request, res: Response): Promise<void> => {
    const projectId = parseInt(req.params.projectid, 10);

    if (isNaN(projectId)) {
        console.error('Invalid project ID:', req.params.projectid);
        res.status(400).json({ error: 'Invalid project ID' });
        return;
    }

    try {
        const query = `
            SELECT
                Issue.isid, Issue.title, Issue.type, Issue.priority, Issue.status, User.uname AS manager
            FROM Issue
            JOIN User ON Issue.manager = User.email
            WHERE Issue.project_id = ? AND Issue.sprint_id IS NULL;
        `;
        const [rows] = await pool.query<Issue[]>(query, [projectId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: '백로그 이슈 호출 오류' });
    }
};

export const updateIssueSprint = async (req: Request, res: Response): Promise<void> => {
    const issueId: number = Number(req.params.issueid); // req.params.issueid로 수정
    const { sprint_id }: { sprint_id: number | null } = req.body;

    try {
        const [result]: [any, any] = await pool.query('UPDATE Issue SET sprint_id = ? WHERE isid = ?', [sprint_id, issueId]);

        if (result.affectedRows > 0) {
            res.json({ message: 'Issue sprint_id updated successfully' });
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};



