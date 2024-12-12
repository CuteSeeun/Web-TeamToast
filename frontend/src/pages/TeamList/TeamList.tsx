import React from "react";
import * as Styled from "./teamStyle";
import axios from "axios";

const currentUserRole = sessionStorage.getItem("userRole"); // 현재 사용자 역할

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface TeamListProps {
  teamMembers: TeamMember[];
  currentUserRole: String;
  onOpenInviteModal: () => void; // 초대 모달 열기 함수
  onReload: () => void; // 목록 갱신 함수
  spaceId: number; // 현재 Space ID
}

const TeamList: React.FC<TeamListProps> = ({
  teamMembers,
  onOpenInviteModal,
  onReload,
  spaceId,
  currentUserRole,
}) => {
  // 권한 변경 API 호출
  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      if (newRole === "top_manager") {
        // 최고관리자로 변경하려는 경우
        const confirmChange = window.confirm(
          "다른 사람을 최고관리자로 설정하면 기존 최고관리자는 관리자로 변경됩니다. 계속하시겠습니까?"
        );
        if (!confirmChange) return;

        // 기존 최고관리자를 관리자로 변경
        const currentTopManager = teamMembers.find(
          (member) => member.role === "top_manager"
        );
        if (currentTopManager && currentTopManager.email !== email) {
          await axios.put("http://localhost:3001/team/update-role", {
            email: currentTopManager.email,
            role: "manager",
            spaceId,
          });

          // 만약 현재 사용자가 최고관리자에서 변경되었다면 sessionStorage 업데이트
          if (currentTopManager.email === sessionStorage.getItem("userEmail")) {
            sessionStorage.setItem("userRole", "manager");
          }
        }
      }

      // 선택한 멤버의 역할 변경
      await axios.put("http://localhost:3001/team/update-role", {
        email,
        role: newRole,
        spaceId,
      });

      // 만약 현재 사용자의 역할이 변경되었다면 sessionStorage 업데이트
      if (email === sessionStorage.getItem("userEmail")) {
        sessionStorage.setItem("userRole", newRole);
      }

      await onReload(); // 목록 갱신
      const updatedRole = sessionStorage.getItem("userRole");
      console.log("Updated role after reload:", updatedRole);
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("권한 변경에 실패했습니다.");
    }
  };

  // 멤버 삭제 API 호출
  const handleDeleteMember = async (email: string) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await axios.delete("http://localhost:3001/team/remove", {
          data: { email, spaceId }, // Space ID 추가
        });
        onReload(); // 목록 갱신
      } catch (error) {
        console.error("Failed to delete member:", error);
        alert("멤버 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <Styled.TeamMaWrap>
      <div className="title-area">
        <h2>팀 목록</h2>
        <button className="add-member-btn" onClick={onOpenInviteModal}>
          <span>+ 멤버 추가</span>
        </button>
      </div>

      <div className="member-list">
        {teamMembers.map((member) => (
          <div className="member-item" key={member.id}>
            <img
              src={`https://ui-avatars.com/api/?name=${member.name}`}
              alt={`${member.name} profile`}
            />
            <div className="info">
              <span className="name">{member.name}</span>
              <span className="email">{member.email}</span>
            </div>
            <div className="action-buttons">
              <div className="role-wrapper">
                <span>역할:</span>
                <select
                  value={member.role} // defaultValue에서 value로 변경
                  onChange={(e) =>
                    handleRoleChange(member.email, e.target.value)
                  }
                  disabled={
                    (member.role === "top_manager" &&
                      currentUserRole === "top_manager") ||
                    currentUserRole !== "top_manager"
                  } // 최고관리자가 아니거나 자신의 역할 변경 방지
                  title={
                    member.role === "top_manager" &&
                    currentUserRole === "top_manager"
                      ? "최고관리자는 자신의 역할을 변경할 수 없습니다."
                      : currentUserRole !== "top_manager"
                      ? "역할 변경은 최고관리자만 가능합니다."
                      : ""
                  }
                >
                  <option value="top_manager">최고관리자</option>
                  <option value="manager">관리자</option>
                  <option value="normal">팀원</option>
                </select>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteMember(member.email)}
                disabled={member.role === "top_manager"} // 최고관리자는 삭제 불가
                title={
                  member.role === "top_manager"
                    ? "최고관리자는 삭제할 수 없습니다."
                    : ""
                }
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 조건부 렌더링 */}
      {teamMembers.length > 5 && ( // 페이지당 5명의 멤버를 표시한다고 가정
        <div className="pagination">
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
        </div>
      )}
    </Styled.TeamMaWrap>
  );
};

export default TeamList;
