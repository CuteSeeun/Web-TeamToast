import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
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
import { allIssuesSelector, allIssuesState, Issue, Priority, Status, Type } from '../../recoil/atoms/issueAtoms';
import axios from 'axios';
import { currentProjectState } from '../../recoil/atoms/projectAtoms';
import { PreviewContainer } from '../../styles/CreateIssueModal';
import { IoAddOutline, IoCloseOutline } from 'react-icons/io5';
import { teamMembersState, TeamMember } from '../../recoil/atoms/memberAtoms'

type DropdownKeys = 'sprint' | 'createdBy' | 'manager' | 'type' | 'status' | 'priority';
type Sprint = { spid: number; spname: string; };


const IDBoard: React.FC = () => {
  const { isid } = useParams<{ isid: string }>(); // URL에서 id 값 추출
  const issues = useRecoilValue(allIssuesSelector);
  const sprints = useRecoilValue<Sprint[]>(sprintState);
  const issueId = parseInt(isid || '0', 10);
  const navigate = useNavigate();
  const currentProject = useRecoilValue(currentProjectState);
  const teamMembers = useRecoilValue(teamMembersState);
  const setAllIssues = useSetRecoilState(allIssuesState);
  const extendedSprints = [{ spid: -1, spname: '백로그' }, ...sprints];
  const [initialFiles, setInitialFiles] = useState<string[]>([]);
  const [initialFileNames, setInitialFileNames] = useState<{ originalFilename: string, previewUrl: string, key: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectName = sessionStorage.getItem('pname');


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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const issue = issues.find((issue: Issue) => issue.isid === issueId);

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


  useEffect(() => {
    if (issue && issue.file) {
      const fileArray = JSON.parse(issue.file); // JSON 파싱
      const existingPreviews = fileArray.map((file: { previewUrl: string }) => file.previewUrl);
      setInitialFiles(existingPreviews);
      setInitialFileNames(fileArray);
    }
  }, [issue]);


  if (!issue) {
    return <div>이슈를 찾을 수 없습니다.</div>;
  }

  // 해당 이슈와 관련된 스프린트를 찾기
  const sprint = sprints.find(sprint => sprint.spid === issue.sprint_id) || { spname: '' };

  // created_by와 manager의 첫 글자 추출
  const firstLetterCreatedBy = issue.created_by ? issue.created_by.charAt(0).toUpperCase() : '';
  const firstLetterManager = issue.manager ? issue.manager.charAt(0).toUpperCase() : '';

  // sessionStorage에서 space_id 가져오기
  const spaceId = parseInt(sessionStorage.getItem('sid') || '0', 10);
  console.log("sessionStorage spaceId:", spaceId);

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
    navigate(-1);
  };

  const handleUpdate = async () => {
    const selectedSprint = extendedSprints.find((sprint: Sprint) =>
      sprint.spname === selectedValues.sprint
    ) || sprint;

    const sprintId = selectedSprint && selectedSprint.spname === '백로그' ? null : (selectedSprint as Sprint)?.spid;

    try {
      // 파일 업로드 처리
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('files', file));

      const fileUploadPromise = selectedFiles.length > 0
        ? axios.post('/upload/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        : Promise.resolve({ data: { files: [] } });

      const [fileResponse] = await Promise.all([fileUploadPromise]);

      // 업로드된 파일 정보 처리
      const uploadedFiles = fileResponse.data.files.map((file: { originalFilename: string, previewUrl: string, key: string }) => ({
        originalFilename: file.originalFilename,
        previewUrl: file.previewUrl,
        key: file.key
      }));

      const updatedIssue = {
        ...issue,
        title: selectedValues.title || issue.title,
        sprint_id: sprintId,
        created_by: selectedValues.createdBy || issue.created_by || "",
        manager: selectedValues.manager || issue.manager || "",
        type: selectedValues.type as Type || issue.type,
        status: selectedValues.status as Status || issue.status,
        priority: selectedValues.priority as Priority || issue.priority,
        detail: selectedValues.detail || issue.detail,
        file: uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : null,
      };

      // 이슈 업데이트 요청
      const issueResponse = await axios.put(`/sissue/updateDetail/${issueId}`, updatedIssue);
      console.log('서버 응답 데이터:', issueResponse.data);

      const updatedIssueData: Issue = issueResponse.data.updatedIssue || updatedIssue;

      // Recoil 상태 업데이트
      setAllIssues(prevIssues => prevIssues.map((i: Issue) =>
        i.isid === issueId ? updatedIssueData : i
      ));
      alert('수정되었습니다.');

      // 상태 초기화
      setSelectedFiles([]); // 파일 선택 후 초기화
      setPreviews([]);
    } catch (error) {
      console.error('이슈 수정 또는 파일 업로드 실패:', error);
    }
  };



  // --------------------------------------------------------------------

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);

    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileDelete = (index: number) => {
    if (index < selectedFiles.length) {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const adjustedIndex = index - selectedFiles.length;
      setInitialFiles((prev) => prev.filter((_, i) => i !== adjustedIndex));
      setInitialFileNames((prev) => prev.filter((_, i) => i !== adjustedIndex));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = async (fileKey: string) => {
    try {
      const response = await axios.get(`/upload/download`, { params: { key: fileKey } }); // key 값을 사용하여 요청
      if (response.data.success) {
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = fileKey;
        link.click();
      } else {
        alert('파일 다운로드 URL 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };


  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>{issue.title}</BoardTitle>
        <Breadcrumb>프로젝트 &gt; {projectName} &gt; {sprint.spname} &gt; {issue.title}</Breadcrumb>
      </BoardHeader>

      <DetailMainWrapper>
        <DetailMain>
          <IssueSection>
            <Label>프로젝트</Label>
            <div>{projectName}</div>
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
                      {extendedSprints.map((sprint) => (
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
                  <AvatarImage>{firstLetterManager}</AvatarImage>
                  <DropdownContainer className="dropdown-container">
                    <DropdownLabel onClick={() => handleToggleDropdown('manager')}>
                      {selectedValues.manager || issue.manager || ""}
                    </DropdownLabel>
                    {isDropdownOpen === 'manager' && (
                      <DropdownList>
                        {teamMembers.map((member) => (
                          <DropdownItem
                            key={member.id}
                            onClick={() => handleSelectItem('manager', member.name)}
                          >
                            {member.name}
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
                  <AvatarImage>{firstLetterCreatedBy}</AvatarImage>
                  <DropdownContainer className="dropdown-container">
                    <DropdownLabel onClick={() => handleToggleDropdown('createdBy')}>
                      {selectedValues.createdBy || issue.created_by || ""}
                    </DropdownLabel>
                    {isDropdownOpen === 'createdBy' && (
                      <DropdownList>
                        {teamMembers.map((member) => (
                          <DropdownItem
                            key={member.id}
                            onClick={() => handleSelectItem('createdBy', member.name)}
                          >
                            {member.name}
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
          <PreviewContainer>
            {/* 커스텀 파일 추가 버튼 */}
            <label htmlFor="file-input" className="custom-file-button">
              <IoAddOutline className="file-btn" />
            </label>

            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              id="file-input"
              name="filename"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {/* 서버에서 받아온 기존 파일 미리보기 영역 */}
            {initialFiles.length > 0 && (
              <>
                {initialFiles.map((fileUrl, index) => (
                  <div className="preview-wrap" key={index}>
                    <div className="img-wrap" onClick={() => handleFileDelete(index + selectedFiles.length)}>
                      <img src={fileUrl} alt={`Preview ${index}`} />
                      <IoCloseOutline className="file-btn delete-btn" />
                    </div>
                    <p className="file-name">{initialFileNames[index]?.originalFilename}</p>
                    <button
                      className="download-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(initialFileNames[index]?.key); // key 값을 전달
                      }}
                    >
                      다운로드
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* 새로 선택한 파일 미리보기 영역 */}
            {selectedFiles.length > 0 && previews.length > 0 && (
              <>
                {previews.map((src, index) => (
                  <div className="preview-wrap" key={index} onClick={() => handleFileDelete(index)}>
                    <div className="img-wrap">
                      <img src={src} alt={`Preview ${index}`} />
                      <IoCloseOutline className="file-btn delete-btn" />
                    </div>
                    <p className="file-name">{selectedFiles[index]?.name}</p>
                  </div>
                ))}
              </>
            )}
          </PreviewContainer>

          <ButtonContainer>
            <Button onClick={onClose}>취소</Button>
            <Button primary onClick={handleUpdate}>수정</Button>
          </ButtonContainer>
        </DetailMain>
        <CommentList />
      </DetailMainWrapper>
    </BoardContainer >
  );
};

export default IDBoard;
