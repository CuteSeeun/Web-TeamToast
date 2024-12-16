//프로젝트 사이드바
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

import { CgViewCols, CgNotes, CgTab, CgMenuMotion, CgComment, CgChart, CgUserAdd, CgInsights } from "react-icons/cg";

import CreateIssueModal from './CreateIssueModal';
import { issueListState, backlogState, Issue, Type, allIssuesState } from '../recoil/atoms/issueAtoms';
import { projectListState } from '../recoil/atoms/projectAtoms'; // 프로젝트 상태 가져오기
import axios from 'axios';
// import { loadingAtoms } from '../recoil/atoms/loadingAtoms';
import { sprintState } from '../recoil/atoms/sprintAtoms';
import { toSvg } from "jdenticon";
import { Project } from '../types/projectTypes';

const SidebarContainer = styled.div`
  width: 60px;
  flex-shrink:0;
  /* height: 600px; */
  height: 618px;
  overflow: hidden;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
  min-width: 180px;
  /* background:yellow; */
`;
const TopSection = styled.div`
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
  /* background:yellow; */
`;
const MiddleSection = styled.div `
  padding: 0 20px;
  max-height: 250px; /* 스크롤이 생길 높이 제한 설정 */
  overflow-y: auto; /* 수직 스크롤 활성화 */
  /* background:pink; */
`;
const BottomSection = styled.div`
  padding: 0 20px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  text-align: center;
  /* background:gray; */
`;
const AddIssueButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 20px;
  border: 2px solid #038C8C;
  border-radius: 5px;
  background-color: #fff;
  color: #038C8C;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  svg {
    margin-right: 8px;
  }
  &:hover {
    background-color: #e6f4f4;
  }
`;

const MenuItem = styled(Link).attrs<{ active?: boolean }>(({ active }) => ({
  className: active ? 'active' : '',
}))`
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => (props.active ? '#038C8C' : '#4d4d4d')};
  text-decoration: none; /* Link 기본 스타일 제거 */
  background-color: ${(props) => (props.active ? '#E6F4F4' : 'transparent')};
  border-radius: 5px;

  svg {
    margin-right: 10px;
    font-size: 16px;
    color: ${(props) => (props.active ? '#038C8C' : '#4d4d4d')};
  }

  &:hover {
    background-color: #e6f4f4;
    color: #038C8C;

    svg {
      color: #038C8C;
    }
  }
`;
const ProjectList = styled.div`
display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  border-radius: 5px;
  top: 0; /* 상단에서 고정될 위치 */
  svg {
    margin-right: 10px;
    font-size: 16px;
    color:'#4d4d4d';
  }
`;

const Sidebar: React.FC = () => {
  const [projectId, setProjectId] = useState<string | null>(null); // pid 상태
  const [spaceId, setSpaceId] = useState<string | null>(null); // sid 상태
  const [isOpen, setIsOpen] = useState<boolean>(false); // 모달창 상태 관련 스테이트
  const [activeItem, setActiveItem] = useState<string>(''); // 현재 활성화된 MenuItem 상태
  const handleMenuClick = (menuName: string) => {
    setActiveItem(menuName); // 클릭한 메뉴를 active 상태로 설정
  };

  const projectList = useRecoilValue(projectListState); // projectListState 값 가져오기
  const setAllIssues = useSetRecoilState(allIssuesState);
  const setSprints = useSetRecoilState(sprintState);


  // const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  // const setLoading = useSetRecoilState(loadingAtoms);

  // 세션에서 pid,sid 가져오기
  const pid = sessionStorage.getItem('pid'); // 세션에서 pid 가져오기
  const sid = sessionStorage.getItem('sid'); // 세션에서 sid 가져오기

  if (pid) { console.log('pid를 가져옴'); }
  else { console.log('세션에 pid 없는듯?'); }

  if (sid) { console.log('sid를 가져옴'); }
  else { console.log('세션에 sid없는듯?'); }

  const openModal = () => { setIsOpen(true); };
  const closeModal = () => { setIsOpen(false); };

  // 모든 이슈, 스프린트 디비에서 데이터 가져오기
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // setLoading(true);

        if (!pid) {
          console.error('프로젝트 ID가 세션에 없습니다.');
          return;
        }
        const issuesResponse = await axios.get(`/sissue/project/${pid}`);
        setAllIssues(issuesResponse.data);
        console.log('가져온 이슈 레코드:', issuesResponse.data);

        const sprintsResponse = await axios.get(`/sprint/project/${pid}`);
        setSprints(sprintsResponse.data);
        console.log('가져온 스프린트 레코드:', sprintsResponse.data);

        // setLoading(false);

      } catch (error) {
        console.error('Error fetching all data:', error);
        // setLoading(false);
      }
    };
    fetchAllData();
  }, [pid]);

  const projImage = (project: Project) => {
      // 다른 스페이스에 같은 이름의 프로젝트가 있을 경우 이미지가 겹치는 것을 방지
      const svgString = toSvg((project.pname + project.pid), 32);
      return React.createElement('div', {
        dangerouslySetInnerHTML: { __html: svgString },
        style: { width: 32, height: 32, overflow: "hidden", borderRadius: "3px" },
      });
    };


  return (
    <SidebarContainer>

      <TopSection>{/* 상단 메뉴 */}
        <AddIssueButton onClick={(e) => { openModal() }}><FaPlus />새 이슈</AddIssueButton> {/* 새 이슈 버튼 */}
        {/* <MenuItem to={`/activesprint/${pid}`} ><CgViewCols />활성 스프린트</MenuItem> */}
        <MenuItem to={`/activesprint/${pid}`}
  active={activeItem === 'activesprint'}
  onClick={() => handleMenuClick('activesprint')} ><CgViewCols />활성 스프린트</MenuItem>

        <MenuItem to={`/dashboard/${pid}`}
        active={activeItem === 'dashboard'}
        onClick={() => handleMenuClick('dashboard')}><CgChart />대시보드</MenuItem>

        <MenuItem to={`/backlog/${pid}`}
        active={activeItem === 'backlog'}
        onClick={() => handleMenuClick('backlog')}><CgInsights />백로그</MenuItem>

        <MenuItem to={`/issuelist/${pid}`}
        active={activeItem === 'issuelist'}
        onClick={() => handleMenuClick('issuelist')}><CgNotes />이슈 목록</MenuItem>

        <MenuItem to={`/timeline/${pid}`}
        active={activeItem === 'timeline'}
        onClick={() => handleMenuClick('timeline')}><CgMenuMotion />타임라인</MenuItem>
      </TopSection>

      <MiddleSection> 
      <ProjectList><CgTab />프로젝트</ProjectList>
      {/* <MenuItem to={'/line/line'}><CgTab />프로젝트</MenuItem> */}
      {projectList.map((project) => (
          <MenuItem
            key={project.pid}
            to={`/project/${project.pid}`}
            // active={activeItem === project.pname}
            // onClick={() => handleMenuClick(project.pname)}
          >
            {projImage(project)}
            {project.pname}
          </MenuItem>
        ))}
      </MiddleSection>

      {/* 하단 메뉴 */}
      <BottomSection>
        <MenuItem to={`/chat/${sid}`}
        active={activeItem === 'chat'}
        onClick={() => handleMenuClick('chat')}><CgComment />채팅</MenuItem>
        <MenuItem to={`/invite/${sid}`}><CgUserAdd />팀원 초대하기</MenuItem>
      </BottomSection>

      <CreateIssueModal isOpen={isOpen} onClose={closeModal} pid={pid} />

    </SidebarContainer>
  );
};

export default Sidebar;