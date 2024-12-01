// recoil/atoms/channelAtoms.ts
import { atom } from 'recoil';

interface Channel {
  rid: number;
  rname: string;
}

export const channelAtom = atom<Channel[]>({
  key: 'channelAtom',
  default: [], // 초기값은 빈 배열
});
