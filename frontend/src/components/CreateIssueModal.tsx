import { CreateIssueModalWrap, PreviewContainer } from "../styles/CreateIssueModal";
import { useRecoilValue } from "recoil";
import React, { useEffect, useState } from "react";
import { Issue, Type, Status, Priority } from '../recoil/atoms/issueAtoms';
import { IoChevronDownOutline, IoCloseOutline, IoAddOutline } from "react-icons/io5";

import useCurrentProject from '../hooks/useCurrentProject';
import { sprintState } from "../recoil/atoms/sprintAtoms";

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: Issue, files: File[]) => Promise<void>;
};

export const CreateIssueModal = (props :IssueModalProps): JSX.Element | null   => {
  const {currentProject} = useCurrentProject();
  const sprints = useRecoilValue(sprintState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const projectId = currentProject.pid;
  const projectName = currentProject.pname;

  // 객체 기반 issue 스테이트 작성 (임시)
  const [issue, setIssue] = useState<Issue>({
    title: '',
    detail: '',
    type: Type.process,
    status: Status.Backlog,
    sprint_id: null,
    project_id: projectId,
    manager: null,
    created_by: null,
    file: null,
    priority: Priority.normal,
  });
  
  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
  
    const fileArray = Array.from(files);
    console.log("새로 선택된 파일:", fileArray);
    

    // 기존 선택된 파일과 합쳐 중복 검사
    const previousFiles = [...selectedFiles]; // 기존 선택된 파일
    const duplicatedFiles = fileArray.filter((file) =>
      previousFiles.some(
        (selectedFile) =>
          selectedFile.name === file.name &&
          selectedFile.size === file.size &&
          selectedFile.lastModified === file.lastModified
      )
    );

    if (duplicatedFiles.length > 0) {
      alert("중복된 파일은 업로드할 수 없습니다.");
      return;
    };

    // 중복을 제외한 파일만 추가
    const uniqueFiles = fileArray.filter(
    (file) =>
      !previousFiles.some(
        (selectedFile) =>
          selectedFile.name === file.name &&
          selectedFile.size === file.size &&
          selectedFile.lastModified === file.lastModified
      )
    );
  
    console.log("중복 제외 후 추가할 파일:", uniqueFiles);

    setSelectedFiles((prev) => [...prev, ...uniqueFiles]); // 선택된 파일 저장
  
    // 미리보기 URL 생성
    const newPreviews = uniqueFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]); // 미리보기 상태 업데이트
  
    // 파일 입력 필드 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    };
  };

  // 파일 선택 해제
  const handleFileDelete = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    };
  };

  // 공통 핸들러
  const handleValueChange = (key: keyof Issue, value: any) => {
    setIssue((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    // 파일 데이터 업로드 준비
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    // 파일 이름 배열 생성
    const fileNames = selectedFiles.map((file) => file.name);

    if ([(issue.title || '').trim(), issue.type, issue.status, issue.project_id, issue.priority].some((field) => !field)) {
      alert('필수 데이터가 누락되었습니다.');
      return;
    }
    // issue 객체에 파일 이름 배열 설정
    const updatedIssue = {
      ...issue,
      file: fileNames,
    };

    try {
      console.log(
        `
        title: ${updatedIssue.title},
        type: ${updatedIssue.type},
        status: ${updatedIssue.status},
        sprint_id: ${updatedIssue.sprint_id},
        project_id: ${updatedIssue.project_id},
        file: ${updatedIssue.file},
        priority: ${updatedIssue.priority}
        `
      );
  
      // 비동기 작업 완료까지 대기
      await props.onSubmit(updatedIssue, selectedFiles);
  
      // 상태 초기화
      setIssue({
        title: '',
        detail: '',
        type: Type.process,
        status: Status.Backlog,
        sprint_id: null,
        project_id: projectId,
        manager: null,
        created_by: null,
        file: null,
        priority: Priority.normal,
      });
      setSelectedFiles([]);
      setPreviews([]); // 미리보기 초기화
  
      // 모달 닫기
      props.onClose();
    } catch (err) {
      console.error('이슈 생성 실패:', err);
    }
  };

  const handleFileReset = () => {
    setSelectedFiles([]);
    setPreviews([]);
  }

  // 메모리 누수 방지
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  if (!props.isOpen) return null;

  return (
  <CreateIssueModalWrap>
    <div className="modal">
      <h3>이슈 생성</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>프로젝트 이름</label>
            <input
              type="text"
              defaultValue={projectName}
              className="disabled"
            />
          </div>
          <div className="input-group">
            <label>스프린트 선택</label>
            <div className="select-container sprint-select">
              <select
                name="sprint_id"
                value={issue.sprint_id || ''}
                onChange={(e) => handleValueChange('sprint_id', parseInt(e.target.value))}
              >
                <option value="" disabled>
                  스프린트 없음
                </option>
                {sprints.map((sprint) => (
                  <option key={sprint.spid} value={sprint.spid}>
                    {sprint.spname}
                  </option>
                ))}
              </select>
              <IoChevronDownOutline className="downIcon" />
            </div>
          </div>
          <div className="input-group">
            <label>제목</label>
            <input
              type="text"
              value={issue.title}
              onChange={(e) => handleValueChange('title', e.target.value)}
              placeholder="이슈 제목을 입력해 주세요."
            />
          </div>
          <div className="select-group">
            <div className="input-group">
              <label>유형</label>
              <div className="select-container">
                <select
                  name="type"
                  value={issue.type}
                  onChange={(e) => handleValueChange('type', e.target.value)}
                >
                  <option value={Type.process}>작업</option>
                  <option value={Type.bug}>버그</option>
                </select>
                <IoChevronDownOutline className="downIcon" />
              </div>
              
            </div>
            <div className="input-group">
              <label>상태</label>
              <div className="select-container">
                <select
                  name="status"
                  value={issue.status}
                  onChange={(e) => handleValueChange('status', e.target.value)}
                >
                  <option value={Status.Backlog}>백로그</option>
                  <option value={Status.Working}>작업중</option>
                  <option value={Status.Dev}>개발완료</option>
                  <option value={Status.QA}>QA완료</option>
                </select>
                <IoChevronDownOutline className="downIcon" />
              </div>
            </div>
            <div className="input-group">
              <label>우선순위</label>
              <div className="select-container">
                <select
                  name="priority"
                  value={issue.priority}
                  onChange={(e) => handleValueChange('priority', e.target.value)}
                >
                  <option value={Priority.high}>높음</option>
                  <option value={Priority.normal}>보통</option>
                  <option value={Priority.low}>낮음</option>
                </select>
                <IoChevronDownOutline className="downIcon" />
              </div>
            </div>
          </div>
          <div className="input-group">
            <label>설명</label>
            <input
              type="text"
              value={issue.detail}
              onChange={(e) => handleValueChange('detail', e.target.value)}
              placeholder="이슈 설명을 입력해 주세요."
            />
          </div>
          <div className="select-group">
            <div className="input-group">
              <label>보고자</label>
              <div className="select-container">
                <select
                  name="created_by"
                  value={issue.created_by || ''}
                  onChange={(e) => handleValueChange('created_by', e.target.value)}
                >
                  <option value="" disabled>
                    없음
                  </option>
                  {/* 팀원 목록을 받아와서 렌더링 (구현안됨) */}
                </select>
                <IoChevronDownOutline className="downIcon" />
              </div>
            </div>
            <div className="input-group">
              <label>담당자</label>
              <div className="select-container">
                <select
                  name="manager"
                  value={issue.manager || ''}
                  onChange={(e) => handleValueChange('manager', e.target.value)}
                >
                  <option value="" disabled>
                    없음
                  </option>
                  {/* 팀원 목록을 받아와서 렌더링 */}
                </select>
                <IoChevronDownOutline className="downIcon" />
              </div>
            </div>
          </div>
          {/* 파일 업로드 입력 */}
          <div className="input-group">
            <label>파일 등록</label>
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

              {/* 파일 미리보기 영역 */}
              {previews.map((src, index) => (
                <div
                  className="preview-wrap"
                  key={index}
                  onClick={() => handleFileDelete(index)}
                >
                  <div className="img-wrap"><img src={src} alt={`Preview ${index}`} /></div>
                  <IoCloseOutline className="file-btn" />
                  <p className="file-name">{selectedFiles[index]?.name}</p>
                </div>
              ))}
            </PreviewContainer>
          </div>
          <div className="button-group">
            <button 
              type="button" 
              onClick={() => {
                handleFileReset();
                props.onClose();
              }}>취소</button>
            <button type="submit">생성</button>
          </div>
        </form>
    </div>
  </CreateIssueModalWrap>
);
};