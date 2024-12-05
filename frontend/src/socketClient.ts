import { io, Socket } from 'socket.io-client';

interface Message {
  mid: number;       // 메시지 ID (고유값, UUID 사용 권장)
  rid: number;       // 방 ID
  content: string;    // 메시지 내용
  timestamp: string;  // 메시지가 생성된 시간 (ISO 8601 형식)
  user_email: string; // 보낸 사용자 이메일
  user: string;  // 보낸 사용자 이름
};

// 전역 소켓 객체
let socket: Socket | null = null;

// 서버 연결
export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:3001'); // 백엔드 URL
    console.log('야야야야야야야 소켓 연결된다.');
    console.log('Socket connected:', socket.id);
  }
  return socket;

  /*이 코드에서는 소켓 연결만 처리한다. 방 참여(joinRoom)는 소켓 연결 이후에 따로 처리해야 한다.
  방 참여는 다른 프론트코드에서 채널 클릭할 때 해준다. 
  */
};

// 서버 연결 종료
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Socket disconnected');
    socket = null;
  }
};

// 방 참가
export const joinRoom = (rid: number) => {
  if (socket) {
    socket.emit('joinRoom', rid);
    console.log(`!!클라이언트가 ${rid}방에 참가함!!`);
  }
};

// 메시지 보내기
export const sendMessage = (messageData: Message) => { //{ mid: number; content: string; timestamp:string; user: string; user_emial:string;}
  if (socket) {
    socket.emit('sendMessage', messageData);
    console.log('!!특정 사용자가 메시지 보낸걸 받았다!!', messageData);
  }
};

// 메시지 수신 핸들러 등록
export const onMessage = (callback: (message: any) => void) => {
  if (socket) {
    socket.on('newMessage', callback);
    console.log('!!!모든 클라이언트들에게 메시지 보내줄게!!!');
  }
};

// 메시지 수신 핸들러 제거
export const offMessage = () => {
  if (socket) {
    socket.off('newMessage');
    console.log('Message listener removed');
  }
};


/* 채팅방 예시 코드
const ChatRoom = ({ rid, user }: { rid: number; user: string }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState<string>('');
  
    useEffect(() => {
      // 서버와 소켓 연결
      connectSocket();
  
      // 방 참가
      joinRoom(rid);
  
      // 메시지 수신 처리
      onMessage((message) => {
        console.log('Received message:', message);
        setMessages((prev) => [...prev, message]);
      });
  
      return () => {
        // 소켓 연결 해제 및 핸들러 제거
        offMessage();
        disconnectSocket();
      };
    }, [rid]);
  
    const handleSendMessage = () => {
      if (input.trim()) {
        sendMessage({ rid, user, content: input });
        setInput(''); // 입력 초기화
      }
    };
  
    return (
      <div>
        <h2>Room ID: {rid}</h2>
        <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ddd', marginBottom: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.user_email}:</strong> {msg.content} <em>({msg.timestamp})</em>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    );
  };
  
  export default ChatRoom;

코드 흐름 요약
소켓 연결: connectSocket을 호출하여 서버와 연결합니다.
방 참여: joinRoom을 호출해 사용자가 특정 방에 참가합니다.
메시지 전송: 사용자가 메시지를 입력하고 전송 버튼을 누르면 sendMessage를 호출하여 서버로 메시지를 보냅니다.
메시지 수신: 서버에서 newMessage 이벤트를 통해 메시지를 브로드캐스트하면, 클라이언트는 onMessage로 이를 수신하여 화면에 렌더링합니다.
연결 해제: 컴포넌트가 언마운트되거나 방을 나가면 disconnectSocket으로 소켓 연결을 종료합니다.
  */