// recoil/atoms/selectedChannelAtoms.ts
import { atom } from 'recoil';

// interface Channel {
//     rid: number;
//     rname: string;
//   }

  interface SelectedChannel {
    rid: number;
    rname: string;
    messages: { mid: number; content: string; timestamp: string; user_email: string, user: string }[];
  }

export const selectedChannelAtom = atom<SelectedChannel | null>({
  key: 'selectedChannelAtom',
  default: null, // 기본값: 선택된 채널 없음
});
