import express, { Application } from 'express';
import cors from 'cors';

import sprintRouter from './routes/sprintRouter';
import projectRouter from './routes/projectRouter';
import issueRouter from './routes/issueRouter';
import userRouter from './routes/userRouter';
import ChatTapMenuRouter from './routes/ChatTapMenuRouter';
import spaceRouter from './routes/spaceRouter';
import MessageRouter from './routes/MessageRouter';


import path from 'path';
import pool from './config/dbpool';

const app: Application = express();
app.use(express.json());
app.use(cors());

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'public')));

app.use('/sprint', sprintRouter); // 라우터 등록
app.use('/projects', projectRouter);
app.use('/issues', issueRouter);
app.use('/editUser',userRouter); // 로그인 회원가입 
app.use('/channel', ChatTapMenuRouter);
app.use('/space',spaceRouter);
app.use('/messages', MessageRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// 데이터베이스 연결 확인
pool.getConnection()
    .then(connection => {
        console.log('Database connected');
        connection.release();
        console.log('DB connection released');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
