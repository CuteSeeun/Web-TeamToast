// sprintAtoms.tsx
import { atom, selector } from 'recoil';

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

interface Filter {
    manager: string;
    status: string;
    priority: string;
}

export const sprintState = atom<Sprint[]>({
    key: 'sprintState',
    default: []
});

export const filterState = atom<Filter>({
    key: 'filterState',
    default: { manager: '', status: '', priority: '' }
});

export const sortedSprintsState = selector<Sprint[]>({
    key: 'sortedSprintsState',
    get: ({ get }) => {
        const sprints = get(sprintState);
        return sprints.slice().sort((a, b) => {
            if (a.status === 'enabled' && b.status !== 'enabled') return -1;
            if (a.status !== 'enabled' && b.status === 'enabled') return 1;
            return 0;
        });
    }
});