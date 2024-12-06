// 2024-11-25 한채경 수정
// ProjectHeader.tsx
//프로젝트 들어간 이후부터 쓰는 헤더

import React, { useEffect, useState } from 'react';
import { ProjectHeaderWrap, Logo } from '../styles/HeaderStyle';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/atoms/userAtoms';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as LogoIcon } from '../assets/icons/Logo.svg'; // icons 폴더에서 로고 가져옴
import { IoSettingsOutline } from "react-icons/io5";
import { spaceIdState } from '../recoil/atoms/spaceAtoms';
import AccessToken from '../pages/Login/AccessToken';
import PJheaderBell from './PJheaderBell';

const ProjectHeader = () => {
    const user = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const space = useRecoilValue(spaceIdState);
    // const setSpaceId = useSetRecoilState(spaceIdState); // 안쓰지만 일단 넣었음 *
    const [userRole,setUserRole] = useState(localStorage.getItem('userRole')); // 초기 로컬에서 가져온 role
    const navigate = useNavigate();
   
    const logoutGo = () =>{
        const confirmed = window.confirm('로그아웃 하시겠습니까?');
        if(confirmed){
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('currentSpaceUuid');
            localStorage.removeItem('userRole');
            setUserRole(null);
            navigate('/');
        }
    }

    useEffect(()=>{
        console.log('프로젝트헤더 스페이스값',space);
    },[])

    // useEffect(() => {
    //     const currentSpace = async () => {
    //       try {
    //         const storedUuid = localStorage.getItem('currentSpaceUuid');
    //         if (storedUuid) {
    //           // Recoil 상태에 저장
    //           setSpaceId(storedUuid);
    //         } else {
    //           const response = await AccessToken.get('/space/current-space');
    //           if (response.data.spaceId) {
    //             setSpaceId(response.data.spaceId);
    //             localStorage.setItem('currentSpaceUuid', response.data.uuid); // UUID 저장
    //           } else {
    //             console.warn('현재 선택된 스페이스가 없습니다.');
    //           }
    //         }
    //       } catch (error) {
    //         console.error('현재 스페이스 복구 실패:', error);
    //       }
    //     };
    //     currentSpace();
    //   }, [setSpaceId]);

      useEffect(() => {
        const syncRole = () => {
          const role = localStorage.getItem('userRole');
          setUserRole(role);
        };
        // storage 이벤트 감지
        window.addEventListener('storage', syncRole);
        // 초기 로드 시 동기화
        syncRole();
        return () => {
          window.removeEventListener('storage', syncRole);
        };
      }, []);


     // 유저롤 권한 체크
     const Admin = userRole === 'normal';

     const handleProjectGo = async () => {
        const currentSpaceUuid = localStorage.getItem('currentSpaceUuid');
        if (!currentSpaceUuid) {
            console.error('현재 선택된 스페이스가 없습니다.');
            navigate('/space');
            return;
        }
        try {
            // uuid로 해당 스페이스의 정보를 가져옴
            const response = await AccessToken.get(`/space/get-space/${currentSpaceUuid}`);
            if (response.data && response.data.spaceId) {
                // spaceId를 이용해서 프로젝트 리스트 페이지로 이동
                navigate(`/projectlist/${response.data.spaceId}`);
            } else {
                console.error('스페이스 정보를 찾을 수 없습니다.');
                navigate('/space');
            }
        } catch (error) {
            console.error('스페이스 정보 조회 실패:', error);
            navigate('/space');
        }
    };


    
    return (
        <ProjectHeaderWrap>
             <div className='headerProject'>
                <div className="leftPro">
                   <Link to='/space'><Logo><LogoIcon /></Logo></Link> 
                    <nav>
                        <div className="menu-wrap">
                            <span className="menu-text" onClick={handleProjectGo}>프로젝트</span>
                        </div>
                        <div className="menu-wrap">
                            <span className="menu-text">
                                <Link to='/team'>
                                    <span className='text-with-rigth-icon'>팀</span>
                                </Link>
                            </span>
                        </div>
                    </nav>
                </div>
                

                <div className="rightPro">

                <div className="Subscription">
                  <span onClick={()=> navigate('/payment')}>구독 관리</span>
                </div>
                    <div className="notification-icon">
                    <PJheaderBell/>
                        <span className="notification-badge"></span>
                    </div>
                    <div className="menu-wrap">
                        <IoSettingsOutline className='icon-wrap' style={{cursor:'pointer'}} />
                        <ul className="sub-menu">
                        {!Admin ? (
                               <li onClick={(e) => {
                                e.preventDefault();
                                const currentRole = localStorage.getItem('userRole');
                                if(currentRole === 'normal') {
                                    alert('관리자만 접근할 수 있습니다.');
                                    return;
                                }
                                navigate('/spacemanagement');
                            }}>
                                스페이스관리
                            </li>
                        ) : (
                            <li 
                                style={{ 
                                    color: '#999',
                                    cursor: 'not-allowed'
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('관리자만 접근할 수 있습니다.');
                                }}
                            >
                                스페이스관리
                            </li>
                        )}
                        </ul>
                    </div>
                    <div className="menu-wrap">
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
        </ProjectHeaderWrap>
    );
};

export default ProjectHeader;