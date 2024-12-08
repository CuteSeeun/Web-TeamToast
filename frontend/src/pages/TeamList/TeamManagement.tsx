import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { teamMembersState } from "../../recoil/atoms/memberAtoms";
import { spaceIdState } from "../../recoil/atoms/spaceAtoms";
import TeamList from "./TeamList";
import TeamInviteModal from "./TeamInvite";
import axios from "axios";

const TeamManagement: React.FC = () => {
  const teamMembers = useRecoilValue(teamMembersState); // Recoil에서 팀 멤버 데이터 가져오기
  // const spaceId = useRecoilValue(spaceIdState); // Recoil에서 현재 스페이스 ID 가져오기
  const spaceId = sessionStorage.getItem('sid');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null); // 에러 메시지 상태 추가

  // 초대 API 호출
  const handleInvite = async (email: string, role: string) => {
    try {
      await axios.post("http://localhost:3001/team/invite", {
        space_id: Number(spaceId),
        email,
        role,
      });
      setInviteError(null); // 초대 성공 시 에러 메시지 초기화
      // 갱신은 ProjectHeader의 fetchTeamMembers가 수행
    } catch (error: any) {
      if (error.response?.status === 409) {
        const errorMessage = error.response.data.message;

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
    }
  };

  return (
    <div>
      {/* TeamList 컴포넌트 */}
      <TeamList
        // teamMembers={teamMembers} // Recoil에서 가져온 데이터를 전달
        onOpenInviteModal={() => {
          setInviteError(null); // 모달 열릴 때 에러 메시지 초기화
          setIsInviteModalOpen(true);
        }}
        spaceId={spaceId ? Number(spaceId) : 0} // spaceId가 null일 경우 기본값 0 설정
      />

      {/* TeamInviteModal 컴포넌트 */}
      <TeamInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
        onInviteSuccess={() => {
          // 초대 성공 시 호출될 동작
          console.log("초대 성공");
          window.location.reload(); // 간단히 페이지를 새로고침하거나 Recoil 상태 갱신
        }}
        spaceId={spaceId ? Number(spaceId) : 0} // spaceId가 null일 경우 기본값 0 설정
        errorMessage={inviteError} // 에러 메시지 전달
      />
    </div>
  );
};

export default TeamManagement;