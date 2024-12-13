// import express, { Request, Response } from 'express';
// import pool from '../config/dbpool';
// // import {newIssue } from '../controller/issueController';
// const router = express.Router();


// // router.get('/all/:pid', getIssues);

// // router.post('/new/:pid', newIssue);

// router.post('/new/:pid', async (req: Request, res: Response): Promise<void> => {
//     console.log('이슈 생성 post요청 들어옴');
//     const pid = parseInt(req.params.pid, 10); // URL 파라미터에서 프로젝트 ID 가져오기

//     // 요청 데이터 가져오기
//     const {
//         title,
//         detail,
//         type,
//         status,
//         sprint_id,
//         manager,
//         created_by,
//         file,
//         priority
//     } = req.body;

//     console.log('프론트에서 보내준값:', { title, detail, type, status, sprint_id, manager, created_by, file, priority });

//     // 필수 필드 확인
//     if (!title || !type || !status || !priority || isNaN(pid)) {
//         res.status(400).json({ error: '필수 데이터가 누락됨.' });
//         return;
//     }
//     try {
//         // 쿼리문 정의
//         const query = `
//             INSERT INTO Issue (title, detail, type, status, sprint_id, project_id, manager, created_by, file, priority) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//         `;

//         const [result] = await pool.query(query, [
//             title,
//             detail || null,
//             type,
//             status,
//             sprint_id || null,
//             pid,
//             manager || null,
//             created_by || null,
//             JSON.stringify(file) || null,
//             priority,
//         ]);

//         res.status(201).json({
//             message: '이슈 생성 성공',
//             issueId: (result as any).insertId,
//         });
//         console.log('이슈 생성 성공');
//     } catch(err) {
//         console.error('이슈 생성 중 에러:', err);
//         res.status(500).json({ error: '서버 오류 발생' });
//     }
// });

// export default router;




import express, { Request, Response } from 'express';
import pool from '../config/dbpool';
// import {newIssue } from '../controller/issueController';
const router = express.Router();


// router.get('/all/:pid', getIssues);

// router.post('/new/:pid', newIssue);

router.post('/new/:pid', async (req: Request, res: Response): Promise<void> => {
    console.log('이슈 생성 post요청 들어옴');
    const pid = parseInt(req.params.pid, 10); // URL 파라미터에서 프로젝트 ID 가져오기

    // 요청 데이터 가져오기
    const {
        title,
        detail,
        type,
        status,
        sprint_id,
        manager,
        created_by,
        file,
        priority
    } = req.body;

    console.log('프론트에서 보내준값:', { title, detail, type, status, sprint_id, manager, created_by, file, priority });

    // 필수 필드 확인
    if (!title || !type || !status || !priority || isNaN(pid)) {
        res.status(400).json({ error: '필수 데이터가 누락됨.' });
        return;
    }

    try {
        // 쿼리문 정의
        const query = `
            INSERT INTO Issue (title, detail, type, status, sprint_id, project_id, manager, created_by, file, priority) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const [result] = await pool.query(query, [
            title,
            detail || null,
            type,
            status,
            sprint_id || null,
            pid,
            manager || null,
            created_by || null,
            JSON.stringify(file).length !== 0 ? file : null,
            priority,
        ]);

        res.status(201).json({
            message: '이슈 생성 성공',
            issueId: (result as any).insertId,
        });
        console.log('이슈 생성 성공');
    } catch(err) {
        console.error('이슈 생성 중 에러:', err);
        res.status(500).json({ error: '서버 오류 발생' });
    }
});

export default router;