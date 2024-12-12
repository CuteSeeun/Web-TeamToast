import {atom} from 'recoil';

export type Notification = {
    isid: number;
    type: 'new' | string;
    projectTitle: string;
    issueTitle: string;
    manager: string;
    project_id:number;
    issueDetail:string;
};

export const notificationsAtom = atom<Notification[]>({
    key:'notificationsAtom',
    default:[],
})