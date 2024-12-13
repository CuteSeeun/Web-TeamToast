import { Request, Response } from "express";
import db from "../config/dbpool";

export const getTeamMembers = async (req: Request, res: Response) => {
  const spaceId = Number(req.query.spaceId);

  if (!spaceId) {
    res.status(400).json({ message: "Missing spaceId" });
    return;
  }

  try {
    const [members]: any = await db.execute(
      `SELECT u.uname AS name, u.email, ur.role
       FROM UserRole ur
       JOIN User u ON ur.user = u.email
       WHERE ur.space_id = ?`,
      [spaceId]
    );

    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { spaceId, email, role } = req.body;

  if (!spaceId || !email || !role) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 역할 업데이트
    const [result]: any = await connection.execute(
      `UPDATE UserRole SET role = ? WHERE user = ? AND space_id = ?`,
      [role, email, spaceId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "No matching user found" });
      await connection.rollback();
      return;
    }

    // 만약 역할이 top_manager로 변경되었다면 Subscription 테이블의 이메일도 업데이트
    if (role === "top_manager") {
      const [updateSubscription]: any = await connection.execute(
        `UPDATE Subscription SET email = ? WHERE spaceId = ?`,
        [email, spaceId]
      );

      if (updateSubscription.affectedRows === 0) {
        res.status(404).json({
          message: "No subscription found for the given spaceId",
        });
        await connection.rollback();
        return;
      }
    }

    await connection.commit();
    res
      .status(200)
      .json({ message: "Role and subscription updated successfully" });
  } catch (error) {
    console.error("Error updating role and subscription:", error);
    await connection.rollback();
    res.status(500).json({ message: "Failed to update role and subscription" });
  } finally {
    connection.release();
  }
};

export const removeMember = async (req: Request, res: Response) => {
  const { spaceId, email } = req.body;

  if (!spaceId || !email) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const [result]: any = await db.execute(
      `DELETE FROM UserRole WHERE user = ? AND space_id = ?`,
      [email, spaceId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "No matching user found to remove" });
      return;
    }

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing team member:", error);
    res.status(500).json({ message: "Failed to remove team member" });
  }
};

// 권한 변경 후 롤 다시 가져오는 로직
export const getUserRole = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    res.status(400).json({ message: "이메일이 없습니다." });
    return;
  }

  try {
    // query =< execute 같은 기능 인데 execute가 상위호환느낌이다.
    // 앞으로 execute만 쓰자
    const [result]: any = await db.execute(
      `select role from UserRole where user = ? and space_id = (select sid from Space order by last_accessed_at desc limit 1)`,
      [email]
    );
    if (!result.length) {
      res.status(404).json({ message: "Role not found for the user" });
      return;
    }
    res.status(200).json({ role: result[0].role });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "롤 가져오기 실패" });
  }
};
