import {atom} from 'recoil';

export const spaceIdState = atom<number | null>({
    key:'spaceId',
    default:null,
});
