"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sprintRouter_1 = __importDefault(require("./routes/sprintRouter"));
const path_1 = __importDefault(require("path"));
const dbpool_1 = __importDefault(require("./config/dbpool"));
const billingRouter_1 = __importDefault(require("./routes/billingRouter")); //빌링키 발급 api 요청
const subscriptionRouter_1 = __importDefault(require("./routes/subscriptionRouter")); //빌링키 발급 api 요청
const scheduledPayment_1 = require("./scheduledPayment");
const teamRouter_1 = __importDefault(require("./routes/teamRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// 정적 파일 서빙 설정
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/sprint", sprintRouter_1.default); // 라우터 등록
app.use("/billing", billingRouter_1.default);
app.use("/subscription", subscriptionRouter_1.default);
app.use("/team", teamRouter_1.default);
//스케쥴링 작업 시작
(0, scheduledPayment_1.scheduledRecurringPayments)();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
// 데이터베이스 연결 확인
dbpool_1.default
    .getConnection()
    .then((connection) => {
    console.log("Database connected");
    connection.release();
})
    .catch((err) => {
    console.error("Database connection error:", err);
});
