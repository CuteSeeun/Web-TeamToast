
import express, { Application } from "express";
import cors from "cors";
import path from "path";
import pool from "./config/dbpool";
import billingRouter from "./routes/billingRouter"; //빌링키 발급 api 요청
import subscriptionRouter from "./routes/subscriptionRouter"; //빌링키 발급 api 요청
import { scheduledRecurringPayments } from "./scheduledPayment";
import teamRouter from "./routes/teamRouter"
import projectRouter from './routes/projectRouter';
import issueRouter from './routes/issueRouter';
import userRouter from './routes/userRouter';
import spaceRouter from './routes/spaceRouter';

// 2024-11-28 조하영
import BsprintRouter from './routes/sprintRouter';
import SissueRouter from './routes/SissueRouter';
import singleIssueRouter from './routes/BIssueRouter';
import BuserRouter from './routes/BuserRouter';


// 미들웨어 설정
const app: Application = express();
app.use(express.json());
app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:3000', // 프론트엔드 주소
//     credentials: true, // 쿠키 포함
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));


// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, "public")));

app.use("/billing", billingRouter);
app.use("/subscription", subscriptionRouter);
app.use("/team", teamRouter);

//스케쥴링 작업 시작
scheduledRecurringPayments();

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));


// 라우터 설정
app.use('/sprint', BsprintRouter);
app.use('/issue', SissueRouter);
app.use('/issue', singleIssueRouter);
app.use('/user', BuserRouter);

app.use('/projects', projectRouter);
app.use('/issues', issueRouter);
app.use('/editUser',userRouter); // 로그인 회원가입 
app.use('/space',spaceRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
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

