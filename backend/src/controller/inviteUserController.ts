import { Request, Response } from "express";
import db from "../config/dbpool";

export const inviteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, space_id, role } = req.body;

  if (!email || !space_id || !role) {
    res.status(400).json({ message: "모든 필드를 입력하세요." });
    return;
  }

  try {
    // 사용자 확인
    const [user]: any = await db.execute("SELECT * FROM User WHERE email = ?", [
      email,
    ]);

    if (!user.length) {
      res.status(404).json({
        message: "사용자가 존재하지 않습니다. 회원가입이 필요합니다.",
      });
      return;
    }

    // 이미 초대된 사용자인지 확인
    const [existingRole]: any = await db.execute(
      "SELECT * FROM UserRole WHERE user = ? AND space_id = ?",
      [email, space_id]
    );

    if (existingRole.length > 0) {
      res.status(409).json({ message: "이미 초대된 사용자입니다." });
      return;
    }

    // 새로운 초대 생성
    await db.execute(
      "INSERT INTO UserRole (role, user, space_id) VALUES (?, ?, ?)",
      [role, email, space_id]
    );

    res.status(200).json({ message: "사용자가 성공적으로 초대되었습니다." });
  } catch (error) {
    console.error("초대 처리 중 오류 발생:", error);
    res.status(500).json({ message: "사용자 초대 중 오류가 발생했습니다." });
  }
};

export default inviteUser;
