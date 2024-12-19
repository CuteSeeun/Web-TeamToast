import { Request, Response } from "express";
import db from "../config/dbpool";
import { updateCreditAmount } from "../controller/billingController";
import { updateTossPaymentAmount } from "../tossApiClient";
import axios from "axios";

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
    // Subscription 테이블에서 최고 관리자를 확인
    const [adminResult]: any = await db.execute(
      `SELECT COUNT(*) as isAdmin FROM Subscription WHERE email = ? AND spaceId = ?`,
      [userEmail, spaceId]
    );

    // isAdmin이 1 이상이면 최고 관리자
    const isAdmin = adminResult[0].isAdmin > 0;

    res.status(200).json({ isAdmin });
  } catch (error: any) {
    console.error("Error checking admin status:", error.message);
    res.status(500).json({ message: "Failed to check admin status" });
  }
};

export const fetchUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { spaceId } = req.query;

  // 요청 파라미터 검증
  if (!spaceId) {
    res.status(400).json({ message: "Missing spaceId" });
    return;
  }

  try {
    // Subscription 테이블에서 spaceId를 기반으로 subId 가져오기
    const [subscriptionResult]: any = await db.execute(
      `SELECT subId AS subscriptionId FROM Subscription WHERE spaceId = ? LIMIT 1`,
      [spaceId]
    );

    if (!subscriptionResult || subscriptionResult.length === 0) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }

    const subscriptionId = subscriptionResult[0].subscriptionId;

    // 응답 반환
    res.status(200).json({ subscriptionId });
  } catch (error: any) {
    console.error("Error fetching subscription details:", error.message);
    res.status(500).json({ message: "Failed to fetch subscription details" });
  }
};

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
      `SELECT plan, \`limit\`, nextBillingDate FROM Subscription WHERE spaceId = ? LIMIT 1`,
      [spaceId]
    );

    const subscription = subscriptionResult[0];

    if (!subscription) {
      res.status(404).json({ message: "No subscription found." });
      return;
    }

    let cardNumber: string | null = null;
    let monthlyFee: number | null = null;

    if (subscription.plan === "team") {
      // 카드 정보 조회
      const [creditResult]: any = await db.execute(
        `SELECT cardNumber FROM Credit WHERE customerKey = ? AND status = 'active' LIMIT 1`,
        [userEmail]
      );
      const credit = creditResult[0];
      cardNumber = credit?.cardNumber || null;

      // 월별 결제 금액 계산
      const additionalMembers = Math.max(subscription.limit - 10, 0);
      monthlyFee = additionalMembers * 3000;
    }

    // 응답 데이터 반환
    res.status(200).json({
      plan: subscription.plan,
      limit: subscription.limit || 10,
      cardNumber,
      nextBillingDate: subscription.nextBillingDate,
      monthlyFee,
    });
  } catch (error: any) {
    console.error("Error fetching subscription data:", error.message);
    res.status(500).json({ message: "Failed to fetch subscription data" });
  }
};

export const changeToFreePlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { spaceId } = req.body;

  if (!spaceId) {
    res.status(400).json({ message: "Missing spaceId" });
    return;
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // `spaceId`로 `subId` 조회
    const [subIdResult]: any = await connection.execute(
      `SELECT subId FROM Subscription WHERE spaceId = ? LIMIT 1`,
      [spaceId]
    );

    if (!subIdResult || subIdResult.length === 0) {
      throw new Error("No subscription found for the given spaceId.");
    }

    const subId = subIdResult[0].subId;

    // Subscription 테이블 업데이트
    await connection.execute(
      `UPDATE Subscription
       SET plan = 'basic', \`limit\` = 10, nextBillingDate = NULL, updatedAt = NOW()
       WHERE spaceId = ?`,
      [spaceId]
    );

    // Credit 테이블 업데이트
    const [updateCreditResult]: any = await connection.execute(
      `UPDATE Credit
       SET status = 'canceled', updatedAt = NOW()
       WHERE subId = ? AND status = 'active'`,
      [subId]
    );

    if (updateCreditResult.affectedRows > 0) {
      console.log("Credit records canceled successfully.");
    }

    await connection.commit();
    res.status(200).json({ message: "무료 요금제로 변경 완료" });
  } catch (error: any) {
    console.error("Error changing to free plan:", error.message);
    await connection.rollback();
    res.status(500).json({ message: "Failed to change to free plan" });
  } finally {
    connection.release();
  }
};

// 추가 인원 계산 함수
const calculateLimit = (additionalMembers: number): number =>
  10 + additionalMembers;

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
    const limit = calculateLimit(additionalMembers);

    await connection.beginTransaction();

    await connection.execute(
      `UPDATE Subscription 
       SET plan = 'team', \`limit\` = ?, nextBillingDate = DATE_ADD(NOW(), INTERVAL 1 MONTH), updatedAt = CURRENT_TIMESTAMP 
       WHERE spaceId = ?`,
      [limit, spaceId]
    );

    await connection.commit();
    res
      .status(200)
      .json({ message: "Subscription upgraded to paid plan successfully" });
  } catch (error: any) {
    console.error("Error occurred during transaction:", error.message);
    await connection.rollback();
    res
      .status(500)
      .json({ message: "Failed to upgrade subscription to paid plan" });
  } finally {
    connection.release();
  }
};

export const updatedLimit = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { spaceId, additionalMembers, customerKey } = req.body;

  if (!spaceId || additionalMembers === undefined || !customerKey) {
    res.status(400).json({ message: "Missing required parameters" });
    return;
  }

  const newLimit = 10 + additionalMembers; // 새로운 사용자 수
  const unitPrice = 3000; // 사용자당 월 요금

  try {
    // Subscription 정보 가져오기
    const [subscriptionResult]: any = await db.execute(
      `SELECT \`limit\`, nextBillingDate, updatedAt FROM Subscription WHERE spaceId = ? LIMIT 1`,
      [spaceId]
    );

    if (!subscriptionResult || subscriptionResult.length === 0) {
      res.status(404).json({ message: "No subscription found." });
      return;
    }

    const {
      limit: currentLimit,
      nextBillingDate,
      updatedAt,
    } = subscriptionResult[0];
    const previousLimit = currentLimit || 10; // 기존 사용자 수
    const billingEndDate = new Date(nextBillingDate); // 결제 주기 종료일
    const billingStartDate = new Date(updatedAt); // 결제 주기 시작일
    const today = new Date();

    // 남은 일 수와 결제 주기 총 일 수 계산
    const remainingDays = Math.max(
      0,
      Math.ceil(
        (billingEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const totalDaysInCycle = Math.ceil(
      (billingEndDate.getTime() - billingStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // 변경된 사용자 수
    const deltaUsers = newLimit - previousLimit;

    // 비례 금액 계산
    const proRataAmount =
      deltaUsers * unitPrice * (remainingDays / totalDaysInCycle);

    // Credit 테이블 업데이트
    const [creditResult]: any = await db.execute(
      `SELECT billingKey, totalAmount FROM Credit WHERE customerKey = ? AND status = 'active' LIMIT 1`,
      [customerKey]
    );

    if (!creditResult || creditResult.length === 0) {
      res.status(404).json({ message: "No active credit found." });
      return;
    }

    const { totalAmount } = creditResult[0];
    const newTotalAmount = totalAmount + proRataAmount; // 새로운 총 금액

    await db.execute(
      `UPDATE Credit
       SET totalAmount = ?, updatedAt = NOW()
       WHERE customerKey = ? AND status = 'active'`,
      [newTotalAmount, customerKey]
    );

    // Subscription 테이블 업데이트
    await db.execute(
      `UPDATE Subscription
       SET \`limit\` = ?, updatedAt = NOW()
       WHERE spaceId = ?`,
      [newLimit, spaceId]
    );

    res.status(200).json({
      message: "Subscription limit updated with pro-rata calculation.",
      newLimit,
      proRataAmount,
      newTotalAmount,
    });
  } catch (error: any) {
    console.error("Error in updatedLimit:", error.message);
    res.status(500).json({ message: "Failed to update subscription limit." });
  }
};
