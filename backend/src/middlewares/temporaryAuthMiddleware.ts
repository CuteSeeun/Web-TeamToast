// 2024-11-25 한채경
// temporaryAuthMiddleware.ts
// 임시 사용자 데이터 (로그인 구현 시 삭제)

import { Request, Response, NextFunction } from 'express';

export const setTemporaryUser = (req: Request, res: Response, next: NextFunction) => {
  // 임시 사용자 정보 설정
  // req.userRole = {
  //   user: 'john.doe@example.com', // 테스트용 이메일
  //   role: 'normal', // 'manager' 또는 'top_manager' 중 하나로 테스트 가능
  //   space_id: 1,
  // };

  req.userRole = {
    user: 'jane.smith@example.com',
    role: 'manager', // 권한 있음
    space_id: 1,
  };
  
  // req.userRole = {
  //   user: 'kim.lee@example.com',
  //   role: 'top_manager', // 권한 있음
  //   space_id: 2,
  // };

  next();
};