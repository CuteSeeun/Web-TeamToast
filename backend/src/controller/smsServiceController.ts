import { SolapiMessageService } from 'solapi';


interface SMSMessage {
    to: string;  //수신
    from: string; // 발신
    text: string; // 내용
}

interface SMSResponse {
    groupId?: string;
    messageId?: string;
    to?: string;
    from?: string;
    statusCode?: string;
    statusMessage?: string;
    accountId?: string;
}


// solapi 메시지 서비스 인스턴스 생성
// 환경 변수에서 api키와 시크릿 키를 가져와 초기화
const messageService = new SolapiMessageService(
   process.env.COOLSMS_API_KEY as string,
   process.env.COOLSMS_SECRET_KEY as string
);

//sms 전송 함수
// 수신 번호와 메시지 내용 받아 sms를 전송하고 결과 반환
export const sendSMS = async (to: string, text: string): Promise<SMSResponse> => {
   try {
    // 디버깅을 위한 인증 정보 로깅
       console.log('Using credentials:', {
           apiKey: process.env.COOLSMS_API_KEY,
           secretKey: process.env.COOLSMS_SECRET_KEY
       });

       // 메시지 데이터 구성
       const messageData: SMSMessage = {
           to,  // 수신번호
           from: process.env.COOLSMS_SENDER_NUMBER as string,  // 발신번호
           text  // 문자내용
       };

       // sms 전송 요청 및 응답 수신
       const response = (await messageService.send(messageData)) as SMSResponse;
       
       console.log('SMS sent successfully:', response);
       return response;
   } catch (error) {
       console.error('SMS 발송 오류:', error);
       throw error;
   }
};