// 2024-11-25 한채경
// index.d.ts (임시)
import { PoolConnection } from 'mysql2/promise';


// Express Request 객체 타입 확장
declare global {
  namespace Express {
    interface Request {
      // jwt 토큰 정보용 (김현진)
      user?:{
        uid:number;
        uname:string;
        email : string;
      }
    };
  };
};