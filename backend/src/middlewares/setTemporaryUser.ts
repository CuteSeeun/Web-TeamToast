// 2024-11-29 한채경
// setTemporaryUser.ts
import { RequestHandler } from "express";

export const setTemporaryUser2: RequestHandler = (req, res, next) => {
  // 임시로 설정된 사용자 정보
  req.user = {
    uid: 2, // 사용자 ID
    email: 'jane.smith@example.com', // 사용자 이메일
    uname: 'Jane Smith', // 사용자 이름
  };
  next();
};