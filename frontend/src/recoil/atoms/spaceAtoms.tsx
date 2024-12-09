import {atom} from 'recoil';

export const spaceIdState = atom<string | null>({
    key:'spaceId',
    default:null,
    
});

