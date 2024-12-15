import styled from "styled-components";
import { Link } from 'react-router-dom';

export const BoardContainer = styled.div`
  /* position: relative; 
  display: flex;
  flex-direction: column;
  padding-left: 25px;  */
  position: relative;
  display: flex;
  flex-direction: column;
  padding-left: 25px; 
  padding-right: 70px;
  width: 1600px;
  overflow: hidden;
  background: linear-gradient(180deg, #FFFFFF, #81C5C5);
`;
export const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
`;
export const BoardTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;
export const Breadcrumb = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 8px; /* 제목과의 간격 */
`;
export const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px; /* 네비게이션 텍스트와의 간격 */
`;
export const Filters = styled.div`
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
export const SearchContainer = styled.div`
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
export const TableContainer = styled.div`
  margin-top: 20px;
  max-height: 400px; /* 표의 최대 높이 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  border: 1px solid #dee2e6; /* 테두리 */
  border-radius: 8px; /* 테두리 둥글게 */
`;
export const IssueTable = styled.table`
  width: 100%;
border-collapse: collapse;
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
export const TableRow = styled.tr`
  td:first-child {
    text-align: center; /* 유형 아이콘 중앙 정렬 */
  }
  img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
  }
`;
export const StyledLink = styled(Link)`
  font-weight: bold; /* 볼드체 */
  text-decoration: none; /* 링크 밑줄 제거 */
  color: inherit; /* 부모 요소의 색상 상속 */
  &:hover {
    background-color:rgb(156, 210, 210); /* 호버 시 배경색 회색 */
    border-radius: 4px; /* 배경색 적용 시 살짝 둥글게 */
    padding: 4px; /* 호버 시 내부 여백 추가 */
  }
`;
