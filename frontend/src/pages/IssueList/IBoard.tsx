import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가
import { BoardContainer, BoardHeader, BoardTitle, Breadcrumb, Filters, FiltersContainer, IssueTable, SearchContainer, TableContainer, StyledLink } from './issueListStyle';
import { useRecoilValue } from 'recoil';
import { allIssuesState, Issue, Status, Type, Priority } from '../../recoil/atoms/issueAtoms';
import { ReactComponent as IssueTaskIcon } from '../../assets/icons/Issue-Task.svg';
import { ReactComponent as IssueBugIcon } from '../../assets/icons/Issue-Bug.svg';
import { HashLoader } from 'react-spinners';


const IBoard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const pname = sessionStorage.getItem('pname');
  const allIssues = useRecoilValue(allIssuesState);
  const [searchText, setSearchText] = useState(''); // 검색어 상태 추가

  const [showDropdown, setShowDropdown] = useState(false);
  // 최근 조회된 이슈를 로컬 스토리지에서 관리
  const [recentIssues, setRecentIssues] = useState<Issue[]>(() => {
    const storedIssues = localStorage.getItem("recentIssues");
    return storedIssues ? JSON.parse(storedIssues) : [];
  });

  // 2초 후 로딩 상태 종료 (추가)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, []);


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
  // 검색어로 필터링된 이슈 배열 생성
  const filteredIssues = allIssues.filter((issue: Issue) =>
    issue.title.toLowerCase().includes(searchText.toLowerCase())
  );


  // 최근 조회된 이슈 업데이트 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("recentIssues", JSON.stringify(recentIssues));
  }, [recentIssues]);
  // input 클릭 시 최근 조회된 이슈 표시
  const handleInputFocus = () => {
    setShowDropdown(true);
  };
  // 최근 조회된 이슈 클릭 시 동작
  const handleRecentIssueClick = (issue: Issue) => {
    setSearchText(issue.title); // 검색어에 선택한 제목을 설정
    setShowDropdown(false); // 드롭다운 닫기
  };
  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200); // 클릭 후 닫기 지연
  };
  const handleIssueClick = (issue: Issue) => {
    // 최근 조회된 이슈를 업데이트하고 중복 제거
    const updatedIssues = [issue, ...recentIssues.filter((i) => i.isid !== issue.isid)].slice(0, 5);
    setRecentIssues(updatedIssues); // 상태 업데이트
    localStorage.setItem("recentIssues", JSON.stringify(updatedIssues)); // 로컬 스토리지 직접 업데이트
    console.log("최근 조회한 이슈:", updatedIssues);
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
    <BoardContainer>

      <BoardHeader>{/* 상단 헤더 */}
        <BoardTitle>이슈 목록</BoardTitle>{/* 제목 */}
        <Breadcrumb>프로젝트 &gt; {pname} &gt; 이슈 목록</Breadcrumb>{/* 네비게이션 텍스트 */}

        <FiltersContainer>{/* 필터 및 검색창 */}
          <Filters>
            <label>담당자 <FaChevronDown /></label>
            <label>유형 <FaChevronDown /></label>
            <label>상태 <FaChevronDown /></label>
            <label>우선순위 <FaChevronDown /></label>
          </Filters>
          <SearchContainer>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="검색어를 입력해 주세요."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {showDropdown && (
                <div style={{
                  position: "absolute", top: "100%",
                  left: 0, width: "91%", backgroundColor: "white",
                  border: "1px solid #ddd", borderRadius: "4px",
                  zIndex: 10, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                }}
                >
                  <p style={{ fontWeight: "bold", marginBottom: "5px" }}>최근 조회한 이슈</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {recentIssues.map((issue) => (
                      <li
                        key={issue.isid}
                        onClick={() => handleRecentIssueClick(issue)}
                        style={{
                          padding: "5px 10px", cursor: "pointer",
                          borderRadius: "4px", backgroundColor: "white",
                        }}
                      >
                        {issue.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

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
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue: Issue) => (
                <tr key={issue.isid}>
                  <td style={{ display: 'flex', alignItems: 'center' }}>
                    {issue.type === Type.process && <IssueTaskIcon style={{ marginRight: '10px' }} />}
                    {issue.type === Type.bug && <IssueBugIcon style={{ marginRight: '10px' }} />}
                    {TypeMap[issue.type]}
                  </td>
                  <td><StyledLink to={`/issue/${issue.isid}`}
                    onClick={() => handleIssueClick(issue)}
                  >
                    {issue.title}
                  </StyledLink></td>
                  <td>{StatusMap[issue.status]}</td>
                  <td>{PriorityMap[issue.priority]}</td>
                  <td>{issue.manager || 'Unassigned'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                  해당 이슈가 없습니다
                </td>
              </tr>

            )}
          </tbody>
        </IssueTable>
      </TableContainer>


    </BoardContainer>
  );
};

export default IBoard;

