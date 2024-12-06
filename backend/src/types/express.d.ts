import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      userRole?: {
        user: string; // 사용자 이름
        role: string; // 사용자 권한
        space_id: number;
      };
    }
  }
}
