import React from 'react';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가
import { Link } from 'react-router-dom'; // React Router import
import { BoardContainer, BoardHeader, BoardTitle, Breadcrumb, Filters, FiltersContainer, IssueTable, SearchContainer, TableContainer } from './issueListStyle';
import { useRecoilValue } from 'recoil';
import { allIssuesState, Issue, Status, Type, Priority } from '../../recoil/atoms/issueAtoms';


const IBoard: React.FC = () => {
  const allIssues = useRecoilValue(allIssuesState);
  const TypeMap: Record<Type, string> = {
    [Type.process]: '작업',
    [Type.bug]: '버그',
  };
  
  const StatusMap: Record<Status, string> = {
    [Status.Backlog]: '백로그',
    [Status.Working]: '작업중',
    [Status.Dev]: '개발완료',
    [Status.QA]: 'QA완료',
  };
  
  const PriorityMap: Record<Priority, string> = {
    [Priority.high]: '높음',
    [Priority.normal]: '보통',
    [Priority.low]: '낮음',
  };


  return (
    <BoardContainer>

      <BoardHeader>{/* 상단 헤더 */}
        <BoardTitle>이슈 목록</BoardTitle>{/* 제목 */}
        <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 이슈 목록</Breadcrumb>{/* 네비게이션 텍스트 */}
        {/* 필터 및 검색창 */}
        <FiltersContainer>
          <Filters>
            <label>담당자 <FaChevronDown /></label>
            <label>유형 <FaChevronDown /></label>
            <label>상태 <FaChevronDown /></label>
            <label>우선순위 <FaChevronDown /></label>
          </Filters>
          <SearchContainer>
            <input type="text" placeholder="검색어를 입력해 주세요." />
            <button>검색</button>
          </SearchContainer>
        </FiltersContainer>
      </BoardHeader>

      {/* 표 영역 */}
      <TableContainer>
        <IssueTable>
          <thead>
            <tr>
              <th>유형</th>
              <th>제목</th>
              <th>상태</th>
              <th>우선 순위</th>
              <th>담당자</th>
            </tr>
          </thead>
          <tbody>
            {/* {[
              { type: '문서', title: '이슈 이름 1', status: '백로그', priority: '낮음', assignee: '사용자 1' },
              { type: '버그', title: '이슈 이름 2', status: '작업중', priority: '높음', assignee: '사용자 2' },
              { type: '문서', title: '이슈 이름 3', status: '개발 완료', priority: '보통', assignee: '사용자 3' },
              { type: '버그', title: '이슈 이름 4', status: 'QA 완료', priority: '높음', assignee: '사용자 3' },
              { type: '문서', title: '이슈 이름 5', status: '백로그', priority: '보통', assignee: '사용자 4' },
              { type: '버그', title: '이슈 이름 6', status: '작업중', priority: '긴급', assignee: '사용자 5' },
              { type: '문서', title: '이슈 이름 7', status: '개발 완료', priority: '낮음', assignee: '사용자 6' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
              { type: '버그', title: '이슈 이름 8', status: '백로그', priority: '보통', assignee: '사용자 7' },
            ].map((issue, index) => (
              <tr key={index}>
                <td>{issue.type}</td>
                <Link to={`/issue/${index}`}>{issue.title}</Link>
                <td>{issue.status}</td>
                <td>{issue.priority}</td>
                <td>{issue.assignee}</td>
              </tr>
            ))} */}
            {allIssues.map((issue: Issue, index) => (
              <tr key={issue.isid}>
                {/* <td>{Type[issue.type ]}</td>
                <td>
                  <Link to={`/issue/${issue.isid}`}>{issue.title}</Link>
                </td>
                <td>{Status[issue.status]}</td>
                <td>{Priority[issue.priority]}</td>
                <td>{issue.manager || 'Unassigned'}</td> */}
                {/* <td>{Type[issue.type as keyof typeof Type]}</td> */}
                <td>{TypeMap[issue.type]}</td>
                <td>
                  <Link to={`/issue/${issue.isid}`}>{issue.title}</Link>
                </td>
                {/* <td>{Status[issue.status as keyof typeof Status]}</td> */}
                <td>{StatusMap[issue.status]}</td>
                {/* <td>{Priority[issue.priority as keyof typeof Priority]}</td> */}
                <td>{PriorityMap[issue.priority]}</td>
                <td>{issue.manager || 'Unassigned'}</td>
              </tr>
            ))}
          </tbody>
        </IssueTable>
      </TableContainer>


    </BoardContainer>
  );
};

export default IBoard;

