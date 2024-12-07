// recoil/atoms/teamAtoms.ts
import { atom } from "recoil";

export const teamMembersState = atom({
  key: "teamMembersState",
  default: [], // 초기값: 빈 배열
});
