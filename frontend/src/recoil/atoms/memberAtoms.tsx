// recoil/atoms/teamAtoms.ts
import { atom } from "recoil";

// export const teamMembersState = atom({
//   key: "teamMembersState",
//   default: [], // 초기값: 빈 배열
// });

// 팀 멤버 인터페이스 정의
export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

// 팀 멤버 상태 정의
export const teamMembersState = atom<TeamMember[]>({
  key: "teamMembersState",
  default: [], // 초기값: 빈 배열
});
