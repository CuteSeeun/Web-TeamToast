import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import {convertToMySQLTimestamp, saveMessageToDB} from './utils/socket';

interface Message {
  mid: number;       
  rid: number;       
  content: string;    
  timestamp: string;  
  user_email: string; 
  user: string; 
};


export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      // origin: 'http://localhost:3000',
      origin: "*",
      credentials: true,
    },
  });

  //연결
  io.on('connection', async (socket) => {
    console.log(`연결된 클라이언트의 socket ID: ${socket.id}`);

    // 연결 종료
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      console.log('소켓 연결 끊김');
    });

    //특정 채널(Room)에 참가
    socket.on('joinRoom', async (rid: number) => {
      console.log("백엔드가 받은 rid", rid);
      socket.join(rid.toString()); // 해당 Room에 참가
      console.log(`!!!!!!야야 클라이언트 방 들어갓대 ${rid}번방!!!!!`);
    });

    // 클라이언트로부터 메시지 전송
    socket.on('sendMessage', async (messageData: Message) => {
      try {
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
