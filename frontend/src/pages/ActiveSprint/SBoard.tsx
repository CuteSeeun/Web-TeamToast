//SBoard
import React, {useState} from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate 가져오기
import Column from './Column';
import update from 'immutability-helper';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRecoilValue } from 'recoil';
import { sortedSprintsState } from '../../recoil/atoms/sprintAtoms';
import sprintAlert from '../../assets/images/sprintAlert.svg';


const BoardContainer = styled.div`
  position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
  display: flex;
  flex-direction: column;
  padding-left: 25px; /* 사이드 메뉴와 간격 조정 */
  overflow: hidden; /* BoardContainer에서 스크롤 막기 */
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

    svg {
      margin-left: 5px; /* 텍스트와 아이콘 간격 */
    }
  }
`;
const BoardMain = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap; /* 줄바꿈 허용하지 않음 */
  margin-left: 18px; /* 왼쪽 여백을 주고 싶다면 margin-left를 사용하세요 */
  margin-top: 0px; /* 필요하다면 위쪽 여백을 제거하세요 */
  
  /* overflow-x: auto;  */
  overflow-y: hidden; /* 세로 스크롤 방지 */ /*근데 이걸 해야 가로 스크롤이 생김..*/
  /* width: 100%;  */
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
const MoveBacklogButton = styled.button`
/* position: absolute; */
/* top: 100px; */
/* right: 20px; */
/* padding: 10px 10px; */
background-color: #038C8C;
color: #fff;
font-size: 14px;
/* font-weight: bold; */
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
const NotSprint = styled.div`
padding:50px;
justify-content: center;
align-items: center;
overflow-y: hidden; 
`;


const SBoard: React.FC = () => {

  const { pid } = useParams<{ pid: string }>(); // URL에서 pid 가져오기
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const pname = sessionStorage.getItem('pname');//세션에서 프로젝트명 가져오기
  const sortedSprints = useRecoilValue(sortedSprintsState);
  const activeSprint = sortedSprints.find(sprint => sprint.status === 'enabled'); // 활성화된 스프린트 가져오기

  // 활성화된 스프린트가 없을 경우 메시지 출력
  if (!activeSprint) {
    return (
      <BoardContainer>
        <BoardHeader>
          <BoardTitle>활성 스프린트</BoardTitle>
          <Breadcrumb>프로젝트 &gt; {pname || "프로젝트 이름 없음"} &gt; 활성 스프린트</Breadcrumb>
        </BoardHeader>

        <NotSprint>
          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <img src={sprintAlert} alt="스프린트 알림" style={{ width: '300px', height: 'auto' }} />
          </div>
          <p>활성화된 스프린트가 없습니다<br />이슈를 생성해보세요</p>
          <MoveBacklogButton onClick={() => navigate(`/backlog/${pid}`)}>백로그로 이동</MoveBacklogButton>
        </NotSprint>
      </BoardContainer>
    );
  }


  //소스 코드
  const [columns, setColumns] = useState({
    backlog: [{ id: '1', title: '이슈 이름 1', type: 'task' },],
    inProgress: [{ id: '2', title: '이슈 이름 2', type: 'bug' },],
    done: [{ id: '3', title: '이슈 이름 3', type: 'task' },],
    qa: [{ id: '4', title: '이슈 이름 4', type: 'bug' }, ],
  });
  const moveTask = (sourceColumn: string, targetColumn: string, dragIndex: number, hoverIndex: number) => {
    setColumns((prevColumns) => {
      const task = prevColumns[sourceColumn][dragIndex];
      return update(prevColumns, {
        [sourceColumn]: { $splice: [[dragIndex, 1]] }, // 드래그된 태스크 제거
        [targetColumn]: { $splice: [[hoverIndex, 0, task]] }, // 드롭 위치에 추가
      });
    });
  };


  return (
    <>
      <BoardContainer>
        <BoardHeader>{/* 상단 헤더 */}
          <BoardTitle>활성 스프린트</BoardTitle>{/* 제목 */}
          <Breadcrumb>프로젝트 &gt; {pname || '프로젝트 이름 없음'} &gt; 활성 스프린트</Breadcrumb>{/* 네비게이션 텍스트 */}
          <Filters>
            <label>담당자 <FaChevronDown /></label>
            <label>상태 <FaChevronDown /></label>
            <label>우선순위 <FaChevronDown /></label>
          </Filters>
          <SprintCompleteButton>스프린트 완료</SprintCompleteButton>
        </BoardHeader>

        <DndProvider backend={HTML5Backend}>
          {/* <BoardMain>
            <Column title="백로그" tasks={columns.backlog} columnId="backlog" onMoveTask={moveTask} />
            <Column title="진행 중" tasks={columns.inProgress} columnId="inProgress" onMoveTask={moveTask} />
            <Column title="개발 완료" tasks={columns.done} columnId="done" onMoveTask={moveTask} />
            <Column title="QA 완료" tasks={columns.qa} columnId="qa" onMoveTask={moveTask} />
          </BoardMain> */}
          <BoardMain>
          {Object.keys(columns).map((columnId) => (
            <Column
              key={columnId}
              title={columnId}
              tasks={columns[columnId]}
              columnId={columnId}
              moveTask={moveTask}
            />
          ))}
        </BoardMain>
        </DndProvider>
      </BoardContainer>
    </>
  );
};

export default SBoard;

