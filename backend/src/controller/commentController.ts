import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise'; // RowDataPacket 추가
import pool from '../config/dbpool';

interface UserRow extends RowDataPacket {
    uid: number;
    uname: string;
    email: string;
    passwd: string;
    tel: string;
}

interface CommentRow extends RowDataPacket {
    cid: number;
    content: string;
    timestamp: string;
    issue_id: number;
    user: string;
}

export const getCommentsByIssueId = async (req: Request, res: Response) => {
    const issueId = parseInt(req.params.isid, 10);
    if (isNaN(issueId)) {
        res.status(400).json({ error: 'Invalid issue ID' });
        return;
    }

    try {
        const query = `
            SELECT c.cid, c.content, c.timestamp, c.issue_id, u.uname AS user
            FROM Comment c
            JOIN User u ON c.user = u.email
            WHERE c.issue_id = ?
        `;
        const [rows] = await pool.query<CommentRow[]>(query, [issueId]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error occurred' });
    }
};

export const insertComment = async (req: Request, res: Response) => {
    console.log('요청 본문:', req.body); // 로그 추가

    const issueId = parseInt(req.body.issueId, 10); // 수정: req.params가 아닌 req.body에서 가져오기
    const { content, timestamp, user } = req.body;

    if (isNaN(issueId)) {
        res.status(400).json({ error: 'Invalid issue ID' });
        return;
    }

    if (!content || !timestamp || !user) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const query = `
            INSERT INTO Comment (issue_id, content, timestamp, user)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [issueId, content, timestamp, user]);

        const newCommentId = (result as { insertId: number }).insertId;
        const [rows] = await pool.query<CommentRow[]>('SELECT * FROM Comment WHERE cid = ?', [newCommentId]);

        console.log('삽입된 댓글:', rows[0]); // 로그 추가

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Server error occurred:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
};
