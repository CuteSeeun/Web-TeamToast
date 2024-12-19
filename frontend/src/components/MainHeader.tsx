//세 가지의 헤더를 포함하고 있는 파일.

import React, { } from 'react';
import ProjectHeader from './ProjectHeader';
import IntroHeader from '../pages/Intro/IntroHeader';
import LogoHeader from './LogoHeader';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const {pathname} =location;

    // 인트로헤더 요금 로그인 회원가입 있는헤더
    const showIntro = ['/','/price', '/rate','/login','/join','/space','/profile','/pass'].includes(pathname);


    return (
        <div>
            {showIntro && <IntroHeader/>}
            {!showIntro && <ProjectHeader/>}

        </div>
    );
};

export default Header;