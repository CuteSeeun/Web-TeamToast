//@ts-ignore
import schedule from "node-schedule";
import db from "./config/dbpool"; // DB 연결
import { processRecurringPayment } from "./tossApiClient"; // Toss API 호출

export const scheduledRecurringPayments = () => {
  // 매일 0시에 스케줄 실행
  schedule.scheduleJob("0 0 * * *", async () => {
    console.log("Checking for scheduled payments...");

    try {
      // DB에서 오늘 자동 결제가 필요한 항목 조회
      const [rows]: any = await db.execute(
        `SELECT crId, subId, billingKey, totalAmount, customerKey, orderId, orderName
         FROM Credit
         WHERE nextBillingDate = CURDATE() AND status = 'active'`
      );

      if (rows.length === 0) {
        console.log("No scheduled payments for today.");
        return;
      }

      // 조회된 항목에 대해 반복 처리
      for (const row of rows) {
        const {
          crId,
          subId,
          billingKey,
          totalAmount,
          customerKey,
          orderId,
          orderName,
        } = row;

        try {
          // Toss API로 자동 결제 요청
          const paymentResponse = await processRecurringPayment(billingKey, {
            amount: totalAmount,
            customerKey,
            orderId,
            orderName,
          });

          console.log(`Payment successful for ID ${crId}`, paymentResponse);

          // 다음 결제 예정일 계산
          const nextBillingDate = new Date();
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
          const formattedNextBillingDate = nextBillingDate
            .toISOString()
            .split("T")[0];

          // 결제 성공 시 DB 업데이트
          await db.execute(
            `UPDATE Credit
             SET lastTransactionKey = ?, nextBillingDate = ?, status = 'active'
             WHERE crId = ?`,
            [paymentResponse.lastTransactionKey, formattedNextBillingDate, crId]
          );
        } catch (error: any) {
          // 결제 실패 시 상태 업데이트
          console.error(`Payment failed for ID ${crId}:`, error.message);
          await db.execute(
            `UPDATE Credit SET status = 'failed' WHERE crId = ?`,
            [crId]
          );
        }
      }
    } catch (error: any) {
      // 전체 스케줄 처리 실패
      console.error("Error processing scheduled payments:", error.message);
    }
  });
};
