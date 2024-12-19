import {atom} from 'recoil';

interface UserState {
    uid: number | undefined;
    uname: string | undefined;
    email: string | undefined;
}

export const userState = atom<UserState | null>({
    key : 'userState',
    default: null
});