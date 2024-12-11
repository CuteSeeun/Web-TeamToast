"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertComment = exports.getCommentsByIssueId = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const getCommentsByIssueId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const issueId = parseInt(req.params.isid, 10);
    if (isNaN(issueId)) {
        res.status(400).json({ error: 'Invalid issue ID' });
        return;
    }
    try {
        const query = `
            SELECT c.cid, c.content, c.timestamp, c.issue_id, u.uname AS user
            FROM Comment c
            JOIN User u ON c.user = u.email
            WHERE c.issue_id = ?
        `;
        const [rows] = yield dbpool_1.default.query(query, [issueId]);
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error occurred' });
    }
});
exports.getCommentsByIssueId = getCommentsByIssueId;
const insertComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('요청 본문:', req.body); // 로그 추가
    const issueId = parseInt(req.body.issueId, 10); // 수정: req.params가 아닌 req.body에서 가져오기
    const { content, timestamp, user } = req.body;
    if (isNaN(issueId)) {
        res.status(400).json({ error: 'Invalid issue ID' });
        return;
    }
    if (!content || !timestamp || !user) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const query = `
            INSERT INTO Comment (issue_id, content, timestamp, user)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = yield dbpool_1.default.query(query, [issueId, content, timestamp, user]);
        const newCommentId = result.insertId;
        const [rows] = yield dbpool_1.default.query('SELECT * FROM Comment WHERE cid = ?', [newCommentId]);
        console.log('삽입된 댓글:', rows[0]); // 로그 추가
        res.status(201).json(rows[0]);
    }
    catch (error) {
        console.error('Server error occurred:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
});
exports.insertComment = insertComment;
