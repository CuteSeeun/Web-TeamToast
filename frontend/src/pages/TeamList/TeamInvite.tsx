import React, { useState, useEffect, useCallback } from "react";
import * as Styled from "../../styles/InviteModal";
import { useNavigate } from "react-router-dom";

interface TeamInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: number;
  onInvite: (email: string, role: string) => Promise<void>;
  onInviteSuccess: () => void;
  errorMessage: string | null; // 부모 컴포넌트에서 전달받는 에러 메시지
}

const TeamInviteModal: React.FC<TeamInviteModalProps> = ({
  isOpen,
  onClose,
  spaceId,
  onInvite,
  errorMessage, // props로 에러 메시지 전달
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("normal");
  const [remainingInvites, setRemainingInvites] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const navigate = useNavigate();

  // 초대 가능 여부 확인
  const checkInviteLimit = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/team/invite/limit?space_id=${spaceId}`
      );
      const data = await response.json();
      setRemainingInvites(data.remaining);
      setLimit(data.limit);
    } catch (error) {
      console.error("Failed to fetch invite limit:", error);
    }
  }, [spaceId]);

  const handleInviteClick = async () => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }
    try {
      await onInvite(email, role);
      onClose(); // 초대되면 모달 닫음
    } catch (error) {
      console.error('초대 오류',error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkInviteLimit(); // 모달 열릴 때 초대 가능 여부 확인
    }
  }, [isOpen, checkInviteLimit]);

  if (!isOpen) return null;

  return (
    <Styled.ProjectInviteWrap>
      <div className="modal-content">
        <h3>팀 멤버 초대</h3>
        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="초대할 멤버의 이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={remainingInvites === 0}
            style={{ width: "100%" }}
          />
          <p style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
            TeamToast에 회원가입한 유저만 초대 가능하오니, 회원가입 후 초대해
            주세요.
          </p>
        </div>
        <div className="input-group">
          <label htmlFor="role">역할</label>
          <div className="select-wrapper">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={remainingInvites === 0}
            >
              <option value="top_manager">최고관리자</option>
              <option value="manager">관리자</option>
              <option value="normal">팀원</option>
            </select>
          </div>
        </div>
        {errorMessage && (
          <p
            className="error-message"
            style={{ color: "red", marginTop: "10px" }}
          >
            {errorMessage}
          </p>
        )}
        {remainingInvites === 0 ? (
          <>
            <p style={{ marginTop: "10px", color: "red" }}>
              현재 초대 가능한 최대 인원은 {limit}명입니다.
              <br />
              추가 인원 초대를 원하시면 결제를 진행해 주세요.
            </p>
            <div className="button-group">
              <button
                className="invite"
                onClick={() => navigate("/payment")} // 결제 페이지로 이동
              >
                결제 페이지로 이동
              </button>
              <button className="cancel" onClick={onClose}>
                취소
              </button>
            </div>
          </>
        ) : (
          <div className="button-group">
            <button className="cancel" onClick={onClose}>
              취소
            </button>
            <button className="invite" onClick={handleInviteClick}>
              초대
            </button>
          </div>
        )}
      </div>
    </Styled.ProjectInviteWrap>
  );
};

export default TeamInviteModal;
