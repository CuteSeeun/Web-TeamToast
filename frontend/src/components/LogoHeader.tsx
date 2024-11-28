//스페이스, 로그인, 회원가입에 나오는 헤더

import React from 'react';
import { Link } from 'react-router-dom';
import { LogoHeaderWrap } from '../styles/HeaderStyle';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/atoms/userAtoms';
import { ReactComponent as LogoIcon } from '../assets/icons/Logo.svg';

const LogoHeader = () => {

    const user = useRecoilValue(userState);


    return (
        <LogoHeaderWrap>
            <div className='logoArea'>
                {user ? (
                        <>
               <Link to="/space">
               <LogoIcon />
               </Link>
                        </>
                ):(
                        <>
               <Link to="/">
               <LogoIcon />
               </Link>
                        </>
                )
            }
           </div>
        </LogoHeaderWrap>
    );
};

export default LogoHeader;