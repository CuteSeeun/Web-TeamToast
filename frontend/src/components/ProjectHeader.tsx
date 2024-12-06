// 2024-11-25 한채경 수정
// ProjectHeader.tsx
//프로젝트 들어간 이후부터 쓰는 헤더

import React, { useEffect, useState } from "react";
import { ProjectHeaderWrap, Logo } from "../styles/HeaderStyle";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../recoil/atoms/userAtoms";
import { Link, useNavigate, useParams } from "react-router-dom";
import { teamMembersState } from "../recoil/atoms/memberAtoms";

import { ReactComponent as LogoIcon } from "../assets/icons/Logo.svg"; // icons 폴더에서 로고 가져옴
import { IoSettingsOutline, IoChevronDownOutline } from "react-icons/io5";
//import ProjectInvite from './InviteModal';
import { spaceIdState } from "../recoil/atoms/spaceAtoms";
import axios from "axios";
import AccessToken from "../pages/Login/AccessToken";
import { Project } from "../types/projectTypes";
import PJheaderBell from "./PJheaderBell";

const ProjectHeader = ({
  onFetchTeamMembers,
}: {
  onFetchTeamMembers?: () => void;
}) => {
  const user = useRecoilValue(userState);
  const spaceId = useRecoilValue(spaceIdState); // 프로젝트 눌렀을때 해당 스페이스의 아이디에 있는 프로젝트출력

  const setUser = useSetRecoilState(userState);
  // const setSpaceId = useSetRecoilState(spaceIdState);
  const setTeamMembers = useSetRecoilState(teamMembersState); //스페이스에 속한 팀원 불러오는 state
  const [projects, setProjects] = useState<Project[]>([]); // 현재 스페이스 안에 있는 프로젝트 리스트를 저장하는 스테이트
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const navigate = useNavigate();

  const logoutGo = () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (confirmed) {
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentSpaceUuid");
      navigate("/");
      window.location.reload();
    }
  };

  // useEffect(() => {
  //   const currentSpace = async () => {
  //     try {
  //       const storedUuid = localStorage.getItem("currentSpaceUuid");
  //       if (storedUuid) {
  //         // Recoil 상태에 저장
  //         setSpaceId(storedUuid);
  //       } else {
  //         const response = await AccessToken.get("/space/current-space");
  //         if (response.data.spaceId) {
  //           setSpaceId(response.data.spaceId);
  //           localStorage.setItem("currentSpaceUuid", response.data.uuid); // UUID 저장
  //         } else {
  //           console.warn("현재 선택된 스페이스가 없습니다.");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("현재 스페이스 복구 실패:", error);
  //     }
  //   };
  //   currentSpace();
  // }, [setSpaceId]);

  // 팀 멤버 데이터를 가져오는 함수
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!spaceId) {
        console.error("spaceId가 설정되지 않았습니다.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3001/team/members", {
          params: { spaceId },
        });
        setTeamMembers(response.data); // 팀 멤버 상태 갱신
      } catch (error) {
        console.error("팀원 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchTeamMembers(); // 컴포넌트 로드 시 호출
    onFetchTeamMembers?.(); // prop으로 전달된 함수가 있을 경우 호출
  }, [spaceId, setTeamMembers, onFetchTeamMembers]);

  // 관리자 권한 체크 함수
  const isAdmin = user?.role === "admin"; // 또는 user?.role === 'ADMIN' 등 실제 데이터 구조에 맞게

  // 권한 없을 때 처리하는 함수
  const handleUnauthorizedAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("스페이스 관리는 관리자만 접근할 수 있습니다.");
  };

  const handleProjectGo = async () => {
    const currentSpaceUuid = localStorage.getItem("currentSpaceUuid");

    if (!currentSpaceUuid) {
      console.error("현재 선택된 스페이스가 없습니다.");
      navigate("/space");
      return;
    }

    try {
      // uuid로 해당 스페이스의 정보를 가져옴
      const response = await AccessToken.get(
        `/space/get-space/${currentSpaceUuid}`
      );

      if (response.data && response.data.spaceId) {
        // spaceId를 이용해서 프로젝트 리스트 페이지로 이동
        navigate(`/projectlist/${response.data.spaceId}`);
      } else {
        console.error("스페이스 정보를 찾을 수 없습니다.");
        navigate("/space");
      }
    } catch (error) {
      console.error("스페이스 정보 조회 실패:", error);
      navigate("/space");
    }
  };

  return (
    <ProjectHeaderWrap>
      <div className="headerProject">
        <div className="leftPro">
          <Link to="/space">
            <Logo>
              <LogoIcon />
            </Logo>
          </Link>
          <nav>
            <div className="menu-wrap">
              <span className="menu-text" onClick={handleProjectGo}>
                프로젝트
              </span>
            </div>
            <div className="menu-wrap">
              <span className="menu-text">
                <span className="text-with-rigth-icon">팀</span>
                <IoChevronDownOutline />
              </span>
              <ul className="sub-menu">
                <li onClick={() => setIsInviteModalOpen(true)}>사용자 초대</li>
                <Link to="/team">
                  <li>사용자 목록</li>
                </Link>
                <Link to="/payment">
                  <li>결제</li>
                </Link>
              </ul>
            </div>
          </nav>
        </div>

        {/* <div className="rightPro" style={{display:"flex", alignItems:"center"}}> */}
        <div className="rightPro">
          <div className="notification-icon">
            <PJheaderBell />
            <span className="notification-badge"></span>
          </div>

          <div className="menu-wrap">
            <IoSettingsOutline
              className="icon-wrap"
              style={{ cursor: "pointer" }}
            />
            <ul className="sub-menu">
              {/* {isAdmin ? (
                                <Link to='/spaceedit'>
                                    <li>스페이스관리</li>
                                </Link>
                            ) : (
                                <li 
                                    onClick={handleUnauthorizedAccess}
                                    style={{ 
                                        color: '#999',
                                        cursor: 'not-allowed'
                                    }}
                                >
                                    스페이스관리
                                </li>
                            )} */}
              <Link to="/spacemanagement">
                <li>스페이스관리</li>
              </Link>
            </ul>
          </div>
          <div className="menu-wrap">
            {/* <span className="menu-text">{user.name} </span> */}
            <div className="user-circle">{user?.uname?.charAt(0)}</div>
            <ul className="sub-menu">
              <Link to="/profile">
                <li>프로필</li>
              </Link>
              <li onClick={logoutGo}>로그아웃</li>
            </ul>
          </div>
        </div>
      </div>

      {/* <ProjectInvite 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            /> */}
    </ProjectHeaderWrap>
  );
};

export default ProjectHeader;
