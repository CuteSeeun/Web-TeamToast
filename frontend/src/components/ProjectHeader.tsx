//프로젝트 들어간 이후부터 쓰는 헤더

import React, { useEffect, useState, useRef } from 'react';
import { ProjectHeaderWrap, Logo } from '../styles/HeaderStyle';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/atoms/userAtoms';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ReactComponent as LogoIcon } from '../assets/icons/Logo.svg'; // icons 폴더에서 로고 가져옴
import { IoSettingsOutline } from "react-icons/io5";
import PJheaderBell from './PJheaderBell';
import axios from 'axios';
import { teamMembersState } from '../recoil/atoms/memberAtoms';
import { notificationsAtom } from '../recoil/atoms/notificationsAtom';
import styled from 'styled-components';
import { CiSearch } from "react-icons/ci";
import { allIssuesState } from '../recoil/atoms/issueAtoms';

const StyledInput = styled.input`
    width: 400px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    /* background:rgb(166, 220, 220); */
    &:focus {
        border-color: #038C8C; /* 호버 시 테두리 색상 */
        outline: none;
    }
`;
const AutocompleteList = styled.ul`
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 420px;
    max-height: 150px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    /* list-style: none; */
    margin: 0;
    padding: 0;
    z-index: 10;

    li {
        padding: 10px;
        cursor: pointer;
        text-align: left; /* 텍스트 왼쪽 정렬 추가 */

        &:hover {
            background-color: #f5f5f5;
        }
    }
`;


const ProjectHeader = ({
    onFetchTeamMembers,
}: {
    onFetchTeamMembers?: () => void;
}) => {
    const setTeamMembers = useSetRecoilState(teamMembersState);
    const [user, setUser] = useRecoilState(userState);
    const [alarmOnOff, setAlarmOnOff] = useRecoilState(notificationsAtom);
    const [userRole, setUserRole] = useState(sessionStorage.getItem('userRole')); // 초기 로컬에서 가져온 role
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const sid = sessionStorage.getItem('sid');
    const [pid, setPid] = useState<string | null>(null);
    // const pid = sessionStorage.getItem('pid');
    const [searchState, setSearchState] = useState('');
    const allIssues = useRecoilValue(allIssuesState);//모든 이슈 가져오기
    const [filteredIssues, setFilteredIssues] = useState<{ isid: number; title: string }[]>([]); // 검색 결과 상태
    const autocompleteRef = useRef<HTMLDivElement>(null); // AutocompleteList를 참조하기 위한 useRef
    const location = useLocation();

    // 특정 경로에서만 input 활성화
    const showInput = location.pathname.includes('/activesprint') || location.pathname.includes('/backlog') || 
    location.pathname.includes('/chat') ||  location.pathname.includes('/dashboard') || location.pathname.includes('/issuelist') ||
    location.pathname.includes('/issue') || location.pathname.includes('/timeline')

    // 검색 입력 핸들러
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchState(query);

        // 검색어를 기반으로 allIssuesState 필터링
        if (query.trim()) {
            const filtered = allIssues
                .filter((issue) => issue.title.toLowerCase().includes(query.toLowerCase()))
                .map((issue) => ({ isid: issue.isid, title: issue.title })); // 필요한 데이터만 저장
            setFilteredIssues(filtered);
        } else {
            setFilteredIssues([]); // 검색어가 없으면 결과 초기화
        }
    };
    const handleAutocompleteClick = (isid: number) => {
        navigate(`/issue/${isid}`);
        setFilteredIssues([]); // 자동완성 목록 초기화
    };
    const handleClickOutside = (event: MouseEvent) => {
        // 클릭한 요소가 AutocompleteList 영역 외부라면
        if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
            setFilteredIssues([]); // 자동완성 목록 초기화
        }
    };
    useEffect(() => {
        // 외부 클릭 이벤트 등록
        document.addEventListener('mousedown', handleClickOutside);

        // 클린업 함수로 이벤트 제거
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    useEffect(() => {
        if (user?.email) {
            setLoading(false);
            // setTimeout(
            //     setLoading(false)
            // ,1500)
        }
    }, [user])


    const logoutGo = () => {
        const confirmed = window.confirm('로그아웃 하시겠습니까?');
        if (confirmed) {
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
                    params: { spaceId: sid },
                });
                setTeamMembers(response.data); // 팀 멤버 상태 갱신
            } catch (error) {
                console.log("팀원 데이터를 가져오는 중 오류 발생:", error);
            }
        };
        if (!loading) {
            fetchTeamMembers(); // 컴포넌트 로드 시 호출
        }
    }, [sid, setTeamMembers, loading]);

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

    useEffect(() => {

        const fetchNotification = async () => {
            try {
                const response = await axios.get('http://localhost:3001/alarm/notifications', {
                    params: { userEmail: user?.email },
                });
                await setAlarmOnOff(response.data); // 상태 업데이트
            } catch (error) {
                console.error("알림 데이터 가져오기 오류: ", error);
            }
        }
        if (!loading) {
            fetchNotification();
        }
    }, [user, setAlarmOnOff, loading]);

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
                {showInput && (
                    <div style={{ flex: 1, textAlign: 'center', position: 'relative' }} ref={autocompleteRef}>
                        {/* <CiSearch /> */}
                        

                        <StyledInput type='text' value={searchState}
                            onChange={handleSearch}
                            placeholder='모든 이슈를 검색하세요'
                        />
                        {filteredIssues.length > 0 && (
                        <AutocompleteList>
                            {filteredIssues.map((issue) => (
                                <li key={issue.isid} onClick={() => handleAutocompleteClick(issue.isid)}>
                                    {issue.title}
                                </li>
                            ))}
                        </AutocompleteList>
                    )}


                    </div>
                )}


                <div className="rightPro">

                    <div className="Subscription">
                        <span onClick={() => navigate('/payment')}>구독 관리</span>
                    </div>
                    <div className="notification-icon">
                        <PJheaderBell />
                        {alarmOnOff.length > 0 && (
                            <span className="notification-badge"></span> // 알림 배지
                        )}
                    </div>
                    <div className="menu-wrap">
                        <IoSettingsOutline className='icon-wrap' style={{ cursor: 'pointer' }} />
                        <ul className="sub-menu">
                            {!Admin ? (
                                <li onClick={() => navigate('/spacemanagement')}>
                                    스페이스관리
                                </li>
                            ) : (
                                <li
                                    style={{ color: '#999', cursor: 'not-allowed' }}
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