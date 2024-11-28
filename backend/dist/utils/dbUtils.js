"use strict";
// 2024-11-25 한채경
// dbUtils.ts
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
exports.executeQuery = void 0;
// DB 커넥션 유틸 함수
const dbpool_1 = __importDefault(require("../config/dbpool"));
const executeQuery = (queryFunction) => __awaiter(void 0, void 0, void 0, function* () {
    let connection = null;
    try {
        connection = yield dbpool_1.default.getConnection();
        const result = yield queryFunction(connection);
        return result;
    }
    catch (err) {
        console.error(`DB작업 중 오류: ${err}`);
        throw err;
    }
    finally {
        if (connection)
            connection.release();
        console.log('DB connection released');
    }
    ;
});
exports.executeQuery = executeQuery;
