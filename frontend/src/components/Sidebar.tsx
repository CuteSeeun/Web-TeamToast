//프로젝트 사이드바
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaTasks, FaChartPie, FaClipboardList, FaComments, FaUsers } from 'react-icons/fa';
import CreateIssueModal from './CreateIssueModal';
import AccessToken from '../pages/Login/AccessToken';
import { issueListState, backlogState, Issue, Type, allIssuesState } from '../recoil/atoms/issueAtoms';
import axios from 'axios';
import { loadingAtoms } from '../recoil/atoms/loadingAtoms';
import { sprintState } from '../recoil/atoms/sprintAtoms';
// import { currentProjectState } from '../recoil/atoms/projectAtoms';

const SidebarContainer = styled.div`
  width: 240px;
  /* height: 600px; */
  /* height: 100vh; */
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
  min-width: 180px;
`;

const TopSection = styled.div`
  padding: 0 20px;
`;

const BottomSection = styled.div`
  padding: 0 20px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  text-align: center;
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

const MenuItem = styled(Link) <{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => (props.active ? '#ffffff' : '#4d4d4d')};
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

const Sidebar: React.FC = () => {
  const [projectId, setProjectId] = useState<string | null>(null); // pid 상태
  const [spaceId, setSpaceId] = useState<string | null>(null); // sid 상태
  const [isOpen, setIsOpen] = useState<boolean>(false); // 모달창 상태 관련 스테이트
  const [issues, setIssues] = useRecoilState(issueListState);
  const [backlog, setBacklog] = useRecoilState<Issue[]>(backlogState);
  const setAllIssues = useSetRecoilState(allIssuesState);
  const setSprints = useSetRecoilState(sprintState);
  // const [, setCuurrentProject] = useRecoilState(currentProjectState);

  // const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const setLoading = useSetRecoilState(loadingAtoms);

  // 세션에서 pid,sid 가져오기
  const pid = sessionStorage.getItem('pid'); // 세션에서 pid 가져오기
  const sid = sessionStorage.getItem('sid'); // 세션에서 sid 가져오기

  if (pid) { console.log('pid를 가져옴'); }
  else { console.log('세션에 pid 없는듯?'); }

  if (sid) { console.log('sid를 가져옴'); }
  else { console.log('세션에 sid없는듯?'); }

  const openModal = () => { setIsOpen(true); };
  const closeModal = () => { setIsOpen(false); };

  // 자식 컴포넌트에서 props를 받아 서버에 데이터 전송
  const handleSubmit = async (issue: Issue, files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const issuePromise = AccessToken.post(
        `http://localhost:3001/issues/new/${spaceId}/${projectId}`, //sid 삭제해야함
        issue
      );

      const fileUploadPromise = files.length > 0
        ? AccessToken.post('http://localhost:3001/upload/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        : Promise.resolve(); // 파일이 없으면 성공으로 간주

      // 병렬 처리
      const [issueResponse, fileResponse] = await Promise.all([issuePromise, fileUploadPromise]);
      const newIssue: Issue = issueResponse.data;

      console.log('이슈 생성 성공:', issueResponse.data);
      if (files.length > 0) console.log('파일 업로드 성공:', fileResponse?.data);

      // 이슈 데이터 업데이트
      if (newIssue.sprint_id) {
        // sprint_id가 있는 경우 issues 상태 업데이트
        setIssues((prevIssues) => {
          const sprintId = newIssue.sprint_id!;
          const updatedSprintIssues = prevIssues[sprintId]
            ? [...prevIssues[sprintId], newIssue]
            : [newIssue];

          return {
            ...prevIssues,
            [sprintId]: updatedSprintIssues,
          };
        });
      } else {
        // sprint_id가 없는 경우 backlog 상태 업데이트
        setBacklog((prevBacklog) => [...prevBacklog, newIssue]);
      }
    } catch (err) {
      console.error('이슈 생성 또는 파일 업로드 실패:', err);
    }
  };

  // Fetch all issues and sprints
  useEffect(() => {
    const fetchAllData = async () => {
      try {

        setLoading(true);

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

        // const projectResponse = await axios.get(`/projects/find/one/${pid}`);
        // setCuurrentProject(projectResponse.data);
        // console.log('가져온 프로젝트 레코드:', projectResponse.data);
        // setIsLoading(false); // 데이터 로딩 완료
        setLoading(false);

      } catch (error) {
        console.error('Error fetching all data:', error);
        // setIsLoading(false); // 에러 시에도 로딩 종료
        setLoading(false);
      }
    };
    fetchAllData();
  }, [pid]);

  // if (isLoading) {
  //   return <div>로딩 중...</div>; // 로딩 중 상태 표시
  // }

  return (
    <SidebarContainer>

      <TopSection>{/* 상단 메뉴 */}
        <AddIssueButton onClick={(e) => { openModal() }}><FaPlus />새 이슈</AddIssueButton> {/* 새 이슈 버튼 */}
        <MenuItem to={`/activesprint/${pid}`} active><FaTasks />활성 스프린트</MenuItem>
        <MenuItem to={`/dashboard/${pid}`}><FaChartPie />대시보드</MenuItem>
        <MenuItem to={`/backlog/${pid}`}><FaClipboardList />백로그</MenuItem>
        <MenuItem to={`/issuelist/${pid}`}><FaClipboardList />이슈 목록</MenuItem>
        <MenuItem to={`/chat/${sid}`}><FaComments />채팅</MenuItem>
      </TopSection>

      {/* 하단 메뉴 */}
      <BottomSection>
        <MenuItem to={`/invite/${sid}`}><FaUsers />팀원 초대하기</MenuItem>
      </BottomSection>

      <CreateIssueModal isOpen={isOpen} onClose={closeModal} onSubmit={handleSubmit} pid={pid} />

    </SidebarContainer>
  );
};

export default Sidebar;