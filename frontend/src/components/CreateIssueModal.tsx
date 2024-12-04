import { CreateIssueModalWrap, PreviewContainer } from "../styles/CreateIssueModal";
import { useRecoilValue } from "recoil";
import React, { useEffect, useMemo, useState } from "react";
import { Issue } from "../types/issueTypes";
import { IoChevronDownOutline, IoCloseOutline, IoAddOutline } from "react-icons/io5";

import { spaceIdState } from "../recoil/atoms/spaceAtoms";
import { projectIdState } from "../recoil/atoms/projectAtoms";
import { sprintState } from "../recoil/atoms/sprintAtoms";
import axios from "axios";

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: Issue, files: File[]) => void;
};

export const CreateIssueModal = (props :IssueModalProps): JSX.Element | null   => {
  const projectId = useRecoilValue(projectIdState);
  const sprints = useRecoilValue(sprintState);
  const spaceId = useRecoilValue(spaceIdState);
  const [projectName, setProjectName] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const token = localStorage.getItem('accessToken');
  // if (!token) {
  //   console.error('Access Token이 없습니다.');
  // } else {
  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1])); // JWT의 payload 디코드
  //     const now = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
  //     if (payload.exp && payload.exp < now) {
  //       console.error('Access Token이 만료되었습니다.');
  //     };
  //   } catch (err) {
  //     console.error('Access Token 디코드 오류:', err);
  //   };
  // };
  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }), [token]);

  useEffect(() => {
    const fetchProjectName = async () => {
      if(!spaceId){
        console.log(`spaceId가 없습니다. spaceId:${spaceId}`);
        return;
      };
      if (projectId === 0) {
        setProjectName('프로젝트가 선택되지 않았습니다.');
        return;
      };

      try {
        const { data } = await axios.get(`http://localhost:3001/projects/${spaceId}/${projectId}`, {headers});

        if (data && data.length > 0) {
          setProjectName(data[0].pname); // pname 가져오기
        } else {
          setProjectName('프로젝트 이름을 가져오지 못했습니다.');
        };

      } catch (error) {
        console.error('프로젝트 데이터를 가져오는 중 에러 발생:', error);
        setProjectName('프로젝트 이름을 가져오지 못했습니다.');
      };
    };

    // `spaceId`가 존재할 때만 호출
    if (spaceId) {
      fetchProjectName();
    }
  }, [spaceId, projectId, headers]);

  // 객체 기반 issue 스테이트 작성 (임시)
  const [issue, setIssue] = useState<Issue>({
    title: '',
    detail: '',
    type: 'process',
    status: 'backlog',
    sprint_id: null,
    project_id: projectId,
    manager: null,
    created_by: null,
    file: null,
    priority: 'normal',
  });
  
  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
  
    const fileArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...fileArray]) // 선택된 파일 저장
  
    // 미리보기 URL 생성
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]); // 미리보기 상태 업데이트
  };

  // 파일 선택 해제
  const handleFileDelete = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 공통 핸들러
  const handleValueChange = (key: keyof Issue, value: any) => {
    setIssue((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // 파일 데이터 업로드 준비
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    
    props.onSubmit(issue, selectedFiles);
    setIssue({
      title: '',
      detail: '',
      type: 'process',
      status: 'backlog',
      sprint_id: null,
      project_id: projectId,
      manager: null,
      created_by: null,
      file: null,
      priority: 'normal',
    });
    setSelectedFiles([]);
    setPreviews([]); // 미리보기 초기화
  };

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
                  <option value="process">작업</option>
                  <option value="bug">버그</option>
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
                  <option value="backlog">백로그</option>
                  <option value="working">작업중</option>
                  <option value="dev">개발완료</option>
                  <option value="QA">QA완료</option>
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
                  <option value="high">높음</option>
                  <option value="normal">보통</option>
                  <option value="low">낮음</option>
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
            <button type="button" onClick={props.onClose}>취소</button>
            <button type="submit">생성</button>
          </div>
        </form>
    </div>
  </CreateIssueModalWrap>
);
};