// server.ts
import express, { Application } from 'express';
import cors from 'cors';
import sprintRouter from "./routes/sprintRouter";
require("dotenv").config();
import { createServer } from 'http'; // HTTP 서버 생성
import { initSocket } from './socketServer'; // 분리된 Socket.IO 코드 import


import path from "path";
import pool from "./config/dbpool";
import billingRouter from "./routes/billingRouter"; //빌링키 발급 api 요청
import subscriptionRouter from "./routes/subscriptionRouter"; //빌링키 발급 api 요청
import { scheduledRecurringPayments } from "./scheduledPayment";
import teamRouter from "./routes/teamRouter"
import projectRouter from './routes/projectRouter';
import issueRouter from './routes/issueRouter';
import userRouter from './routes/userRouter';
import ChatTapMenuRouter from './routes/ChannelListRouter';
import spaceRouter from './routes/spaceRouter';
import SissueRouter from './routes/SissueRouter';
import singleIssueRouter from './routes/BIssueRouter';
import BuserRouter from './routes/BuserRouter';
import MessageRouter from './routes/MessageRouter';


// 미들웨어 설정
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

//스케쥴링 작업 시작
scheduledRecurringPayments();

// 라우터 설정
app.use("/billing", billingRouter);
app.use("/subscription", subscriptionRouter);
app.use("/team", teamRouter);
app.use('/issue', SissueRouter);  // 올바른 라우트 설정
app.use('/sissue', singleIssueRouter); // 올바른 라우트 설정
app.use('/user', BuserRouter);
app.use('/sprint', sprintRouter); 
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

pool.getConnection()
    .then(connection => {
        console.log('Database connected');
        connection.release();
        console.log('DB connection released');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });


