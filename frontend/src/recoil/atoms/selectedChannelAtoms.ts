// recoil/atoms/selectedChannelAtoms.ts
import { atom } from 'recoil';

  export interface ChannelState {
    rid: number;
    rname: string;
    messages: { mid: number; content: string; timestamp: string; user_email: string, user: string }[];//기존 메시지
    // newMessages: Array<any>; // 새로운 메시지
    newMessages: { mid: number; content: string; timestamp: string; user_email: string, user: string }[];
  }

export const selectedChannelAtom = atom<ChannelState>({
  key: 'selectedChannelAtom',
  // default: null, // 기본값: 선택된 채널 없음
  default: {
    rid: 0,
    rname: '',
    messages: [], // 기존 메시지는 빈 배열로 초기화
    newMessages: [], // 새로운 메시지도 빈 배열로 초기화
  },
});
