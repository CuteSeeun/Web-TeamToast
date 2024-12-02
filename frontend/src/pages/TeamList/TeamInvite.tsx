import React, { useState } from "react";
import axios from "axios";
import { ProjectInviteWrap } from "../../styles/InviteModal"; // 경로 수정

// Props 인터페이스 정의
interface InviteUserModalProps {
  isOpen: boolean; // 모달 오픈 여부
  spaceId: number; // spaceId는 숫자 타입
  onClose: () => void; // onClose는 함수 타입
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  spaceId,
  onClose,
}) => {
  const [email, setEmail] = useState<string>(""); // 이메일 입력값
  const [role, setRole] = useState<string>("관리자"); // 기본 역할: 관리자
  const [message, setMessage] = useState<string>(""); // 성공 또는 에러 메시지

  // 초대 처리 함수
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/team/invite", {
        email,
        space_id: spaceId, // spaceId 전달
        role: role === "관리자" ? "manager" : "normal", // 백엔드 역할과 매칭
      });

      setMessage(response.data.message); // 성공 메시지 설정
      setEmail(""); // 이메일 입력 필드 초기화
      setRole("관리자"); // 역할 초기화
    } catch (error: any) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "사용자를 초대하는 데 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  // 모달 닫혀 있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <ProjectInviteWrap>
      <div className="modal-content">
        <h3>사용자 초대</h3>

        <form onSubmit={handleInvite}>
          {/* 이메일 입력 */}
          <div className="input-group">
            <label>사용자 이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해 주세요."
              required
            />
          </div>

          {/* 권한 선택 */}
          <div className="input-group">
            <label>권한</label>
            <div className="select-wrapper">
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="관리자">관리자</option>
                <option value="멤버">멤버</option>
              </select>
            </div>
          </div>

          {/* 메시지 출력 */}
          {message && <p className="message">{message}</p>}

          {/* 버튼 그룹 */}
          <div className="button-group">
            <button type="button" className="cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="invite">
              초대
            </button>
          </div>
        </form>
      </div>
    </ProjectInviteWrap>
  );
};

export default InviteUserModal;
