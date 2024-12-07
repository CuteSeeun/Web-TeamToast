import React from "react";
import * as Styled from "./teamStyle";
import axios from "axios";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface TeamListProps {
  teamMembers: TeamMember[];
  onOpenInviteModal: () => void; // 초대 모달 열기 함수
  onReload: () => void; // 목록 갱신 함수
  spaceId: number; // 현재 Space ID
}

const TeamList: React.FC<TeamListProps> = ({
  teamMembers,
  onOpenInviteModal,
  onReload,
  spaceId,
}) => {

  
  // 권한 변경 API 호출
  const handleRoleChange = async (email: string, role: string) => {
    try {
      await axios.put("http://localhost:3001/team/update-role", {
        email,
        role,
        spaceId, // Space ID 추가
      });
      //alert("권한이 성공적으로 변경되었습니다.");
      onReload(); // 목록 갱신
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
        //alert("멤버가 성공적으로 삭제되었습니다.");
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
                  defaultValue={member.role}
                  onChange={(e) =>
                    handleRoleChange(member.email, e.target.value)
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
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
      </div>
    </Styled.TeamMaWrap>
  );
};

export default TeamList;
