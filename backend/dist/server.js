"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dbpool_1 = __importDefault(require("./config/dbpool"));
// 2024-11-28 조하영
const sprintRouter_1 = __importDefault(require("./routes/sprintRouter"));
const SissueRouter_1 = __importDefault(require("./routes/SissueRouter"));
const BIssueRouter_1 = __importDefault(require("./routes/BIssueRouter"));
const BuserRouter_1 = __importDefault(require("./routes/BuserRouter"));
// 미들웨어 설정
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// 정적 파일 제공
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// 라우터 설정
app.use('/sprint', sprintRouter_1.default);
app.use('/issue', SissueRouter_1.default);
app.use('/issue', BIssueRouter_1.default);
app.use('/user', BuserRouter_1.default);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
dbpool_1.default.getConnection()
    .then(connection => {
    console.log('Database connected');
    connection.release();
})
    .catch(err => {
    console.error('Database connection error:', err);
});
