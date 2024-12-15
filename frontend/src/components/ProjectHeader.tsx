// 2024-11-25 한채경 수정
// ProjectHeader.tsx
//프로젝트 들어간 이후부터 쓰는 헤더

import React, { useEffect, useState } from 'react';
import { ProjectHeaderWrap, Logo } from '../styles/HeaderStyle';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/atoms/userAtoms';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as LogoIcon } from '../assets/icons/Logo.svg'; // icons 폴더에서 로고 가져옴
import { IoSettingsOutline } from "react-icons/io5";
import PJheaderBell from './PJheaderBell';
import axios from 'axios';
import { teamMembersState } from '../recoil/atoms/memberAtoms';
import { notificationsAtom } from '../recoil/atoms/notificationsAtom';

const ProjectHeader = ({
    onFetchTeamMembers,
  }: {
    onFetchTeamMembers?: () => void;
  }) => {
    const setTeamMembers = useSetRecoilState(teamMembersState); 
    const [user,setUser] = useRecoilState(userState);
    const [alarmOnOff ,setAlarmOnOff] = useRecoilState(notificationsAtom);
    const [userRole,setUserRole] = useState(sessionStorage.getItem('userRole')); // 초기 로컬에서 가져온 role
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const sid = sessionStorage.getItem('sid');
    const [pid , setPid] = useState(null);
    // const pid = sessionStorage.getItem('pid');
    const [searchState , setSearchState] = useState('');

    // 검색 입력 핸들러
    const handleSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchState(e.target.value);
    }
    // useEffect(() => {
    //     // sessionStorage에서 pid 값 가져오기
    //     const storedPid = sessionStorage.getItem('pid');
    //     setPid(storedPid);
    //   }, []);
    

    useEffect(()=>{
        if(user?.email){
            setLoading(false);
            // setTimeout(
            //     setLoading(false)
            // ,1500)
        }
    },[user])


    const logoutGo = () =>{
        const confirmed = window.confirm('로그아웃 하시겠습니까?');
        if(confirmed){
            localStorage.clear();
            sessionStorage.clear();
            setUser(null);
            setUserRole(null);
            navigate('/');
        }
    };


  // 팀 멤버 데이터를 가져오는 함수
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!sid) {
        console.error("spaceId가 설정되지 않았습니다.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3001/team/members", {
          params: { spaceId : sid },
        });
        setTeamMembers(response.data); // 팀 멤버 상태 갱신
      } catch (error) {
        console.log("팀원 데이터를 가져오는 중 오류 발생:", error);
      }
    };
    if(!loading){
        fetchTeamMembers(); // 컴포넌트 로드 시 호출
    }
  }, [sid, setTeamMembers,loading]);

     useEffect(() => {
       const syncRole = () => {
         const role = sessionStorage.getItem('userRole');
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
        if (!sid) {
            console.error('현재 선택된 스페이스가 없습니다.');
            return;
        }
        try {
            if (sid) {
                // spaceId를 이용해서 프로젝트 리스트 페이지로 이동
                navigate(`/projectlist/${sid}`);
            } else {
                console.error('스페이스 정보를 찾을 수 없습니다.');
                navigate('/');
            }
        } catch (error) {
            console.error('스페이스 정보 조회 실패:', error);
            navigate('/');
        }
    };

    useEffect(()=>{
     
        const fetchNotification = async() =>{
            try {
                const response = await axios.get('http://localhost:3001/alarm/notifications',{
                    params:{userEmail:user?.email},
                });
                await setAlarmOnOff(response.data); // 상태 업데이트
            } catch (error) {
                console.error("알림 데이터 가져오기 오류: ", error);
            }
        }
        if(!loading){
            fetchNotification();
        }
    },[user,setAlarmOnOff,loading]);

    return (
        <ProjectHeaderWrap>
             <div className='headerProject'>
                <div className="leftPro">
                   <Link to='/'><Logo><LogoIcon /></Logo></Link> 
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
                
                {/* 검색 인풋 */}
                {pid && (
                    <div style={{flex:1, textAlign:'center'}}>
                        <input
                        type='text'
                        value={searchState}
                        onChange={handleSearch}
                        placeholder='검색어를 입력하세요'
                        style={{
                            width: '300px',
                            padding: '5px 10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                        />
                    </div>
                )}
                

                <div className="rightPro">

                <div className="Subscription">
                  <span onClick={()=> navigate('/payment')}>구독 관리</span>
                </div>
                    <div className="notification-icon">
                    <PJheaderBell/>
                    {alarmOnOff.length > 0 && (
                      <span className="notification-badge"></span> // 알림 배지
                    )}
                    </div>
                    <div className="menu-wrap">
                        <IoSettingsOutline className='icon-wrap' style={{cursor:'pointer'}} />
                        <ul className="sub-menu">
                        {!Admin ? (
                               <li onClick={()=> navigate('/spacemanagement')}>
                                스페이스관리
                            </li>
                        ) : (
                            <li 
                                style={{  color: '#999', cursor: 'not-allowed' }}
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