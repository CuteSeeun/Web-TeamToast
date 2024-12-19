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
    const issueId = parseInt(req.body.issueId, 10);
    const { content, user } = req.body;

    // 현재 시간을 한국 표준시(KST)로 변환
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 9); // UTC+9 시간대로 변환
    const timestamp = currentDate.toISOString().slice(0, 19).replace('T', ' ');

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
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Server error occurred:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
};




export const editComment = async (req: Request, res: Response) => {
    const cid = parseInt(req.params.cid, 10); // req.params에서 cid 가져오기
    const { content } = req.body; // content를 body에서 가져옵니다

    if (isNaN(cid)) {
        console.error('잘못된 댓글 ID:', cid);
        res.status(400).json({ error: 'Invalid comment ID' });
        return;
    }

    try {
        const query = `
            UPDATE Comment SET content = ? WHERE cid = ?
        `;
        const [result] = await pool.query(query, [content, cid]); // ResultSetHeader 타입 사용

        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        console.error('서버 오류 발생:', error); // 오류 메시지 출력
        res.status(500).json({ error: 'Server error occurred' });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const cid = parseInt(req.params.cid, 10); // req.params에서 cid 가져오기

    if (isNaN(cid)) {
        console.error('잘못된 댓글 ID:', cid);
        res.status(400).json({ error: 'Invalid comment ID' });
        return;
    }

    try {
        const query = `
            DELETE FROM Comment WHERE cid = ?
        `;
        const [result] = await pool.query(query, [cid]);

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('서버 오류 발생:', error); // 오류 메시지 출력
        res.status(500).json({ error: 'Server error occurred' });
    }
};
