import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import pool from './config/dbpool';
// 2024-11-28 조하영
import BsprintRouter from './routes/sprintRouter';
import SissueRouter from './routes/SissueRouter';
import singleIssueRouter from './routes/BIssueRouter';
import BuserRouter from './routes/BuserRouter';

// 미들웨어 설정
const app: Application = express();
app.use(express.json());
app.use(cors());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 설정
app.use('/sprint', BsprintRouter);
app.use('/issue', SissueRouter);
app.use('/issue', singleIssueRouter);
app.use('/user', BuserRouter);

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
