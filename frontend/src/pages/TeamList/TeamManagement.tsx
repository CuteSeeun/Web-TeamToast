import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  teamMembersState,
  currentUserRoleState,
} from "../../recoil/atoms/memberAtoms";
import { userState } from "../../recoil/atoms/userAtoms";
import TeamList from "./TeamList";
import TeamInviteModal from "./TeamInvite";

const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useRecoilState(teamMembersState);
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleState);
  const currentUser = useRecoilValue(userState);
  const spaceId = sessionStorage.getItem("sid") || "0"; // sessionStorage에서 spaceId 가져오기
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // 팀 멤버 목록 가져오기
  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/team/members", {
        params: { spaceId },
      });
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    }
  }, [spaceId, setTeamMembers]);

  // sessionStorage에서 userRole 가져오기
  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole");
    if (storedRole) setCurrentUserRole(storedRole);
  }, [setCurrentUserRole]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // 초대 API 호출
  const handleInvite = async (email: string, role: string) => {
    if (currentUserRole === "normal") {
      alert("팀원은 멤버를 초대할 수 없습니다.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/team/invite", {
        space_id: Number(spaceId),
        email,
        role,
      });
      setInviteError(null); // 초대 성공 시 에러 메시지 초기화
      fetchTeamMembers(); // 초대 성공 시 목록 갱신
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

  return (
    <div>
      <TeamList
        spaceId={Number(spaceId)}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole} // 추가
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
      />
      <TeamInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
        spaceId={Number(spaceId)}
        onInviteSuccess={fetchTeamMembers} // 추가된 속성
        errorMessage={inviteError}
        currentUserRole={currentUserRole} // 추가된 속성
      />
    </div>
  );
};

export default TeamManagement;
