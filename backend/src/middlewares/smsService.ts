import { SolapiMessageService } from 'solapi';

interface SMSMessage {
    to: string;
    from: string;
    text: string;
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



const messageService = new SolapiMessageService(
   process.env.COOLSMS_API_KEY as string,
   process.env.COOLSMS_SECRET_KEY as string
);

export const sendSMS = async (to: string, text: string): Promise<SMSResponse> => {
   try {
       console.log('Using credentials:', {
           apiKey: process.env.COOLSMS_API_KEY,
           secretKey: process.env.COOLSMS_SECRET_KEY
       });

       const messageData: SMSMessage = {
           to,  // 수신번호
           from: process.env.COOLSMS_SENDER_NUMBER as string,  // 발신번호
           text  // 문자내용
       };

       const response = (await messageService.send(messageData)) as SMSResponse;
       
       console.log('SMS sent successfully:', response);
       return response;
   } catch (error) {
       console.error('SMS 발송 오류:', error);
       throw error;
   }
};