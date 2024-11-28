// 2024-11-25 한채경 수정
// ProjectHeader.tsx
//프로젝트 들어간 이후부터 쓰는 헤더

import React, { useState } from 'react';
import { ProjectHeaderWrap, Logo } from '../styles/HeaderStyle';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/atoms/userAtoms';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as LogoIcon } from '../assets/icons/Logo.svg'; // icons 폴더에서 로고 가져옴
import { IoSettingsOutline ,IoChevronDownOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import ProjectInvite from './InviteModal';

const ProjectHeader = () => {

    const user = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const navigate = useNavigate();
   
    const logoutGo = () =>{
        const confirmed = window.confirm('로그아웃 하시겠습니까?');
        if(confirmed){
            setUser(null);
            sessionStorage.removeItem('token');
            navigate('/');
            window.location.reload();
        }
    }
     // 관리자 권한 체크 함수
     const isAdmin = user?.role === 'admin';  // 또는 user?.role === 'ADMIN' 등 실제 데이터 구조에 맞게
    
     // 권한 없을 때 처리하는 함수
     const handleUnauthorizedAccess = (e: React.MouseEvent) => {
         e.preventDefault();
         alert('스페이스 관리는 관리자만 접근할 수 있습니다.');
     };
    
    
    return (
        <ProjectHeaderWrap>
             <div className='headerProject'>
                <div className="leftPro">
                   <Link to='/space'><Logo><LogoIcon /></Logo></Link> 
                    <nav>
                        <div className="menu-wrap">
                            <Link to='/projectlist'>
                            <span className="menu-text">프로젝트</span>
                            </Link>
                        </div>
                        <div className="menu-wrap">
                            <span className="menu-text"><span className='text-with-rigth-icon'>팀</span><IoChevronDownOutline /></span>
                            <ul className="sub-menu">
                                <li onClick={() => setIsInviteModalOpen(true)}>사용자 초대</li>
                                <Link to='/team'><li>사용자 목록</li></Link>
                                <Link to='/payment'>
                                <li>결제</li>
                                </Link>
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="rightPro" style={{display:"flex", alignItems:"center"}}>
                    <div className="notification-icon">
                    <GoBell className="icon-wrap" />
                        <span className="notification-badge"></span>
                    </div>
                    <div className="menu-wrap">
                        <IoSettingsOutline className='icon-wrap' />
                        <ul className="sub-menu">
                        {/* {isAdmin ? (
                                <Link to='/spaceedit'>
                                    <li>스페이스관리</li>
                                </Link>
                            ) : (
                                <li 
                                    onClick={handleUnauthorizedAccess}
                                    style={{ 
                                        color: '#999',
                                        cursor: 'not-allowed'
                                    }}
                                >
                                    스페이스관리
                                </li>
                            )} */}
                                <Link to='/spacemanagement'>
                                    <li>스페이스관리</li>
                                </Link>
                            
                        </ul>
                    </div>
                    <div className="menu-wrap">
                        {/* <span className="menu-text">{user.name} </span> */}
                        <div className="user-circle">
                            {user?.uname?.charAt(0)} 
                        </div>
                        <ul className="sub-menu">
                            <Link to='/profile'><li>프로필</li></Link>
                            <li onClick={logoutGo}>로그아웃</li>
                        </ul>
                    </div>
                </div>
            </div>

            <ProjectInvite 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />

        </ProjectHeaderWrap>
    );
};

export default ProjectHeader;