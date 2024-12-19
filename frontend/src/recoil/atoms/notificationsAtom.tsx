import {atom} from 'recoil';

export type Notification = {
    isid: number; // 알림 ID
    createdAt: string; // 생성 시간
    isread: number; // 읽음 상태
    issue_id: number; // 이슈 ID
    manager: string; // 유저 정보
    projectTitle: string; // 프로젝트 이름
    issueTitle: string; // 이슈 제목
    issueDetail: string; // 이슈 상세
    project_id: number; // 프로젝트 IDS
};

export const notificationsAtom = atom<Notification[]>({
    key:'notificationsAtom',
    default:[],
})