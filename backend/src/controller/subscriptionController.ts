import { Request, Response } from "express";
import db from "../config/dbpool";

export const getSubscriptionData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userEmail, spaceId } = req.query;

  if (!userEmail || !spaceId) {
    res.status(400).json({ message: "Missing userEmail or spaceId" });
    return;
  }

  try {
    // Subscription 상태 조회
    const [subscriptionResult]: any = await db.execute(
      `SELECT plan, \`limit\` FROM Subscription WHERE sId = ? LIMIT 1`,
      [spaceId]
    );
    const subscription = subscriptionResult[0]; // 첫 번째 요소 추출

    if (!subscription) {
      res.status(404).json({ message: "No subscription found." });
      return;
    }
    console.log("Subscription data:", subscription);

    // Credit 상태에서 카드 정보 조회
    const [creditResult]: any = await db.execute(
      `SELECT cardNumber FROM Credit WHERE customerKey = ? AND status = 'active' LIMIT 1`,
      [userEmail]
    );
    const credit = creditResult[0]; // 첫 번째 요소 추출
    console.log("Credit data:", credit);

    // 응답
    res.status(200).json({
      plan: subscription.plan,
      limit: subscription.limit || 10, // 기본 제한 인원
      cardNumber: credit?.cardNumber || null, // 카드 정보 없을 시 null
    });
  } catch (error: any) {
    console.error("Error fetching subscription data:", error.message);
    res.status(500).json({ message: "Failed to fetch subscription data" });
  }
};
