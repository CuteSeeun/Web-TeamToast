import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus } from "react-icons/ai";
import { useRecoilValue } from 'recoil';
import CommentList from './CommentList';
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
  DesSection,
  TitleSection,
  IssueList,
  IssueSection,
  List,
  DropdownContainer,
  DropdownLabel,
  DropdownList,
  DropdownItem
} from './issueStyle';
import { sprintState } from '../../recoil/atoms/sprintAtoms';
import { allIssuesSelector, Issue } from '../../recoil/atoms/issueAtoms';
import axios from 'axios';
import { currentProjectState } from '../../recoil/atoms/projectAtoms';

type DropdownKeys = 'sprint' | 'createdBy' | 'manager' | 'type' | 'status' | 'priority';
type Sprint = { spid: number; spname: string; };

const IDBoard: React.FC = () => {
  const { isid } = useParams<{ isid: string }>(); // URL에서 id 값 추출
  const issues = useRecoilValue(allIssuesSelector);
  const sprints = useRecoilValue<Sprint[]>(sprintState);
  const issueId = parseInt(isid || '0', 10);
  const navigate = useNavigate();
  const currentProject = useRecoilValue(currentProjectState);

  // 여러 SelectLabel의 상태를 관리하기 위해 개별 상태 변수 추가
  const [isDropdownOpen, setDropdownOpen] = useState<DropdownKeys | null>(null);
  const [selectedValues, setSelectedValues] = useState({
    title: '',
    sprint: '',
    createdBy: '',
    manager: '',
    type: '',
    status: '',
    priority: '',
    detail: '',
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const issue = issues.find((issue: Issue) => issue.isid === issueId);

  if (!issue) {
    return <div>이슈를 찾을 수 없습니다.</div>;
  }

  // 해당 이슈와 관련된 스프린트를 찾기
  const sprint = sprints.find(sprint => sprint.spid === issue.sprint_id) || { spname: '' };

  // created_by와 manager의 첫 글자 추출
  const firstLetterCreatedBy = issue.created_by ? issue.created_by.charAt(0).toUpperCase() : '';
  const firstLetterManager = issue.manager ? issue.manager.charAt(0).toUpperCase() : '';

  const handleToggleDropdown = (key: DropdownKeys) => {
    setDropdownOpen(prevState => (prevState === key ? null : key));
  };

  const handleSelectItem = (key: DropdownKeys, item: string) => {
    setSelectedValues(prevState => ({
      ...prevState,
      [key]: item,
    }));
    setDropdownOpen(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedValues(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onClose = () => {
    navigate(`/backlog/${isid}`);
  };
  // handleUpdate 함수 수정

  const handleUpdate = async () => {
    const selectedSprint = sprints.find((sprint: Sprint) => sprint.spname === (selectedValues.sprint || sprint.spname)) || sprint;
    const sprintId = (selectedSprint as Sprint).spid;

    const updatedIssue = {
      title: selectedValues.title || issue.title,
      sprint_id: sprintId,
      created_by: selectedValues.createdBy || issue.created_by || "",
      manager: selectedValues.manager || issue.manager || "",
      type: selectedValues.type || issue.type,
      status: selectedValues.status || issue.status,
      priority: selectedValues.priority || issue.priority,
      detail: selectedValues.detail || issue.detail,
    };

    try {
      const response = await axios.put(`/sissue/updateDetail/${issueId}`, updatedIssue);
      // 필요한 후속 작업 수행
      alert('수정되었습니다.');
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>{issue.title}</BoardTitle>
        <Breadcrumb>프로젝트 &gt; {currentProject.pname} &gt; {sprint.spname} &gt; {issue.title}</Breadcrumb>
      </BoardHeader>

      <DetailMainWrapper>
        <DetailMain>
          <IssueSection>
            <Label>프로젝트</Label>
            <div>프로젝트 이름</div>
          </IssueSection>

          <TitleSection>
            <Label>제목</Label>
            <InputField name="title" defaultValue={issue.title} onChange={handleChange} />
          </TitleSection>

          <List>
            <IssueList>
              <IssueSection>
                <Label>스프린트</Label>
                <DropdownContainer className="dropdown-container">
                  <DropdownLabel onClick={() => handleToggleDropdown('sprint')}>
                    {selectedValues.sprint || sprint.spname}
                  </DropdownLabel>
                  {isDropdownOpen === 'sprint' && (
                    <DropdownList>
                      {sprints.map((sprint) => (
                        <DropdownItem key={sprint.spid} onClick={() => handleSelectItem('sprint', sprint.spname)}>
                          {sprint.spname}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  )}
                </DropdownContainer>
              </IssueSection>
              <IssueSection>
                <Label>담당자</Label>
                <Avatar>
                  <AvatarImage>{firstLetterCreatedBy}</AvatarImage>
                  <DropdownContainer className="dropdown-container">
                    <DropdownLabel onClick={() => handleToggleDropdown('createdBy')}>
                      {selectedValues.createdBy || issue.created_by || ""}
                    </DropdownLabel>
                    {isDropdownOpen === 'createdBy' && (
                      <DropdownList>
                        {issues.map((issue) => (
                          <DropdownItem key={issue.created_by || ""} onClick={() => handleSelectItem('createdBy', issue.created_by || "")}>
                            {issue.created_by || ""}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    )}
                  </DropdownContainer>
                </Avatar>
              </IssueSection>
              <IssueSection>
                <Label>보고자</Label>
                <Avatar>
                  <AvatarImage>{firstLetterManager}</AvatarImage>
                  <DropdownContainer className="dropdown-container">
                    <DropdownLabel onClick={() => handleToggleDropdown('manager')}>
                      {selectedValues.manager || issue.manager || ""}
                    </DropdownLabel>
                    {isDropdownOpen === 'manager' && (
                      <DropdownList>
                        {issues.map((issue) => (
                          <DropdownItem key={issue.manager || ""} onClick={() => handleSelectItem('manager', issue.manager || "")}>
                            {issue.manager || ""}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    )}
                  </DropdownContainer>
                </Avatar>
              </IssueSection>
            </IssueList>

            <IssueList>
              <IssueSection>
                <Label>유형</Label>
                <DropdownContainer className="dropdown-container">
                  <DropdownLabel onClick={() => handleToggleDropdown('type')}>
                    {selectedValues.type || issue.type}
                  </DropdownLabel>
                  {isDropdownOpen === 'type' && (
                    <DropdownList>
                      {['작업', '버그'].map(type => (
                        <DropdownItem key={type} onClick={() => handleSelectItem('type', type)}>
                          {type}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  )}
                </DropdownContainer>
              </IssueSection>
              <IssueSection>
                <Label>상태</Label>
                <DropdownContainer className="dropdown-container">
                  <DropdownLabel onClick={() => handleToggleDropdown('status')}>
                    {selectedValues.status || issue.status}
                  </DropdownLabel>
                  {isDropdownOpen === 'status' && (
                    <DropdownList>
                      {['백로그', '작업중', '개발완료', 'QA완료'].map(status => (
                        <DropdownItem key={status} onClick={() => handleSelectItem('status', status)}>
                          {status}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  )}
                </DropdownContainer>
              </IssueSection>
              <IssueSection>
                <Label>우선 순위</Label>
                <DropdownContainer className="dropdown-container">
                  <DropdownLabel onClick={() => handleToggleDropdown('priority')}>
                    {selectedValues.priority || issue.priority}
                  </DropdownLabel>
                  {isDropdownOpen === 'priority' && (
                    <DropdownList>
                      {['높음', '보통', '낮음'].map(priority => (
                        <DropdownItem key={priority} onClick={() => handleSelectItem('priority', priority)}>
                          {priority}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  )}
                </DropdownContainer>
              </IssueSection>
            </IssueList>
          </List>

          <DesSection>
            <Label>설명</Label>
            <Description name="detail" defaultValue={issue.detail || ""} onChange={handleChange} />
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
            <Button onClick={onClose}>취소</Button>
            <Button primary onClick={handleUpdate}>수정</Button>
          </ButtonContainer>
        </DetailMain>
        <CommentList />
      </DetailMainWrapper>
    </BoardContainer>
  );
};

export default IDBoard;
