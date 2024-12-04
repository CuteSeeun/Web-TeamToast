import { Request, Response } from "express";
import db from "../config/dbpool";

// 최고 관리자 확인 API
export const checkAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userEmail, spaceId } = req.query;

  if (!userEmail || !spaceId) {
    res.status(400).json({ message: "Missing userEmail or spaceId" });
    return;
  }

  try {
    const [adminResult]: any = await db.execute(
      `SELECT COUNT(*) as isAdmin FROM Space WHERE adminEmail = ? AND id = ?`,
      [userEmail, spaceId]
    );
    const isAdmin = adminResult[0].isAdmin > 0;

    res.status(200).json({ isAdmin });
  } catch (error: any) {
    console.error("Error checking admin status:", error.message);
    res.status(500).json({ message: "Failed to check admin status" });
  }
};

// 구독 정보 조회 API
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
      `SELECT plan, \`limit\` FROM Subscription WHERE spaceId = ? LIMIT 1`,
      [spaceId]
    );
    const subscription = subscriptionResult[0];

    if (!subscription) {
      res.status(404).json({ message: "No subscription found." });
      return;
    }

    // Credit 상태에서 카드 정보 조회
    const [creditResult]: any = await db.execute(
      `SELECT cardNumber FROM Credit WHERE customerKey = ? AND status = 'active' LIMIT 1`,
      [userEmail]
    );
    const credit = creditResult[0];

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

// 무료 요금제로 변경 API (유료=>무료 변경 전용)
export const changeToFreePlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { spaceId } = req.body;

  if (!spaceId) {
    res.status(400).json({ message: "Missing spaceId" });
    return;
  }

  try {
    const [updateResult]: any = await db.execute(
      `UPDATE Subscription
       SET plan = 'basic', \`limit\` = 10, nextBillingDate = NULL, updatedAt = NOW()
       WHERE spaceId = ?`,
      [spaceId]
    );

    if (updateResult.affectedRows === 0) {
      res.status(404).json({ message: "No subscription found to update." });
      return;
    }

    res.status(200).json({ message: "무료 요금제로 변경 완료" });
  } catch (error: any) {
    console.error("Error changing to free plan:", error.message);
    res.status(500).json({ message: "Failed to change to free plan" });
  }
};

// 유료 요금제로 업그레이드 API (무료=>유료 변경 전용)
export const upgradeToPaidPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { spaceId, userEmail, additionalMembers } = req.body;

  if (!spaceId || !userEmail || additionalMembers === undefined) {
    res.status(400).json({ message: "Missing required parameters" });
    return;
  }

  const connection = await db.getConnection();
  try {
    const limit = 10 + (additionalMembers || 0); // 기본 10명 + 추가 인원

    console.log("Starting transaction...");
    await connection.beginTransaction();

    console.log(
      `Updating subscription for spaceId: ${spaceId}, limit: ${limit}`
    );
    const [result]: any = await connection.execute(
      `UPDATE Subscription 
       SET plan = ?, \`limit\` = ?, nextBillingDate = DATE_ADD(NOW(), INTERVAL 1 MONTH), updatedAt = CURRENT_TIMESTAMP 
       WHERE spaceId = ?`,
      ["team", limit, spaceId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Subscription update failed, no rows affected.");
    }

    console.log("Update result:", result);

    console.log("Committing transaction...");
    await connection.commit();

    console.log("Transaction committed successfully");
    res
      .status(200)
      .json({ message: "Subscription upgraded to paid plan successfully" });
  } catch (error: any) {
    console.error("Error occurred during transaction:", error.message);

    // 트랜잭션 롤백
    if (connection) {
      console.log("Rolling back transaction...");
      await connection.rollback();
    }

    res
      .status(500)
      .json({ message: "Failed to upgrade subscription to paid plan" });
  } finally {
    if (connection) {
      console.log("Releasing connection...");
      connection.release();
    }
  }
};

// 추가 인원 변경 (유료 → 유료 변경 전용)
export const updatedLimit = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { spaceId, additionalMembers } = req.body;

  if (!spaceId || additionalMembers === undefined) {
    res.status(400).json({ message: "Missing required parameters" });
    return;
  }

  try {
    // Subscription 상태 확인
    const [subscriptionResult]: any = await db.execute(
      `SELECT plan FROM Subscription WHERE spaceId = ? LIMIT 1`,
      [spaceId]
    );
    const subscription = subscriptionResult[0];

    if (!subscription) {
      res.status(404).json({ message: "No subscription found." });
      return;
    }

    if (subscription.plan !== "team") {
      // 현재 플랜이 유료가 아니면 에러 반환
      res.status(400).json({
        message: "Additional members can only be updated for paid plans.",
      });
      return;
    }

    const newLimit = 10 + additionalMembers; // 기본 10명 + 추가 인원
    console.log(
      `Updating limit for spaceId: ${spaceId}, new limit: ${newLimit}`
    );

    const [updateResult]: any = await db.execute(
      `UPDATE Subscription
       SET \`limit\` = ?, updatedAt = NOW()
       WHERE spaceId = ?`,
      [newLimit, spaceId]
    );

    if (updateResult.affectedRows === 0) {
      res
        .status(404)
        .json({ message: "No subscription found to update the limit." });
      return;
    }

    res.status(200).json({
      message: "Subscription limit updated successfully",
      newLimit,
    });
  } catch (error: any) {
    console.error("Error updating subscription limit:", error.message);
    res.status(500).json({ message: "Failed to update subscription limit" });
  }
};
