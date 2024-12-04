// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가
// import { ProjectInviteWrap } from "../styles/InviteModal"; // 스타일 파일 유지
// import axios from "axios";

// interface InviteUserModalProps {
//   isOpen: boolean; // 모달 열림 여부
//   spaceId?: number; // 스페이스 ID (옵션으로 설정)
//   onClose: () => void; // 모달 닫기 함수
//   onNavigateToPayment?: () => void; // 결제 페이지 이동 함수 (옵션)
//   refreshTeamList: () => void; // 팀원 목록 새로고침 함수
// }

// const ProjectInvite: React.FC<InviteUserModalProps> = ({
//   isOpen,
//   spaceId = 4, // 기본값으로 임의의 spaceId 설정
//   onClose,
//   refreshTeamList,
// }) => {
//   const [email, setEmail] = useState<string>(""); // 이메일 상태
//   const [role, setRole] = useState<string>("관리자"); // 기본 역할
//   const [message, setMessage] = useState<string>(""); // 성공/실패 메시지
//   const [limit, setLimit] = useState<number | null>(null); // 최대 초대 가능 인원
//   const [remaining, setRemaining] = useState<number | null>(null); // 남은 초대 가능 인원
//   const [loading, setLoading] = useState<boolean>(false); // 로딩 상태

//   const navigate = useNavigate(); // useNavigate 훅 사용

//   // 초대 가능한 인원 정보 가져오기
//   useEffect(() => {
//     if (isOpen && spaceId) {
//       const fetchInviteData = async () => {
//         try {
//           const response = await axios.get(
//             `http://localhost:3001/team/invite/limit?space_id=${spaceId}`
//           );
//           setLimit(response.data.limit); // 최대 초대 가능 인원
//           setRemaining(response.data.remaining); // 남은 초대 가능 인원
//         } catch (error: any) {
//           console.error("Failed to fetch invite data:", error);
//           setLimit(null);
//           setRemaining(null);
//         }
//       };

//       fetchInviteData();
//     }
//   }, [isOpen, spaceId]);

//   const handleInvite = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!spaceId || spaceId <= 0) {
//       setMessage("스페이스 ID가 유효하지 않습니다.");
//       console.error("Invalid Space ID:", spaceId);
//       return;
//     }

//     setLoading(true); // 로딩 시작
//     try {
//       const response = await axios.post("http://localhost:3001/team/invite", {
//         email,
//         space_id: spaceId,
//         role: role === "관리자" ? "manager" : "normal", // 역할 매핑
//       });

//       setMessage(
//         response.data.message || "사용자가 성공적으로 초대되었습니다."
//       );
//       setEmail(""); // 이메일 초기화
//       setRole("관리자"); // 역할 초기화

//       // 초대 성공 후 팀원 목록 새로고침
//       refreshTeamList();

//       // 남은 초대 가능 인원 업데이트
//       const remainingResponse = await axios.get(
//         `http://localhost:3001/team/invite/limit?space_id=${spaceId}`
//       );
//       setLimit(remainingResponse.data.limit);
//       setRemaining(remainingResponse.data.remaining);

//       // 초대 성공 후 모달 닫기
//       onClose();
//     } catch (error: any) {
//       console.error("Invite Error:", error);

//       if (error.response?.status === 403) {
//         setMessage(
//           `현재 초대 가능한 최대 인원은 ${limit}명입니다. 추가 인원 초대를 원하시면 결제를 진행해 주세요.`
//         );
//       } else if (error.response?.status === 404) {
//         setMessage(
//           "초대할 사용자가 아직 TeamToast에 가입하지 않았습니다. 해당 사용자를 초대하려면 TeamToast에 먼저 회원가입을 완료해야 합니다."
//         );
//       } else {
//         setMessage(
//           error.response?.data?.message ||
//             "사용자를 초대하는 데 실패했습니다. 다시 시도해주세요."
//         );
//       }
//     } finally {
//       setLoading(false); // 로딩 종료
//     }
//   };

//   const handleNavigateToPayment = () => {
//     navigate("/payment");
//   };

//   if (!isOpen) return null; // 모달 닫혀 있으면 렌더링 안 함

//   const isInviteFull = remaining === 0; // 초대 가능한 인원이 다 찬 경우

//   return (
//     <ProjectInviteWrap>
//       <div className="modal-content">
//         <h3>사용자 초대</h3>
//         <form onSubmit={handleInvite}>
//           <div className="input-group">
//             <label>사용자 이메일</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="이메일을 입력해 주세요."
//               disabled={isInviteFull} // 초대 인원이 다 찬 경우 비활성화
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>권한</label>
//             <div className="select-wrapper">
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 disabled={isInviteFull} // 초대 인원이 다 찬 경우 비활성화
//               >
//                 <option value="관리자">관리자</option>
//                 <option value="멤버">멤버</option>
//               </select>
//             </div>
//           </div>
//           {isInviteFull && (
//             <p className="message">
//               현재 초대 가능한 최대 인원은 {limit}명입니다.
//               <br />
//               추가 인원 초대를 원하시면 결제를 진행해 주세요.
//             </p>
//           )}
//           <div className="button-group">
//             {isInviteFull ? (
//               <>
//                 <button
//                   type="button"
//                   className="cancel"
//                   onClick={handleNavigateToPayment}
//                 >
//                   결제 페이지로 이동
//                 </button>
//                 <button type="button" className="cancel" onClick={onClose}>
//                   취소
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button type="button" className="cancel" onClick={onClose}>
//                   취소
//                 </button>
//                 <button
//                   type="submit"
//                   className="invite"
//                   disabled={loading || isInviteFull}
//                 >
//                   {loading ? "초대 중..." : "초대"}
//                 </button>
//               </>
//             )}
//           </div>
//         </form>
//       </div>
//     </ProjectInviteWrap>
//   );
// };

// export default ProjectInvite;
