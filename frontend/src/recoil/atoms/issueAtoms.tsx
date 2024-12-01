// 2024-11-27 한채경
// issueAtoms.tsx
import { atom } from "recoil";
import { Issue } from "../../types/issueTypes";

export const issueListState = atom<Issue[]> ({
  key: 'issueListState',
  default: []
});