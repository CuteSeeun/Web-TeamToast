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
exports.getSprint = void 0;
const dbpool_1 = __importDefault(require("../config/dbpool")); // 디폴트 익스포트 가져오기
const getSprint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = Number(req.params.projectid);
    console.log(`Project ID: ${projectId}`); // 프로젝트 ID 로그 출력
    try {
        const [rows] = yield dbpool_1.default.query('SELECT * FROM Sprint WHERE project_id = ?', [projectId]);
        const sprints = rows;
        console.log(`Sprints: ${JSON.stringify(sprints)}`); // 스프린트 데이터 로그 출력
        res.json(sprints);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        }
        else {
            console.error('An unknown error occurred:', error);
        }
    }
});
exports.getSprint = getSprint;
