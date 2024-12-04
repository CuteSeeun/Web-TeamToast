"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dbpool_1 = __importDefault(require("./config/dbpool"));
require("dotenv").config();
const http_1 = require("http"); // HTTP 서버 생성
const socketServer_1 = require("./socketServer"); // 분리된 Socket.IO 코드 import
const sprintRouter_1 = __importDefault(require("./routes/sprintRouter"));
const projectRouter_1 = __importDefault(require("./routes/projectRouter"));
const issueRouter_1 = __importDefault(require("./routes/issueRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const ChannelListRouter_1 = __importDefault(require("./routes/ChannelListRouter"));
const spaceRouter_1 = __importDefault(require("./routes/spaceRouter"));
const MessageRouter_1 = __importDefault(require("./routes/MessageRouter"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// 라우터 등록
app.use('/sprint', sprintRouter_1.default); // 라우터 등록
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
// 데이터베이스 연결 확인
dbpool_1.default.getConnection()
    .then(connection => {
    console.log('Database connected');
    connection.release();
    console.log('DB connection released');
})
    .catch(err => {
    console.error('Database connection error:', err);
});
