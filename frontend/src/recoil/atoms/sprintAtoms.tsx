import { atom } from 'recoil';

// 스프린트 상태 ENUM 타입 정의
type SprintStatus = 'disabled' | 'enabled' | 'end';

interface Sprint {
    spid: number;
    spname: string;
    status: SprintStatus;
    goal: string;
    enddate: string;
    startdate: string;
    project_id: number;
}

export const sprintState = atom<Sprint[]>({
    key: 'sprintState',
    default: []
});
