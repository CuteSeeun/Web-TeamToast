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
exports.getProjectManagers = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool"));
const getProjectManagers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.projectid, 10);
    if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
    }
    try {
        const query = `
            SELECT DISTINCT User.uname AS manager
            FROM User
            JOIN Issue ON User.email = Issue.manager
            WHERE Issue.project_id = ?;
        `;
        const [rows] = yield dbpool_1.default.query(query, [projectId]);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching project managers' });
    }
});
exports.getProjectManagers = getProjectManagers;
