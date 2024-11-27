"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dbpool.ts
const promise_1 = require("mysql2/promise");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = (0, promise_1.createPool)({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // DB_PASSWORD로 변경
    database: process.env.DB_DATABASE, // DB_DATABASE로 변경
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
    queueLimit: 0,
    connectTimeout: 60000,
});
console.log('Database Host:', process.env.DB_HOST);
console.log('Database User:', process.env.DB_USER);
console.log('Database Password:', process.env.DB_PASSWORD ? '******' : 'Not provided'); // DB_PASSWORD로 변경
console.log('Database Name:', process.env.DB_DATABASE); // DB_DATABASE로 변경
// 데이터베이스 연결 확인
pool.getConnection()
    .then(connection => {
    console.log('Database connected');
    connection.release();
})
    .catch(err => {
    console.error('Database connection error:', err);
});
exports.default = pool;
