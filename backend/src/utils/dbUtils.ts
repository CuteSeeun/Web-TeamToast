// 2024-11-25 한채경
// dbUtils.ts

// DB 커넥션 유틸 함수
import pool from '../config/dbpool';
import { PoolConnection } from 'mysql2/promise';

export const executeQuery = async <T>(queryFunction: (connection: PoolConnection) => Promise<T>): Promise<T> => {
    let connection: PoolConnection | null = null;
    try {
      connection = await pool.getConnection();
      const result = await queryFunction(connection);
      return result;
    } catch (err) {
      console.error(`DB작업 중 오류: ${err}`);
      throw err;
    } finally {
      if (connection) connection.release();
      console.log('DB connection released');
    };
  };