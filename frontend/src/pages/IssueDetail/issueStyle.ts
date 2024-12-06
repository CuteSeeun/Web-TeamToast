// issueStyle.ts
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
`;

export const InputArea = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  padding: 10px;
  flex: 0 0 5%;
`;

export const CommentField = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const SendButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;
export const DetailMainWrapper = styled.div`
  display: flex;
  width: 100%;
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