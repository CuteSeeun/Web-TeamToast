import React, { useState, useEffect } from "react";
import axios from "axios";
import { TeamMaWrap } from "./teamStyle"; // teamStyle.css로 연결
import { FiTrash2 } from "react-icons/fi";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
}

const TeamList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAdmin] = useState<boolean>(true); // 관리자 여부
  const [message, setMessage] = useState<string | null>(null); // 알림 메시지
  const itemsPerPage = 10;
  const spaceId = 1; // 더미 spaceId

  // 팀원 목록 가져오기
  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/team/members", {
        params: { spaceId },
      });
      setMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      setMessage("팀원 목록을 가져오는 데 실패했습니다.");
    }
  };

  // 권한 변경
  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      await axios.put("http://localhost:3001/team/update-role", {
        spaceId,
        email,
        role: newRole,
      });
      setMessage("권한이 성공적으로 변경되었습니다.");
      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to update role:", error);
      setMessage("권한 변경에 실패했습니다.");
    }
  };

  // 팀원 삭제
  const handleRemoveMember = async (email: string) => {
    try {
      await axios.post("http://localhost:3001/team/remove", {
        spaceId,
        email,
      });
      setMessage("팀원이 성공적으로 삭제되었습니다.");
      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to remove team member:", error);
      setMessage("팀원 삭제에 실패했습니다.");
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(members.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = members.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return (
    <TeamMaWrap>
      <div className="header-area">
        <div className="title-area">
          <h2>팀원 목록</h2>
        </div>
      </div>

      <div className="member-list">
        {message && <p className="message">{message}</p>}
        {currentMembers.map((member) => (
          <div key={member.id} className="member-item">
            <div className="info">
              <span className="name">{member.name}</span>
              <span className="email">{member.email}</span>
            </div>
            <div className="action-buttons">
              <div className="role-wrapper">
                <select
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(member.email, e.target.value)
                  }
                  disabled={!isAdmin}
                >
                  <option value="normal">팀원</option>
                  <option value="manager">관리자</option>
                  <option value="top_manager">최고 관리자</option>
                </select>
              </div>
              {isAdmin && (
                <button
                  className="delete-button"
                  onClick={() => handleRemoveMember(member.email)}
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </TeamMaWrap>
  );
};

export default TeamList;
