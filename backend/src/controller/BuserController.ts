import { Request, Response } from 'express';
import pool from '../config/dbpool';

export const getProjectManagers = async (req: Request, res: Response): Promise<void> => {
    const projectId = parseInt(req.params.projectid, 10);

    if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
    }

    try {
        const query = `
            SELECT DISTINCT User.uname AS manager
            FROM User
            JOIN Issue ON User.email = Issue.manager
            WHERE Issue.project_id = ?;
        `;
        const [rows] = await pool.query(query, [projectId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching project managers' });
    }
};
