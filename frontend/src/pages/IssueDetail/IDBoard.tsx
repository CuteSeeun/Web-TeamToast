//칸반 보드

import React from 'react';
import styled from 'styled-components';
import { AiOutlinePlus } from "react-icons/ai";

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


//----------------------------------------


const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Tag = styled.div`
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

const Avatar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AvatarImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ddd;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Description = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const FileUpload = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const FileItem = styled.div`
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
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

const DetailMain = styled.div`
  padding : 0px;
  margin-right: 10px;
  margin-left: 10px;
  border-right: 1px solid #ddd;
`;

const Comment = styled.div`
    margin-top : 10px;
`;


const IDBoard: React.FC = () => {
    return (
        <BoardContainer>
            <BoardHeader>
                <BoardTitle>토스 모듈 연결</BoardTitle>
                <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 이슈 목록 &gt; 토스 모듈 연결</Breadcrumb>
            </BoardHeader>

            <DetailMain>
                {/* 프로젝트 정보 */}
                <Section>
                    <Label>프로젝트</Label>
                    <div>프로젝트 이름</div>
                </Section>

                {/* 제목 */}
                <Section>
                    <Label>제목</Label>
                    <InputField defaultValue="이슈 이름 1" />
                </Section>

                {/* 스프린트, 유형, 상태 */}
                <Section>
                    <Label>스프린트</Label>
                    <Tag>백로그</Tag>
                    <Tag>작업</Tag>
                </Section>

                {/* 보고자, 담당자 */}
                <Section>
                    <Label>보고자</Label>
                    <Avatar>
                        <AvatarImage>사</AvatarImage>
                        사용자 1
                    </Avatar>
                </Section>

                <Section>
                    <Label>담당자</Label>
                    <Avatar>
                        <AvatarImage>담</AvatarImage>
                        사용자 1
                    </Avatar>
                </Section>

                {/* 설명 */}
                <Section>
                    <Label>설명</Label>
                    <Description placeholder="설명을 입력해 주세요." />
                </Section>

                {/* 첨부 파일 */}
                <Section>
                    <Label>첨부 파일</Label>
                    <FileUpload>
                        <FileItem>
                            <AiOutlinePlus />
                            파일 추가
                        </FileItem>
                        <FileItem>
                            <img src="https://via.placeholder.com/50" alt="첨부 파일 미리보기" />
                            파일 이름
                        </FileItem>
                    </FileUpload>
                </Section>

                {/* 버튼 */}
                <ButtonContainer>
                    <Button>취소</Button>
                    <Button primary>수정</Button>
                </ButtonContainer>
            </DetailMain>

            <Comment>
                
            </Comment>


        </BoardContainer>
    );
};

export default IDBoard;

