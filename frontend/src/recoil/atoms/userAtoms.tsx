import {atom} from 'recoil';

// interface UserState {
//     id: number | undefined;
//     name: string | undefined;
//     email: string | undefined;
//     userid: string | undefined;
//     token: string | undefined;
//     isLoggedIn: boolean;
// }

// export const userState = atom<UserState>({
export const userState = atom<any>({
    key : 'userState',
    default:{
        id: undefined,
        name: undefined,
        email: undefined,
        userid: undefined,
        token: undefined,
        isLoggedIn: false,
    },
});