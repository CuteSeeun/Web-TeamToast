import React from 'react';
import { useParams } from 'react-router-dom';
import { AiOutlinePlus } from "react-icons/ai";
import { useRecoilValue } from 'recoil';
import {
  Avatar,
  AvatarImage,
  BoardContainer,
  BoardHeader,
  BoardTitle,
  Breadcrumb,
  Button,
  ButtonContainer,
  Description,
  DetailMain,
  DetailMainWrapper,
  FileItem,
  FileUpload,
  InputField,
  Label,
  Comment,
  DesSection,
  TitleSection,
  ChatArea,
  InputArea,
  CommentField,
  SendButton,
  IssueList,
  IssueSection,
  List
} from './issueStyle';
import { sprintState } from '../../recoil/atoms/sprintAtoms';
import { issueState } from '../../recoil/atoms/issueAtoms';

const IDBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 id 값 추출
  const sprints = useRecoilValue(sprintState);
  const issue = useRecoilValue(issueState(Number(id))); // id 값을 Number로 변환하여 사용

  if (!issue) {
    return <div>이슈를 찾을 수 없습니다.</div>;
  }

  // 해당 이슈와 관련된 스프린트를 찾기
  const sprint = sprints.find(sprint => sprint.spid === issue.sprint_id) || { spname: '' };

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>{issue.title}</BoardTitle>
        <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; {sprint.spname} &gt; {issue.title}</Breadcrumb>
      </BoardHeader>

      <DetailMainWrapper>
        <DetailMain>
          <IssueSection>
            <Label>프로젝트</Label>
            <div>프로젝트 이름</div>
          </IssueSection>

          <TitleSection>
            <Label>제목</Label>
            <InputField defaultValue={issue.title} />
          </TitleSection>

          <List>
            <IssueList>
              <IssueSection>
                <Label>스프린트</Label>
                <Label>{sprint.spname}</Label>
              </IssueSection>
              <IssueSection>
                <Label>담당자</Label>
                <Avatar>
                  <AvatarImage>담</AvatarImage>
                  {issue.created_by}
                </Avatar>
              </IssueSection>
              <IssueSection>
                <Label>보고자</Label>
                <Avatar>
                  <AvatarImage>사</AvatarImage>
                  {issue.manager}
                </Avatar>
              </IssueSection>
            </IssueList>

            <IssueList>
              <IssueSection>
                <Label>유형</Label>
                <Label>{issue.type}</Label>
              </IssueSection>
              <IssueSection>
                <Label>상태</Label>
                <Label>{issue.status}</Label>
              </IssueSection>
              <IssueSection>
                <Label>우선 순위</Label>
                <Label>{issue.priority}</Label>
              </IssueSection>
            </IssueList>
          </List>

          <DesSection>
            <Label>설명</Label>
            <Description placeholder={issue.detail || ""} />
          </DesSection>

          <IssueSection>
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
          </IssueSection>

          <ButtonContainer>
            <Button>취소</Button>
            <Button primary>수정</Button>
          </ButtonContainer>
        </DetailMain>
        <Comment>
          <ChatArea>
            {/* 채팅 메시지가 여기에 표시됩니다 */}
          </ChatArea>
          <InputArea>
            <CommentField placeholder="댓글을 입력하세요" />
            <SendButton>입력</SendButton>
          </InputArea>
        </Comment>
      </DetailMainWrapper>
    </BoardContainer>
  );
};

export default IDBoard;
