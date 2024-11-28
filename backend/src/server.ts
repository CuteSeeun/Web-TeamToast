import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import pool from './config/dbpool';
import sprintRouter from './routes/sprintRouter';
import issueRouter from './routes/issueRouter';
import singleIssueRouter from './routes/singleIssueRouter';
import userRouter from './routes/userRouter'; // userRouter 임포트

const app: Application = express();

// 미들웨어 설정
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 설정
app.use('/sprint', sprintRouter);
app.use('/issue', issueRouter);
app.use('/issue', singleIssueRouter);
app.use('/user', userRouter); // userRouter 추가

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

pool.getConnection()
    .then(connection => {
        console.log('Database connected');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
