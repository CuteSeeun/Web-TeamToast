// issueStyle.ts
import { IoCloseOutline } from "react-icons/io5";
import styled from "styled-components";

export const BoardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px; 
  width: 100%;
  box-sizing: border-box; 
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
  margin-top: 8px;
`;

export const Section = styled.div`
  margin-bottom: 20px;
`;

export const DesSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column; 
  align-items: flex-start;
`;

export const TitleSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column; 
  align-items: flex-start;
`;

export const Label = styled.div`
  display: inline-block;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  min-width: 80px; /* Label 요소의 최소 너비 설정 */
  margin-right: 20px; /* Label 요소 간의 간격 조정 */
`;


export const InputField = styled.input`
  width: 80%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const Tag = styled.div`
  display: inline-block;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
`;

export const Avatar = styled.div`
  display: flex; 
  align-items: center; 
  gap: 8px; 
`;


export const AvatarImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ddd;
  font-size: 14px;
  font-weight: bold;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0; 
`;



export const Description = styled.textarea`
  width: 80%;
  height: 100px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const FileUpload = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const FileItem = styled.div`
  width: 80px;
  height: 80px;
  border: 1px dashed #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  cursor: pointer;

  img {
    max-width: 100%;
    max-height: 50px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ primary }) => (primary ? "#007bff" : "#ddd")};
  color: ${({ primary }) => (primary ? "white" : "#333")};

  &:hover {
    background-color: ${({ primary }) => (primary ? "#0056b3" : "#ccc")};
  }
`;

export const DetailMain = styled.div`
  padding: 0px;
  margin-right: 10px;
  margin-left: 10px;
  border-right: 1px solid #ddd;
  width: 65%;
  box-sizing: border-box;
`;


export const Comment = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 35%;
`;

export const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  min-height: 0;

  // p 태그를 인라인으로 만들기
  p {
    display: inline-block;
    margin-right: 10px; // p 태그 간의 간격 조절
  }
`;

export const DetailMainWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

export const IssueList = styled.div`
  display: flex; 
  flex-direction: column; /* 세로로 배치 */
  gap: 20px; /* 요소 간 간격 */
  border-right: 1px solid #ddd; /* 간격 사이에 줄 추가 */
  padding-right: 50px; /* 줄과의 여백 추가 */
  
  &:last-child {
    border-right: none; /* 마지막 요소에는 줄을 제거 */
  }
`;

export const IssueSection = styled.div`
  display: flex;
  gap: 10px; /* 요소 간 간격 */
  min-width: 120px; /* 최소 너비 설정 */
  align-items: flex-start; /* 좌측 정렬 */
`;

export const List = styled.div`
  display: flex;
  gap: 10px; 
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

export const SelectLabel = styled.div`
  display: inline-block;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  min-width: 80px;
  margin-right: 20px;
  cursor: pointer;
  position: relative; /* 부모 요소에 상대 위치 지정 */
  &:hover {
    background-color: #f1f1f1;
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownLabel = styled(SelectLabel)`
  cursor: pointer;
  &:hover {
    background-color: lightgrey;
  }
`;

export const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  z-index: 1000;
`;

export const DropdownItem = styled.li`
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: lightgrey;
  }
`;

export const CommentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column-reverse;
  height: 500px; /* 원하는 높이 설정 */
  overflow-y: auto; /* 세로 스크롤 추가 */
  background-color: #f0f0f0;  /* 배경색을 회색으로 변경 */
  border-radius: 10px;  /* 모서리를 둥글게 설정 */
  padding: 10px;
`;

export const CommentField = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  line-height: 1.5; /* 줄높이 설정 */
  vertical-align: middle; /* 수직 정렬 */
`;

export const SendButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
  line-height: 1.5; /* 줄높이 설정 */
  vertical-align: middle; /* 수직 정렬 */
  &:hover {
    background-color: #0056b3;
  }
`;


export const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  flex-direction: row; /* 가로 방향 유지 */
`;


export const CommentBoxContainer = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
`;

export const CommentUserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  // white-space: nowrap;

  p {
    margin: 0 10px;
    font-weight: bold;
  }
  span {
    cursor: pointer;
    margin-left: 10px;
  }
`;


export const CommentContent = styled.div`
  p {
    margin: 0;
  }
`;
export const CommentUserDetails = styled.div`
    display: flex;
    align-items: center;

    p {
        margin: 0 10px;
        white-space: nowrap;
    }
`;

export const CommentActions = styled.div`
    display: flex;
    align-items: center;

    span {
        cursor: pointer;
        margin-left: 10px;
        white-space: nowrap;
    }
`;

export const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const PreviewWrap = styled.div`
  position: relative;
  width: 150px;
  text-align: center;
`;

export const ImageWrap = styled.div`
  position: relative;
  cursor: pointer;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: auto;
`;

export const DeleteButton = styled(IoCloseOutline)`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
`;

export const FileName = styled.p`
  margin: 5px 0;
`;

export const DownloadButton = styled.button`
  display: block;
  margin: 5px auto 0;
  padding: 5px 10px;
  cursor: pointer;
`;
