import {atom} from 'recoil';

interface UserState {
    uid: number | null;
    uname: string | null;
    email: string | null;
    // token: string | null | undefined;
    isLoggedIn: boolean;
    // role: 'admin' | 'member' | null; 
}

export const userState = atom<UserState | null>({
    key : 'userState',
    default: null
});