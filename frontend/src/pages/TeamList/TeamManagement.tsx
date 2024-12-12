import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TeamList from "./TeamList";
import TeamInviteModal from "./TeamInvite";

const TeamManagement: React.FC = () => {
  const spaceId = sessionStorage.getItem("sid");
  const numericSpaceId = spaceId ? Number(spaceId) : 0; // 숫자로 변환, null이면 기본값 0
  const [teamMembers, setTeamMembers] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null); // 에러 메시지 상태 추가
  // 현재 사용자 역할 가져오기
  //const currentUserRole = sessionStorage.getItem("userRole") || "normal"; // 기본값 'normal'
  const [currentUserRole, setCurrentUserRole] = useState<string>("normal");

  // 팀 멤버 목록 가져오기
  const fetchTeamMembers = useCallback(async () => {
    if (!spaceId) return;
    try {
      const response = await axios.get("http://localhost:3001/team/members", {
        params: { spaceId },
      });
      setTeamMembers(response.data);
    } catch (err: any) {
      console.error(
        "Failed to fetch team members:",
        err.response?.data?.message
      );
    }
  }, [spaceId]);

  // 초대 API 호출
  const handleInvite = async (email: string, role: string) => {
    try {
      await axios.post("http://localhost:3001/team/invite", {
        space_id: numericSpaceId,
        email,
        role,
      });
      setInviteError(null); // 초대 성공 시 에러 메시지 초기화
      handleReload(); // 초대 성공 시 목록 갱신
    } catch (error: any) {
      if (error.response?.status === 409) {
        const errorMessage = error.response.data.message;

        // 디버깅용 로그 추가
        console.log("Error message received:", errorMessage);

        if (errorMessage === "이미 초대된 사용자입니다.") {
          setInviteError(
            "이미 스페이스에 속한 멤버입니다. 초대할 수 없습니다."
          );
        } else if (
          errorMessage ===
          "초대할 사용자가 아직 TeamToast에 가입하지 않았습니다."
        ) {
          setInviteError(
            "초대할 사용자가 아직 TeamToast에 가입하지 않았습니다. 회원가입 후 초대해주세요."
          );
        } else {
          setInviteError("알 수 없는 이유로 초대할 수 없습니다.");
        }
      } else if (error.response?.status === 403) {
        setInviteError(
          "현재 초대 가능한 최대 인원을 초과했습니다. 추가 인원 초대를 원하시면 결제를 진행해 주세요."
        );
      } else {
        setInviteError("초대에 실패했습니다. 다시 시도해주세요.");
      }
      throw error; // 초대 실패 시 예외 던지기
    }
  };

  // 목록 갱신 트리거
  const handleReload = () => {
    setReload(!reload);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers, reload]);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole");
    if (storedRole) {
      setCurrentUserRole(storedRole);
    }
  }, []);

  return (
    <div>
      {/* TeamList 컴포넌트 */}
      <TeamList
        spaceId={numericSpaceId} // 숫자로 변환된 값 사용
        teamMembers={teamMembers}
        onOpenInviteModal={() => {
          setInviteError(null); // 모달 열릴 때 에러 메시지 초기화
          setIsInviteModalOpen(true);
        }}
        onReload={handleReload}
        currentUserRole={currentUserRole} // 현재 사용자의 역할 전달
        //spaceId={spaceId}
      />

      {/* TeamInviteModal 컴포넌트 */}
      <TeamInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
        spaceId={numericSpaceId} // 숫자로 변환된 값 사용
        onInviteSuccess={handleReload}
        errorMessage={inviteError} // 에러 메시지 전달
        currentUserRole={currentUserRole} // 현재 사용자의 역할 전달
      />
    </div>
  );
};

export default TeamManagement;
