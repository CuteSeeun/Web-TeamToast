import React, { useEffect, useState } from "react";
import * as Styled from "./teamStyle";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { teamMembersState } from "../../recoil/atoms/memberAtoms";
import { userState } from "../../recoil/atoms/userAtoms";

interface TeamListProps {
  onOpenInviteModal: () => void; // 초대 모달 열기 함수
  spaceId: number; // 현재 Space ID
}

const TeamList: React.FC<TeamListProps> = ({
  onOpenInviteModal,
  spaceId,
}) => {

    const [teamMembers,setTeamMembers] = useRecoilState(teamMembersState);
    const currentUserEmail = useRecoilValue(userState);
    const [userRole,setUserRole] = useState(sessionStorage.getItem('userRole'));

    const isAdmin = userRole === 'normal';

    useEffect(()=>{
      // 세션에서 role 바뀌면
      const changeRole = () =>{
        const role = sessionStorage.getItem('userRole') || "normal";
        setUserRole(role);
      };
      window.addEventListener("storage",changeRole);
      return() =>{
        window.removeEventListener("storage",changeRole);
      }
    },[]);

  
  // 권한 변경 API 호출
  const handleRoleChange = async (email: string, role: string) => {
    try {
      await axios.put("http://localhost:3001/team/update-role", {
        email,
        role,
        spaceId, // Space ID 추가
      });
      // 리코일 상태 업데이트
      setTeamMembers((prev)=>
        prev.map((member)=>member.email === email ? {...member,role} : member
        )
      );

      if(email === currentUserEmail?.email) {
        const response = await axios.get('http://localhost:3001/team/user-role',{
          params:{email}, // 현재 로그인한사람의 이메일 보냄
        })
        const updateRole = response.data.role; // 서버에서 변경된 role 가져옴
        sessionStorage.setItem("userRole",updateRole); // 세션에 변경된 role 넣음
        window.dispatchEvent(new Event('storage')); // 스토리지 이벤트 강제 트리거
      }

      alert("권한이 성공적으로 변경되었습니다.");
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
        // 리코일 상태 업데이트
        setTeamMembers((prev) => prev.filter((member) => member.email !== email));
        alert("멤버가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("Failed to delete member:", error);
        alert("멤버 삭제에 실패했습니다.");
      }
    }
  };

  const nodelete = () =>{
    alert('접근 권한이 없습니다.')
  }



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
          <div className="member-item" key={member.email}>

            <div className="profile">
              {member.name.charAt(0)} 
            </div>
            
            <div className="info">
              <span className="name">{member.name}</span>
              <span className="email">{member.email}</span>
            </div>
            <div className="action-buttons">
            {isAdmin ? (
            <>
            <div className="role-wrapper">
                <span>역할:</span>
                <select
                  defaultValue={member.role}
                  onChange={(e) => handleRoleChange(member.email, e.target.value)}
                  disabled
                >
                  <option value="top_manager">최고관리자</option>
                  <option value="manager">관리자</option>
                  <option value="normal">팀원</option>
                </select>
              </div>
              <button
                className="delete-button"
                onClick={nodelete}
              >
                삭제
             </button>
            </>
          ) : (
            <>
              <div className="role-wrapper">
                <span>역할:</span>
                <select
                  defaultValue={member.role}
                  onChange={(e) => handleRoleChange(member.email, e.target.value)}
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
           </>
  )}
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