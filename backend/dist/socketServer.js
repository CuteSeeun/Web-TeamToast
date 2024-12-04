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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const dbpool_1 = __importDefault(require("./config/dbpool")); // 데이터베이스 연결
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
            socket.join(rid); // 해당 Room에 참가
            console.log(`해당 방에 사용자 추가함. 방id: ${rid}`);
        }));
        // 클라이언트로부터 메시지 전송
        socket.on('sendMessage', (messageData) => __awaiter(void 0, void 0, void 0, function* () {
            const { rid, user, content } = messageData;
            try {
                // 메시지를 데이터베이스에 저장
                const savedMessage = yield saveMessageToDB(rid, user, content);
                // Room에 있는 모든 사용자에게 메시지 전송
                io.to(rid).emit('newMessage', savedMessage);
                console.log('모든 사용자들에게 메시지 전송');
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
const saveMessageToDB = (rid, user, content) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        rid,
        user_email: user, // 클라이언트에서 받은 'user'를 'user_email' 컬럼에 매핑
        content,
        timestamp: new Date().toISOString(),
    };
    yield dbpool_1.default.query('INSERT INTO Message SET ?', message);
    return message;
});
