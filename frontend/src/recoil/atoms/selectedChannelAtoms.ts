// recoil/atoms/selectedChannelAtoms.ts
import { atom } from 'recoil';

interface Channel {
    rid: number;
    rname: string;
  }

export const selectedChannelAtom = atom<Channel | null>({
  key: 'selectedChannelAtom',
  default: null, // 기본값: 선택된 채널 없음
});
