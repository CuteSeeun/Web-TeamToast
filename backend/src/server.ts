import express, { Application } from "express";
import cors from "cors";
import sprintRouter from "./routes/sprintRouter";
import path from "path";
import pool from "./config/dbpool";
import billingRouter from "./routes/billingRouter"; //빌링키 발급 api 요청
import subscriptionRouter from "./routes/subscriptionRouter"; //빌링키 발급 api 요청
import bodyParser from "body-parser";
import { scheduledRecurringPayments } from "./scheduledPayment";
import teamRouter from "./routes/teamRouter"

const app: Application = express();
app.use(express.json());
app.use(cors());

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, "public")));

app.use("/sprint", sprintRouter); // 라우터 등록
app.use("/billing", billingRouter);
app.use("/subscription", subscriptionRouter);
app.use("/team", teamRouter);

//스케쥴링 작업 시작
scheduledRecurringPayments();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// 데이터베이스 연결 확인
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
