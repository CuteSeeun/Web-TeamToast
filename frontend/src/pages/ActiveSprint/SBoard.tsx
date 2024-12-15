//칸반 보드
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useRecoilValue, useRecoilState } from 'recoil';
import styled from 'styled-components';
import Column from './Column';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CreateIssueModal from '../../components/CreateIssueModal';
import { enabledSprintsState, filterState } from '../../recoil/atoms/sprintAtoms';
import { issuesByStatusState } from '../../recoil/atoms/issueAtoms';
import { ReactComponent as SprintAlert } from '../../assets/images/sprintAlert.svg';
import { Issue } from '../../recoil/atoms/issueAtoms';
import { HashLoader } from 'react-spinners';

type Task = Pick<Issue, 'isid' | 'title' | 'type' | 'manager'>;
type ColumnKey = 'backlog' | 'inProgress' | 'done' | 'qa';

const BoardContainer = styled.div`
  position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
  display: flex;
  flex-direction: column;
  padding-left: 25px; /* 사이드 메뉴와 간격 조정 */
  height: 80vh;
  overflow-y: scroll; 
  margin-top:10px;
  /* margin-left:20px; */
  /* margin-right:20px; */

  width:1120px;
  border-radius:8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0F.1);


`;
const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
`;
const BoardTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;
const Breadcrumb = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 8px; /* 제목과의 간격 */
`;
const Filters = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px; /* 네비게이션 텍스트와의 간격 */
  margin-bottom: 0px; /* BoardMain과 간격을 줄이려면 이 값을 줄이세요 근데 여기서 더 간격을 줄이고 싶다면 BoradMain의 마진 탑을 줄이면 된다.*/

  & > label {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 14px;
    cursor: pointer;

    position: relative; /* 드롭다운 포지션 기준 */

    svg {
      margin-left: 5px; /* 텍스트와 아이콘 간격 */
    }
  }
`;


const DropdownMenu = styled.ul<{ open: boolean }>`
  position: absolute;
  top: 100%; /* 필터 라벨 바로 아래 */
  left: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style: none;
  padding: 5px 0;
  margin: 0;
  display: ${({ open }) => (open ? 'block' : 'none')};
  width: 100px;
  z-index: 999;

  li {
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background: #eee;
    }
  }
`;

const BoardMain = styled.div`
  display: flex;
  flex-wrap: nowrap; /* 줄바꿈 허용하지 않음 */
  gap:8px;
  padding-bottom: 10px;
  /* overflow-y: hidden; 세로 스크롤 방지 */
  // width: 100%; /* 부모 컨테이너 크기에 맞춤 */
`;
const SprintCompleteButton = styled.button`
  position: absolute;
  top: 100px;
  right: 20px;
  padding: 10px 10px;
  background-color: #038C8C;
  color: #fff;
  font-size: 14px;
  // font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 

  &:hover {
    background-color: #026b6b;
  }

  &:active {
    transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
  }
`;
const BacklogMoveButton = styled.button`
padding: 10px 10px;
background-color: #038C8C;
color: #fff;
font-size: 14px;
border: none;
border-radius: 10px;
cursor: pointer;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
&:hover {
  background-color: #026b6b;
}
&:active {
  transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
}
`;


const SBoard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // useNavigate 훅 호출
  const pname = sessionStorage.getItem('pname');
  const [isModalOpen, setIsModalOpen] = useState(false);// 모달 열림/닫힘 상태 관리
  const enabledSprints = useRecoilValue(enabledSprintsState);
  const issuesByStatus = useRecoilValue(issuesByStatusState); // 활성스프린트의 상태별 이슈 데이터 가져오기
  const [filter, setFilter] = useRecoilState(filterState);
  const pid = sessionStorage.getItem('pid');

  // 2초 후 로딩 상태 종료 (추가)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, []);


  // Backlog 페이지로 이동
  const handleBacklogMove = () => {
    navigate(`/backlog/${pid}`); // 적절한 프로젝트 ID를 URL에 포함해야 함
  };

  //columns 상태는 컬럼과 그 안에 태스크 목록을 저장한다
  const [columns, setColumns] = useState<{
    backlog: Task[];
    inProgress: Task[];
    done: Task[];
    qa: Task[];
  }>({
    backlog: [],
    inProgress: [],
    done: [],
    qa: [],
  });

  // Recoil에서 가져온 데이터를 columns에 매핑
  useEffect(() => {
    setColumns({
      backlog: issuesByStatus.backlog.map((issue) => ({
        isid: issue.isid,
        title: issue.title,
        type: issue.type,
        manager: issue.manager ?? undefined, // manager가 없는 경우 기본값 설정
      })),
      inProgress: issuesByStatus.working.map((issue) => ({
        isid: issue.isid,
        title: issue.title,
        type: issue.type,
        manager: issue.manager ?? undefined,
      })),
      done: issuesByStatus.dev.map((issue) => ({
        isid: issue.isid,
        title: issue.title,
        type: issue.type,
        manager: issue.manager ?? undefined,
      })),
      qa: issuesByStatus.qa.map((issue) => ({
        isid: issue.isid,
        title: issue.title,
        type: issue.type,
        manager: issue.manager ?? undefined,
      })),
    });
  }, [issuesByStatus]); // issuesByStatus 변경 시 업데이트


  //태스크를 원래 컬럼에서 제거하고 새로운 컬럼에 삽입 후 상태를 업데이트하는 함수
  //컬럼 간 이동 및 같은 컬럼 내 삽입을 모두 처리한다. 
  const moveTask = (fromColumn: ColumnKey, toColumn: ColumnKey, fromIndex: number, toIndex: number) => {
    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };

      const [movedTask] = updatedColumns[fromColumn].splice(fromIndex, 1);// 드래그된 태스크를 원래 위치에서 제거
      updatedColumns[toColumn].splice(toIndex, 0, movedTask);// 드롭된 위치에 태스크 삽입

      return updatedColumns;
    });
  };

  // AddIssueButton 클릭 시 모달 여는 함수
  const handleAddIssue = () => {
    setIsModalOpen(true);
  };

  // 현재 렌더링 중인 이슈들(모든 컬럼 합치기)
  const allDisplayedTasks = [
    ...columns.backlog, ...columns.inProgress,
    ...columns.done, ...columns.qa,
  ];
  // 현재 렌더링 중인 이슈에서 manager 목록 추출
  const managerOptions = Array.from(new Set(
    allDisplayedTasks
      .map(task => task.manager)
      .filter((m): m is string => m !== undefined && m !== null && m !== '')
  ));

  // 드롭다운 열림 상태
  const [managerOpen, setManagerOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

  // const closeAllDropdowns = () => {
  //   setManagerOpen(false);
  //   setTypeOpen(false);
  //   setPriorityOpen(false);
  // };
  // const handleManagerClick = () => {
  //   closeAllDropdowns(); // 다른 드롭다운 닫기
  //   setManagerOpen(true);
  // };

  // const handleTypeClick = () => {
  //   closeAllDropdowns();
  //   setTypeOpen(true);
  // };

  // const handlePriorityClick = () => {
  //   closeAllDropdowns();
  //   setPriorityOpen(true);
  // };

  // const handleManagerChange = (newManager: string) => {
  //   setFilter((prev) => ({ ...prev, manager: newManager }));
  //   setManagerOpen(false);
  // };
  // const handleTypeChange = (newType: string) => {
  //   setFilter((prev) => ({ ...prev, type: newType }));
  //   setTypeOpen(false);
  // };
  // const handlePriorityChange = (newPriority: string) => {
  //   setFilter((prev) => ({ ...prev, priority: newPriority }));
  //   setPriorityOpen(false);
  // };

  // // 클릭 시 드롭다운 외부 영역 클릭하면 닫히게
  // useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     const target = e.target as HTMLElement;
  //     // Filters 내부를 클릭했는지 검사 (특정 조건이 없다면 무조건 닫기)
  //     // 여기서는 간단히 모든 드롭다운을 닫는 로직
  //     if (!target.closest('.filter-label')) {
  //       closeAllDropdowns();
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  // 필터 변경 핸들러
  const handleManagerChange = (newManager: string) => {
    setFilter((prev) => ({ ...prev, manager: newManager }));
    setManagerOpen(false); // 선택 후 닫기
  };
  const handleTypeChange = (newType: string) => {
    setFilter((prev) => ({ ...prev, type: newType }));
    setTypeOpen(false);
  };
  const handlePriorityChange = (newPriority: string) => {
    setFilter((prev) => ({ ...prev, priority: newPriority }));
    setPriorityOpen(false);
  };

  // 로딩 상태에 따른 조건부 렌더링
  if (loading) {
    return (
      <BoardContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <HashLoader color="#36d7b7" />
      </BoardContainer>
    );
  }

  return (
    <>
      <BoardContainer>

        {/* 상단 헤더 */}
        <BoardHeader>
          <BoardTitle>활성 스프린트</BoardTitle>{/* 제목 */}
          <Breadcrumb>프로젝트 &gt; {pname} &gt; 활성 스프린트</Breadcrumb>{/* 네비게이션 텍스트 */}

          {enabledSprints.length !== 0 && (
            <>
              <Filters>
                <div className="filter-label" onClick={() => setManagerOpen((prev) => !prev)}>
                  담당자 <FaChevronDown />
                  <DropdownMenu open={managerOpen}>
                    <li onClick={() => handleManagerChange('')}>전체</li>
                    {managerOptions.map((m) => (
                      <li key={m} onClick={() => handleManagerChange(m)}>{m}</li>
                    ))}
                  </DropdownMenu>
                </div>
                <div className="filter-label" onClick={() => setTypeOpen((prev) => !prev)}>
                  유형 <FaChevronDown />
                  <DropdownMenu open={typeOpen}>
                    <li onClick={() => handleTypeChange('')}>전체</li>
                    <li onClick={() => handleTypeChange('task')}>작업</li>
                    <li onClick={() => handleTypeChange('bug')}>버그</li>
                  </DropdownMenu>
                </div>
                <div className="filter-label" onClick={() => setPriorityOpen((prev) => !prev)}>
                  우선순위 <FaChevronDown />
                  <DropdownMenu open={priorityOpen}>
                    <li onClick={() => handlePriorityChange('')}>전체</li>
                    <li onClick={() => handlePriorityChange('높음')}>높음</li>
                    <li onClick={() => handlePriorityChange('보통')}>보통</li>
                    <li onClick={() => handlePriorityChange('낮음')}>낮음</li>
                  </DropdownMenu>
                </div>

              </Filters>

              <SprintCompleteButton>스프린트 완료</SprintCompleteButton>
            </>
          )}
        </BoardHeader>

        {enabledSprints.length === 0 ? (
          // 활성 스프린트가 없는 경우
          <>
            <SprintAlert style={{ marginBottom: '20px' }} />
            <p>활성 스프린트가 없습니다<br />이슈를 생성해주세요</p>
            <BacklogMoveButton onClick={handleBacklogMove}>백로그로 이동</BacklogMoveButton>
          </>
        ) : (
          // 활성 스프린트가 있는 경우
          <DndProvider backend={HTML5Backend}>
            <BoardMain>
              <Column title="백로그" tasks={columns.backlog} columnId="backlog" onMoveTask={moveTask} onAddIssue={handleAddIssue} />
              <Column title="진행 중" tasks={columns.inProgress} columnId="inProgress" onMoveTask={moveTask} onAddIssue={handleAddIssue} />
              <Column title="개발 완료" tasks={columns.done} columnId="done" onMoveTask={moveTask} onAddIssue={handleAddIssue} />
              <Column title="QA 완료" tasks={columns.qa} columnId="qa" onMoveTask={moveTask} onAddIssue={handleAddIssue} />
            </BoardMain>
          </DndProvider>
        )}

      </BoardContainer>
      <CreateIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pid={pname} />
    </>
  );
};

export default SBoard;