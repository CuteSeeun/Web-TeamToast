import express, { Application } from 'express';
import cors from 'cors';
import sprintRouter from './routes/sprintRouter';
import userRouter from './routes/userRouter';
import phoneRouter from './routes/phoneRouter';
import path from 'path';
import pool from './config/dbpool';

const app: Application = express();
app.use(express.json());
app.use(cors());

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'public')));

app.use('/sprint', sprintRouter); // 라우터 등록
app.use('/editUser',userRouter); // 로그인 회원가입 이메일체크
app.use('/phone',phoneRouter); // 폰 인증 / 중복 체크

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// 데이터베이스 연결 확인
pool.getConnection()
    .then(connection => {
        console.log('Database connected');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
