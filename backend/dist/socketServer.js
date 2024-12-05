"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const dbpool_1 = __importDefault(require("./config/dbpool")); // 데이터베이스 연결
;
// 시간을 변환하는 유틸 함수
const convertToMySQLTimestamp = (time) => {
    const [period, timePart] = time.split(' '); // '오후', '7:40:40' 분리
    let [hours, minutes, seconds] = timePart.split(':').map(Number);
    if (period === '오후' && hours < 12)
        hours += 12; // 오후일 경우 시간 +12
    if (period === '오전' && hours === 12)
        hours = 0; // 오전 12시는 0시로 변환
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // 변환된 날짜와 시간 결합
    return `${year}-${month}-${day} ${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
};
// Socket.IO 초기화 함수
const initSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000', // 프론트엔드 URL<- 허락해줄 주소
            // methods: ['GET', 'POST'],
        },
    });
    //서버측 : 나한테 연결할 사람~? (매개변수는 연결된 사람)
    //연결
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`연결된 클라이언트의 socket ID: ${socket.id}`);
        // 연결 종료 처리
        //끊김
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
        // 프론트에서 방참가를 들음 : 특정 채널(Room)에 참가
        socket.on('joinRoom', (rid) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("백엔드가 받은 rid", rid);
            //rid, email, uname을 저장?
            //이미 재방문한 유저는 유저 정보를 새로 만들어주지 않는다.
            //1. 이미 있는 유저인지 확인
            //2. 없다면 새로 유저 정보 만들기
            //3. 이미 있는 유저라면 연결정보 token 값만 바꿔주자.
            socket.join(rid.toString()); // 해당 Room에 참가
            console.log(`!!!!!!야야 클라이언트 방 들어갓대 ${rid}번방!!!!!`);
        }));
        // 클라이언트로부터 메시지 전송
        socket.on('sendMessage', (messageData) => __awaiter(void 0, void 0, void 0, function* () {
            const { mid, rid, content, timestamp, user_email, user } = messageData;
            try {
                // 클라이언트에서 받은 timestamp를 변환
                const convertedTimestamp = convertToMySQLTimestamp(messageData.timestamp);
                // 메시지를 데이터베이스에 저장
                // const savedMessage = await saveMessageToDB({
                //   mid,
                //   rid,
                //   content,
                //   timestamp,
                //   user_email,
                //   user,
                // });
                const savedMessage = yield saveMessageToDB(Object.assign(Object.assign({}, messageData), { timestamp: convertedTimestamp }));
                // Room에 있는 모든 사용자에게 메시지 전송
                io.to(messageData.rid.toString()).emit('newMessage', savedMessage);
                console.log('!!서버는 모든 사용자들에게 메시지 전송한다!!!');
            }
            catch (error) {
                console.error('Error saving message:', error);
            }
        }));
    }));
    console.log('Socket.IO initialized');
};
exports.initSocket = initSocket;
// 메시지를 데이터베이스에 저장하는 함수
const saveMessageToDB = (message) => __awaiter(void 0, void 0, void 0, function* () {
    //   const dbMessage = {
    //     mid,
    //  // 클라이언트에서 받은 'user'를 'user_email' 컬럼에 매핑
    //     content,
    //     timestamp: new Date().toISOString(),
    //     user, 
    //     user_email,
    //   };
    // await pool.query('INSERT INTO Message SET ?', message);
    // return message;
    // message 객체에서 user 필드를 제외한 새로운 객체 생성
    const { mid, user } = message, dbMessage = __rest(message, ["mid", "user"]);
    // dbMessage를 테이블에 삽입
    yield dbpool_1.default.query('INSERT INTO Message SET ?', dbMessage);
    return message; // 원래의 message를 반환 (필요하면 반환값도 수정 가능)
});
