// //이슈 생성 모달에서 제출 시 데이터 처리하는 코드

// import { CreateIssueModalWrap, PreviewContainer } from "../styles/CreateIssueModal";
// import React, { useEffect, useState } from "react";
// import { Issue, Type, Status, Priority } from '../recoil/atoms/issueAtoms';
// import { IoChevronDownOutline, IoCloseOutline, IoAddOutline } from "react-icons/io5";
// import { sprintState } from "../recoil/atoms/sprintAtoms";
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { managerAtoms } from '../recoil/atoms/managerAtoms';
// import { teamMembersState } from '../recoil/atoms/memberAtoms';
// import axios from 'axios';

// interface IssueModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     pid: string | null; // pid 추가
// };

// export const CreateIssueModal = (props: IssueModalProps): JSX.Element | null => {
//     const sprints = useRecoilValue(sprintState);
//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [previews, setPreviews] = useState<string[]>([]);
//     const fileInputRef = React.useRef<HTMLInputElement>(null);
//     const { pid, isOpen, onClose } = props; // pid 추출
//     const setManager = useSetRecoilState(managerAtoms);//담당자 아톰 상태 업데이트 함수
//     const teamMembers = useRecoilValue(teamMembersState);//스페이스 내 멤버 목록

//     // 객체 기반 issue 스테이트 작성 (임시)
//     const [issue, setIssue] = useState<Issue>({
//         isid: 0, // 초기값 설정
//         sprint_id: null, // null로 초기화
//         title: '',
//         detail: '',
//         type: Type.process,
//         status: Status.Backlog,
//         project_id: pid ? parseInt(pid) : 0,
//         manager: null,
//         created_by: null,
//         file: [],
//         priority: Priority.normal,
//     });

//     // 파일 선택 핸들러
//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files;
//         if (!files) return;

//         const fileArray = Array.from(files);
//         console.log("새로 선택된 파일:", fileArray);

//         // 기존 선택된 파일과 합쳐 중복 검사
//         const previousFiles = [...selectedFiles]; // 기존 선택된 파일
//         const duplicatedFiles = fileArray.filter((file) =>
//             previousFiles.some(
//                 (selectedFile) =>
//                     selectedFile.name === file.name &&
//                     selectedFile.size === file.size &&
//                     selectedFile.lastModified === file.lastModified
//             )
//         );

//         if (duplicatedFiles.length > 0) {
//             alert("중복된 파일은 업로드할 수 없습니다.");
//             return;
//         };

//         // 중복을 제외한 파일만 추가
//         const uniqueFiles = fileArray.filter(
//             (file) =>
//                 !previousFiles.some(
//                     (selectedFile) =>
//                         selectedFile.name === file.name &&
//                         selectedFile.size === file.size &&
//                         selectedFile.lastModified === file.lastModified
//                 )
//         );

//         console.log("중복 제외 후 추가할 파일:", uniqueFiles);

//         setSelectedFiles((prev) => [...prev, ...uniqueFiles]); // 선택된 파일 저장

//         // 미리보기 URL 생성
//         const newPreviews = uniqueFiles.map((file) => URL.createObjectURL(file));
//         setPreviews((prev) => [...prev, ...newPreviews]); // 미리보기 상태 업데이트

//         // 파일 입력 필드 초기화
//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         };
//     };

//     // 파일 선택 해제
//     const handleFileDelete = (index: number) => {
//         setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//         setPreviews((prev) => prev.filter((_, i) => i !== index));

//         // input 초기화
//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         };
//     };

//     // 공통 핸들러
//     const handleValueChange = (key: keyof Issue, value: any) => {
//         // setIssue((prev) => ({ ...prev, [key]: value }));
//         // manager 또는 created_by 선택 시 email 값을 설정
//         if (key === "manager" || key === "created_by") {
//             const selectedMember = teamMembers.find((member) => member.name === value);
//             if (selectedMember) {
//                 setIssue((prev) => ({ ...prev, [key]: selectedMember.email })); // email 저장
//             }
//         } else {
//             setIssue((prev) => ({ ...prev, [key]: value }));
//         }
//     };

//     //제출 버튼 누르면 호출, 최종 데이터 처리
//     const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//         e.preventDefault();
//         const formData = new FormData();// 파일 데이터 업로드 준비
//         selectedFiles.forEach((file) => formData.append("files", file));

//         const fileNames = selectedFiles.map((file) => file.name);// 파일 이름 배열 생성

//         if ([(issue.title || '').trim(), issue.type, issue.status, issue.project_id, issue.priority].some((field) => !field)) {
//             alert('필수 데이터가 누락되었습니다.');
//             return;
//         }

//         const updatedIssue: Issue = {
//             ...issue,
//             isid: issue.isid || 0, // 기본값 추가
//             sprint_id: issue.sprint_id || null, // null 허용
//             file: selectedFiles.map((file) => file.name), // string[]로 변환
//             // file: fileNames,
//         };

//         try {
//             // `manager` 값이 존재하면 managerAtoms에 저장
//             if (updatedIssue.manager) {
//                 setManager(updatedIssue.manager);
//                 console.log('업데이트된 담당자 아톰:', setManager);
//             }

//             // Issue 데이터 전송
//             const issueResponse = await axios.post(`http://localhost:3001/issues/new/${pid}`, issue);
//             const newIssue: Issue = issueResponse.data;

//             // 파일 업로드 처리
//             if (selectedFiles.length > 0) {
//                 await axios.post(
//                     'http://localhost:3001/upload/upload', formData,
//                     { headers: { 'Content-Type': 'multipart/form-data' } }
//                 );
//             }

//             console.log('이슈 생성 성공:', newIssue);
//             if (newIssue.manager) {
//                 setManager(newIssue.manager); // 담당자 업데이트

//                 // 알림 추가
//                 const newNotification = {
//                     isid: newIssue.isid,
//                     type: 'new',
//                     projectTitle:`프로젝트 ID ${newIssue.project_id}`, // 예시
//                     issueTitle: newIssue.title,
//                     manager: newIssue.manager,
//                     project_id:newIssue.project_id,
//                     issueDetail:newIssue.detail || '',
//                 };
//                 // setNotifications((prev) => [...prev, newNotification]); // 알림 배열에 추가

//             }

//             // 상태 초기화
//             setIssue({
//                 isid: 0, sprint_id: null,
//                 title: '', detail: '', type: Type.process,
//                 status: Status.Backlog, project_id: pid ? parseInt(pid) : 0,
//                 manager: null, created_by: null, file: [],
//                 priority: Priority.normal,
//             });
//             setSelectedFiles([]);
//             setPreviews([]); // 미리보기 초기화
//             onClose(); // 모달 닫기
//         } catch (err) {
//             console.error('이슈 생성 실패:', err);
//         }
//     };

//     const handleFileReset = () => {
//         setSelectedFiles([]);
//         setPreviews([]);
//     }

//     // 메모리 누수 방지
//     useEffect(() => {
//         return () => {
//             previews.forEach((preview) => URL.revokeObjectURL(preview));
//         };
//     }, [previews]);

//     if (!isOpen) return null;

//     return (
//         <CreateIssueModalWrap>
//             <div className="modal" onClick={(e) => e.stopPropagation()}>
//                 <h3>이슈 생성</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className="bodycontent">
//                         <div className="input-group">
//                             <label>프로젝트 이름</label>
//                             <input type="text" value={pid || ''} className="disabled" />
//                         </div>
//                         <div className="input-group">
//                             <label>스프린트를 선택해주세요</label>
//                             <div className="select-container sprint-select">
//                                 <select name="sprint_id"
//                                     value={issue.sprint_id || ''}
//                                     onChange={(e) => handleValueChange('sprint_id', parseInt(e.target.value))}
//                                 >
//                                     <option value="" disabled> 해당 스프린트를 선택</option>
//                                     {sprints.map((sprint) => (
//                                         <option key={sprint.spid} value={sprint.spid}>{sprint.spname}</option>
//                                     ))}
//                                 </select>
//                                 <IoChevronDownOutline className="downIcon" />
//                             </div>
//                         </div>
//                         <div className="input-group">
//                             <label>제목</label>
//                             <input type="text" value={issue.title}
//                                 onChange={(e) => handleValueChange('title', e.target.value)}
//                                 placeholder="이슈 제목을 입력해 주세요."
//                             />
//                         </div>
//                         <div className="select-group">
//                             <div className="input-group">
//                                 <label>유형</label>
//                                 <div className="select-container">
//                                     <select name="type" value={issue.type}
//                                         onChange={(e) => handleValueChange('type', e.target.value)}
//                                     >
//                                         <option value={Type.process}>작업</option>
//                                         <option value={Type.bug}>버그</option>
//                                     </select>
//                                     <IoChevronDownOutline className="downIcon" />
//                                 </div>

//                             </div>
//                             <div className="input-group">
//                                 <label>상태</label>
//                                 <div className="select-container">
//                                     <select name="status" value={issue.status}
//                                         onChange={(e) => handleValueChange('status', e.target.value)}
//                                     >
//                                         <option value={Status.Backlog}>백로그</option>
//                                         <option value={Status.Working}>작업중</option>
//                                         <option value={Status.Dev}>개발완료</option>
//                                         <option value={Status.QA}>QA완료</option>
//                                     </select>
//                                     <IoChevronDownOutline className="downIcon" />
//                                 </div>
//                             </div>
//                             <div className="input-group">
//                                 <label>우선순위</label>
//                                 <div className="select-container">
//                                     <select name="priority" value={issue.priority}
//                                         onChange={(e) => handleValueChange('priority', e.target.value)}
//                                     >
//                                         <option value={Priority.high}>높음</option>
//                                         <option value={Priority.normal}>보통</option>
//                                         <option value={Priority.low}>낮음</option>
//                                     </select>
//                                     <IoChevronDownOutline className="downIcon" />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="input-group">
//                             <label>설명</label>
//                             <input type="text" value={issue.detail || ''}
//                                 onChange={(e) => handleValueChange('detail', e.target.value)}
//                                 placeholder="이슈 설명을 입력해 주세요."
//                             />
//                         </div>
//                         <div className="select-group">
//                             <div className="input-group">
//                                 <label>보고자</label>
//                                 <div className="select-container">
//                                     <select
//                                         name="created_by"
//                                         value={issue.created_by || ''}
//                                         onChange={(e) => handleValueChange('created_by', e.target.value)}
//                                     >
//                                         <option value="" disabled>필수 선택</option>

//                                         {teamMembers.length > 0 ? (
//                                             teamMembers.map((member) => (
//                                                 <option key={member.id} value={member.name}>
//                                                     {member.name}
//                                                 </option>
//                                             ))
//                                         ) : (
//                                             <option value="" disabled>
//                                                 프로젝트 내 팀원이 없습니다
//                                             </option>
//                                         )}

//                                     </select>
//                                     <IoChevronDownOutline className="downIcon" />
//                                 </div>
//                             </div>
//                             <div className="input-group">
//                                 <label>담당자</label>
//                                 <div className="select-container">
//                                     <select
//                                         name="manager"
//                                         value={issue.manager || ''}
//                                         onChange={(e) => handleValueChange('manager', e.target.value)}
//                                     >

//                                         <option value="" disabled>미지정</option>
//                                         {teamMembers.length > 0 ? (
//                                             teamMembers.map((member) => (
//                                                 <option key={member.id} value={member.name}>
//                                                     {member.name}
//                                                 </option>
//                                             ))
//                                         ) : (
//                                             <option value="" disabled>팀원이 없습니다</option>
//                                         )}

//                                     </select>
//                                     <IoChevronDownOutline className="downIcon" />
//                                 </div>
//                             </div>
//                         </div>
//                         {/* 파일 업로드 입력 */}
//                         <div className="input-group">
//                             <label>파일 등록</label>
//                             <PreviewContainer>
//                                 {/* 커스텀 파일 추가 버튼 */}
//                                 <label htmlFor="file-input" className="custom-file-button">
//                                     <IoAddOutline className="file-btn" />
//                                 </label>

//                                 {/* 숨겨진 파일 입력 */}
//                                 <input
//                                     type="file"
//                                     id="file-input"
//                                     name="filename"
//                                     multiple
//                                     onChange={handleFileChange}
//                                     ref={fileInputRef}
//                                     style={{ display: "none" }}
//                                 />

//                                 {/* 파일 미리보기 영역 */}
//                                 {previews.map((src, index) => (
//                                     <div
//                                         className="preview-wrap"
//                                         key={index}
//                                         onClick={() => handleFileDelete(index)}
//                                     >
//                                         <div className="img-wrap"><img src={src} alt={`Preview ${index}`} /></div>
//                                         <IoCloseOutline className="file-btn" />
//                                         <p className="file-name">{selectedFiles[index]?.name}</p>
//                                     </div>
//                                 ))}
//                             </PreviewContainer>
//                         </div>
//                         <div className="button-group">
//                             <button type="button"
//                                 onClick={() => { handleFileReset(); onClose(); }}>취소</button>
//                             <button type="submit">생성</button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </CreateIssueModalWrap>
//     );
// };

// export default CreateIssueModal;






//이슈 생성 모달에서 제출 시 데이터 처리하는 코드

import { CreateIssueModalWrap, PreviewContainer } from "../styles/CreateIssueModal";
import React, { useEffect, useState } from "react";
import { Issue, Type, Status, Priority } from '../recoil/atoms/issueAtoms';
import { IoChevronDownOutline, IoCloseOutline, IoAddOutline } from "react-icons/io5";
import { sprintState } from "../recoil/atoms/sprintAtoms";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { teamMembersState } from '../recoil/atoms/memberAtoms';
import axios from 'axios';
import { notificationsAtom } from "../recoil/atoms/notificationsAtom";
import noImagePath from '../assets/images/noImage.png';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  pid: string | null; // pid 추가
};

export const CreateIssueModal = (props: IssueModalProps): JSX.Element | null => {
  const sprints = useRecoilValue(sprintState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ type: string; url: string }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { pid, isOpen, onClose } = props; // pid 추출
   
  // const setManager = useSetRecoilState(managerAtoms);//담당자 아톰 상태 업데이트 함수
  const setNotifications = useSetRecoilState(notificationsAtom); // 알림 업데이트

  const teamMembers = useRecoilValue(teamMembersState);//스페이스 내 멤버 목록

  // 객체 기반 issue 스테이트 작성 (임시)
  const [issue, setIssue] = useState<Issue>({
    isid: 0, // 초기값 설정
    sprint_id: null, // null로 초기화
    title: '',
    detail: '',
    type: Type.process,
    status: Status.Backlog,
    project_id: pid ? parseInt(pid) : 0,
    manager: null,
    created_by: null,
    file: '',
    priority: Priority.normal,
  });

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    console.log("새로 선택된 파일:", fileArray);

    // 중복되지 않은 파일만 필터링
    const uniqueFiles = fileArray.filter(
      (file) =>
      !selectedFiles.some(
        (selectedFile) =>
        selectedFile.name === file.name &&
        selectedFile.size === file.size &&
        selectedFile.lastModified === file.lastModified
      )
    );

    // 중복된 파일이 있는 경우 알림 표시
    if (uniqueFiles.length < fileArray.length) {
      alert('중복된 파일은 업로드할 수 없습니다.');
    }
    console.log("중복 제외 후 추가할 파일:", uniqueFiles);

    setSelectedFiles((prev) => [...prev, ...uniqueFiles]); // 선택된 파일 저장

        // 미리보기 URL 생성
        const maxFileSize = 50 * 1024 * 1024; // 50MB
        const newPreviews = uniqueFiles.map((file) => {
            const isImage = file.type.startsWith('image/');
            const isLargeFile = file.size > maxFileSize;
        
            if (isLargeFile) {
                return { type: 'default', url: noImagePath };
            }
        
            if (isImage) {
                return { type: 'image', url: URL.createObjectURL(file) };
            } else {
                return { type: 'default', url: noImagePath };
            }
        });
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
    // setIssue((prev) => ({ ...prev, [key]: value }));
    // manager 또는 created_by 선택 시 email 값을 설정
    if (key === "manager" || key === "created_by") {
      const selectedMember = teamMembers.find((member) => member.name === value);
      if (selectedMember) {
        setIssue((prev) => ({ ...prev, [key]: selectedMember.email })); // email 저장
      }
    } else {
      setIssue((prev) => ({ ...prev, [key]: value }));
    }
  };

  //제출 버튼 누르면 호출, 최종 데이터 처리
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const formData = new FormData();// 파일 데이터 업로드 준비
    selectedFiles.forEach((file) => formData.append("files", file));


    if ([(issue.title || '').trim(), issue.type, issue.status, issue.project_id, issue.priority].some((field) => !field)) {
      alert('필수 데이터가 누락되었습니다.');
      return;
    }

    interface UploadedFile {
      originalFilename: string;
      previewUrl: string;
      key: string;
    }
    let uploadedFiles: UploadedFile[] = [];
    // let uploadedFiles: FileObject[] = [];
    try {

      // 파일 업로드 처리
      if (selectedFiles.length > 0) {
        const response = await axios.post(
          'http://localhost:3001/upload/upload', formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        if (response.data.success) {
          uploadedFiles = response.data.files as UploadedFile[];
          console.log('파일 업로드 성공:', uploadedFiles);

          // 업로드된 파일 정보를 UI에 반영
          uploadedFiles.forEach(file => {
            console.log('파일 이름:', file.originalFilename);
            console.log('미리보기 URL:', file.previewUrl);
            console.log('S3 키:', file.key);
          });
        } else {
          console.error('파일 업로드 실패:', response.data.message);
          return;
        };
      };

      // 파일 정보 처리
      const updatedIssueFiles = uploadedFiles.length > 0
        ? uploadedFiles.map((file) => ({
          originalFilename: file.originalFilename,
          previewUrl: file.previewUrl,
          key: file.key,
        }))
      : []; // 빈 배열로 처리
      console.log(updatedIssueFiles);
    
      // 보낼 issue 객체에 file 정보 갱신
      const updatedIssue: Issue = {
        ...issue,
        isid: issue.isid || 0, // 기본값 추가
        sprint_id: issue.sprint_id || null, // null 허용
        file: JSON.stringify(updatedIssueFiles),
        // file: uploadedFiles,
      };

      // `manager` 값이 존재하면 managerAtoms에 저장
      

      // Issue 데이터 전송
      const issueResponse = await axios.post(`http://localhost:3001/issues/new/${pid}`, updatedIssue);
      const newIssue: Issue = issueResponse.data;


      console.log('이슈 생성 성공:', newIssue);
      if (newIssue.manager) {

        // 알림 추가
        const newNotification = {
          isid: newIssue.isid,
          type: 'new',
          projectTitle:`프로젝트 ID ${newIssue.project_id}`, // 예시
          issueTitle: newIssue.title,
          manager: newIssue.manager,
          project_id:newIssue.project_id,
          issueDetail:newIssue.detail || '',
        };
        setNotifications((prev) => [...prev, newNotification]); // 알림 배열에 추가
      }

      // 상태 초기화
      setIssue({
        isid: 0, sprint_id: null,
        title: '', detail: '', type: Type.process,
        status: Status.Backlog, project_id: pid ? parseInt(pid) : 0,
        manager: null, created_by: null, file: '',
        priority: Priority.normal,
      });
      setSelectedFiles([]);
      setPreviews([]); // 미리보기 초기화
      onClose(); // 모달 닫기
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
      previews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  if (!isOpen) return null;

return (
  <CreateIssueModalWrap>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h3>이슈 생성</h3>
      <form onSubmit={handleSubmit}>
        <div className="bodycontent">
          <div className="input-group">
            <label>프로젝트 이름</label>
            <input type="text" value={pid || ''} className="disabled" />
          </div>
          <div className="input-group">
            <label>스프린트를 선택해주세요</label>
            <div className="select-container sprint-select">
              <select name="sprint_id"
                value={issue.sprint_id || ''}
                onChange={(e) => handleValueChange('sprint_id', parseInt(e.target.value))}
                >
                <option value="" disabled> 해당 스프린트를 선택</option>
                {sprints.map((sprint) => (
                <option key={sprint.spid} value={sprint.spid}>{sprint.spname}</option>
                ))}
              </select>
              <IoChevronDownOutline className="downIcon" />
            </div>
          </div>
          <div className="input-group">
            <label>제목</label>
            <input type="text" value={issue.title}
              onChange={(e) => handleValueChange('title', e.target.value)}
              placeholder="이슈 제목을 입력해 주세요."
            />
          </div>
          <div className="select-group">
            <div className="input-group">
              <label>유형</label>
              <div className="select-container">
                <select name="type" value={issue.type}
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
                <select name="status" value={issue.status}
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
                <select name="priority" value={issue.priority}
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
            <input type="text" value={issue.detail || ''}
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
                  <option value="" disabled>미지정</option>
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      프로젝트 내 팀원이 없습니다
                    </option>
                  )}
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
                  <option value="" disabled>미지정</option>
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>팀원이 없습니다</option>
                  )}
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
              {previews.map(({ type, url }, index) => (
                <div
                  className="preview-wrap"
                  key={`${selectedFiles[index]?.name}_${selectedFiles[index]?.lastModified}_${selectedFiles[index]?.size}`}
                  onClick={() => handleFileDelete(index)}
                  >
                  <div className="img-wrap"><img src={url} alt={`Preview ${index}`} /></div>
                  <IoCloseOutline className="file-btn" />
                  <p className="file-name">{selectedFiles[index]?.name}</p>
                </div>
              ))}
            </PreviewContainer>
          </div>
          <div className="button-group">
            <button type="button"
              onClick={() => { handleFileReset(); onClose(); }}>취소</button>
            <button type="submit">생성</button>
          </div>
        </div>
      </form>
    </div>
  </CreateIssueModalWrap>
  );
};

export default CreateIssueModal;