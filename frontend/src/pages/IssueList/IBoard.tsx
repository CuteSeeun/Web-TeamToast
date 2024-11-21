//칸반 보드

import React from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa'; // 다운 화살표 아이콘 추가
import { Link } from 'react-router-dom'; // React Router import

const BoardContainer = styled.div`
//   position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
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

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px; /* 네비게이션 텍스트와의 간격 */
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px; /* 검색창과의 간격 */
  
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* 인풋 필드와 버튼 사이의 간격 */

  input {
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    outline: none;
    width: 200px; /* 검색창 크기 */

    &::placeholder {
      color: #adb5bd;
    }
  }

  button {
    background-color: #038c8c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #026b6b;
    }

    &:active {
      transform: translateY(2px); /* 클릭 시 약간 눌리는 효과 */
    }
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
  max-height: 400px; /* 표의 최대 높이 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  border: 1px solid #dee2e6; /* 테두리 */
  border-radius: 8px; /* 테두리 둥글게 */
`;

const IssueTable = styled.table`
  width: 100%;
//border-collapse: collapse;


  th {
    background-color: #f8f9fa; /* 헤더 배경색 */
    text-align: left;
    padding: 12px;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #dee2e6;
  }

  td {
    padding: 12px;
    font-size: 14px;
    border-bottom: 1px solid #dee2e6;
  }

  tr:hover {
    background-color: #f1f3f5; /* 행에 마우스 올렸을 때 배경색 */
  }

  .status {
    display: inline-block;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: bold;
    color: white;
    border-radius: 5px;
  }

  .status-backlog {
    background-color: #adb5bd; /* 회색 */
  }

  .status-in-progress {
    background-color: #f0ad4e; /* 주황색 */
  }

  .status-completed {
    background-color: #5bc0de; /* 파란색 */
  }

  .status-qa {
    background-color: #5cb85c; /* 녹색 */
  }

  .priority {
    display: inline-block;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: bold;
    border-radius: 5px;
  }

  .priority-low {
    background-color: #dee2e6; /* 연한 회색 */
    color: #495057;
  }

  .priority-medium {
    background-color: #fdfd96; /* 노란색 */
    color: #495057;
  }

  .priority-high {
    background-color: #fa8072; /* 빨간색 */
    color: white;
  }
`;

const TableRow = styled.tr`
  td:first-child {
    text-align: center; /* 유형 아이콘 중앙 정렬 */
  }

  img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
  }
`;



const IBoard: React.FC = () => {
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
            {[
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
            ))}
          </tbody>
        </IssueTable>
      </TableContainer>
      
      
    </BoardContainer>
  );
};

export default IBoard;

