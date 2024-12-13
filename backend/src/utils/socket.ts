import pool from '../config/dbpool'; 
export interface Message {
    mid: number;       
    rid: number;       
    content: string;    
    timestamp: string;  
    user_email: string; 
    user: string; 
  };

// 시간을 변환하는 유틸 함수
export const convertToMySQLTimestamp = (time: string): string => {
    const [period, timePart] = time.split(' '); // '오후', '7:40:40' 분리
    let [hours, minutes, seconds] = timePart.split(':').map(Number);
  
    if (period === '오후' && hours < 12) hours += 12; // 오후일 경우 시간 +12
    if (period === '오전' && hours === 12) hours = 0; // 오전 12시는 0시로 변환
  
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    // 변환된 날짜와 시간 결합
    return `${year}-${month}-${day} ${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
  };

  // 메시지를 데이터베이스에 저장하는 함수
export const saveMessageToDB = async (message: Message) => {
    const { mid, user, ...dbMessage } = message;
    await pool.query('INSERT INTO Message SET ?', dbMessage);
    return message;
  };