import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import pool from './config/dbpool';
require("dotenv").config();
import { createServer } from 'http'; // HTTP 서버 생성
import { initSocket } from './socketServer'; // 분리된 Socket.IO 코드 import

import sprintRouter from './routes/sprintRouter';
import projectRouter from './routes/projectRouter';
import issueRouter from './routes/issueRouter';
import userRouter from './routes/userRouter';
import ChatTapMenuRouter from './routes/ChannelListRouter';
import spaceRouter from './routes/spaceRouter';
import MessageRouter from './routes/MessageRouter';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// 라우터 등록
app.use('/sprint', sprintRouter); // 라우터 등록
app.use('/projects', projectRouter);
app.use('/issues', issueRouter);
app.use('/editUser', userRouter); // 로그인 회원가입 
app.use('/channel', ChatTapMenuRouter);
app.use('/space', spaceRouter);
app.use('/messages', MessageRouter);

// HTTP 서버 생성
const httpServer = createServer(app);
// Socket.IO 초기화
initSocket(httpServer);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
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
