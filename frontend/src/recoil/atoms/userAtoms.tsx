import {atom} from 'recoil';

interface UserState {
    uid: number | undefined;
    uname: string | undefined;
    email: string | undefined;
    // token: string | null | undefined;
    isLoggedIn: boolean;
    // role: 'admin' | 'member' | null; 
}

export const userState = atom<UserState | null>({
    key : 'userState',
    default: null
});