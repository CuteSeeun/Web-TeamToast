"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sprintRouter_1 = __importDefault(require("./routes/sprintRouter"));
require("dotenv").config();
const http_1 = require("http"); // HTTP 서버 생성
const socketServer_1 = require("./socketServer"); // 분리된 Socket.IO 코드 import
const path_1 = __importDefault(require("path"));
const dbpool_1 = __importDefault(require("./config/dbpool"));
const billingRouter_1 = __importDefault(require("./routes/billingRouter")); //빌링키 발급 api 요청
const subscriptionRouter_1 = __importDefault(require("./routes/subscriptionRouter")); //빌링키 발급 api 요청
const scheduledPayment_1 = require("./scheduledPayment");
const teamRouter_1 = __importDefault(require("./routes/teamRouter"));
const projectRouter_1 = __importDefault(require("./routes/projectRouter"));
const issueRouter_1 = __importDefault(require("./routes/issueRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const ChannelListRouter_1 = __importDefault(require("./routes/ChannelListRouter"));
const spaceRouter_1 = __importDefault(require("./routes/spaceRouter"));
const SissueRouter_1 = __importDefault(require("./routes/SissueRouter"));
const BIssueRouter_1 = __importDefault(require("./routes/BIssueRouter"));
const BuserRouter_1 = __importDefault(require("./routes/BuserRouter"));
const MessageRouter_1 = __importDefault(require("./routes/MessageRouter"));
// 미들웨어 설정
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
//스케쥴링 작업 시작
(0, scheduledPayment_1.scheduledRecurringPayments)();
// 라우터 설정
app.use("/billing", billingRouter_1.default);
app.use("/subscription", subscriptionRouter_1.default);
app.use("/team", teamRouter_1.default);
app.use('/issue', SissueRouter_1.default); // 올바른 라우트 설정
app.use('/sissue', BIssueRouter_1.default); // 올바른 라우트 설정
app.use('/user', BuserRouter_1.default);
app.use('/sprint', sprintRouter_1.default);
app.use('/projects', projectRouter_1.default);
app.use('/issues', issueRouter_1.default);
app.use('/editUser', userRouter_1.default); // 로그인 회원가입 
app.use('/channel', ChannelListRouter_1.default);
app.use('/space', spaceRouter_1.default);
app.use('/messages', MessageRouter_1.default);
// HTTP 서버 생성
const httpServer = (0, http_1.createServer)(app);
// Socket.IO 초기화
(0, socketServer_1.initSocket)(httpServer);
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
dbpool_1.default.getConnection()
    .then(connection => {
    console.log('Database connected');
    connection.release();
    console.log('DB connection released');
})
    .catch(err => {
    console.error('Database connection error:', err);
});
