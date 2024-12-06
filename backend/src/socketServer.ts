import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import pool from './config/dbpool'; // 데이터베이스 연결

interface Message {
  mid: number;       // 메시지 ID (고유값, UUID 사용 권장)
  rid: number;       // 방 ID
  content: string;    // 메시지 내용
  timestamp: string;  // 메시지가 생성된 시간 (ISO 8601 형식)
  user_email: string; // 보낸 사용자 이메일
  user: string; //보낸 사용자 이름
};

// 시간을 변환하는 유틸 함수
const convertToMySQLTimestamp = (time: string): string => {
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

// Socket.IO 초기화 함수
export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000', // 프론트엔드 URL<- 허락해줄 주소
      // methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  //서버측 : 나한테 연결할 사람~? (매개변수는 연결된 사람)
  //연결
  io.on('connection', async (socket) => {
    console.log(`연결된 클라이언트의 socket ID: ${socket.id}`);

    // 연결 종료 처리
    //끊김
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      console.log('소켓 연결 끊김');
    });

    // 프론트에서 방참가를 들음 : 특정 채널(Room)에 참가
    socket.on('joinRoom', async (rid: number) => {
      console.log("백엔드가 받은 rid", rid);

      //rid, email, uname을 저장?
      //이미 재방문한 유저는 유저 정보를 새로 만들어주지 않는다.
      //1. 이미 있는 유저인지 확인
      //2. 없다면 새로 유저 정보 만들기
      //3. 이미 있는 유저라면 연결정보 token 값만 바꿔주자.
      
      socket.join(rid.toString()); // 해당 Room에 참가
      console.log(`!!!!!!야야 클라이언트 방 들어갓대 ${rid}번방!!!!!`);
    });

    // 클라이언트로부터 메시지 전송
    socket.on('sendMessage', async (messageData: Message) => {
      // const { mid, rid, content, timestamp, user_email, user } = messageData;

      try {
        // 클라이언트에서 받은 timestamp를 변환
        const convertedTimestamp = convertToMySQLTimestamp(messageData.timestamp);
        const savedMessage = await saveMessageToDB({
          ...messageData,
          timestamp: convertedTimestamp,
        });

        // Room에 있는 모든 사용자에게 메시지 전송
        io.to(messageData.rid.toString()).emit('newMessage', savedMessage);
        console.log('!!서버는 모든 사용자들에게 메시지 전송한다!!!');
        console.log('서버가 모든 클라이언트들에게 보내주는 메시지:', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });
  });

  return io;
}; 

// 메시지를 데이터베이스에 저장하는 함수
const saveMessageToDB = async (message: Message) => {
  // message 객체에서 user 필드를 제외한 새로운 객체 생성
  const { mid, user, ...dbMessage } = message;
  // dbMessage를 테이블에 삽입
  await pool.query('INSERT INTO Message SET ?', dbMessage);
  return message; // 원래의 message를 반환 (필요하면 반환값도 수정 가능)
};
