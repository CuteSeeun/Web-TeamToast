import React, { useEffect, useRef, useState } from 'react';
import AccessToken from '../Login/AccessToken';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import axios from 'axios';
import { SpaceViewWrap } from './introStyle';
import { Link, useNavigate } from 'react-router-dom';


interface SpaceItem {
    spaceId: string;
    spaceName: string;
    role: string;
}

interface SpaceViewProps {
    onClose: () => void;
}

const PASTEL_COLORS = [
    '#ff9a9e',
    '#ffd280',
    '#aff1b6',
    '#81deea',
    '#c4b5fd',
];


const SpaceView: React.FC<SpaceViewProps> = () => {
    const user = useRecoilValue(userState); // 현재 유저 정보
    const [spaces, setSpaces] = useState<SpaceItem[]>([]); // 스페이스 리스트
    const [error, setError] = useState<string>(''); // 에러 메시지
    
    // (추가)
    const [newSpaceName , setNewSpaceName] = useState(''); // 새로운 스페이스 이름
    const [showNewSpaceField, setShowNewSpaceField] = useState(false); // 새 필드 표시 여부
    const newSpaceRef = useRef<HTMLDivElement | null>(null);
    
    const navigate = useNavigate();

    // API: 스페이스 목록 가져오기
    useEffect(()=>{
        const fetchSpaces = async () => {
            try {
                const response = await AccessToken.get('/space/my-spaces');
            setSpaces(response.data.space || []);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                alert('로그인 세션이 만료되었습니다.');
                localStorage.clear();
                sessionStorage.clear();
                navigate('/login');
            } else {
                console.error('스페이스 정보 조회 실패:', err);
                setError('스페이스 정보를 불러오는 데 실패했습니다.');
            }
        }
    };
    fetchSpaces();
},[])

    // API: 스페이스 선택
    const handleSelectSpace = async (spaceId: string) => {
        try {
            await AccessToken.post('/space/select-space', { spaceId });
             sessionStorage.setItem('sid',spaceId);
            const selectSpace = spaces.find(space=>space.spaceId === spaceId);
            if(selectSpace){
                sessionStorage.setItem('userRole',selectSpace.role);
              }
              // 스토리지 이벤트 강제 발생
              // 같은 탭에서 동작하게 하려면 수동으로 이벤트를 걸어야한다.
              window.dispatchEvent(new Event('storage'));
              //페이지 이동은 모든 저장 작업이 완료된
              navigate(`/projectlist/${spaceId}`);
        } catch (err) {
            console.error('스페이스 선택 오류:', err);
        }
    };

    // API: 스페이스 생성
    const handleCreateSpace = async (): Promise<void> => {
        try {
            const response = await AccessToken.post('/space/create', {
                sname: newSpaceName,
                uname: user?.uname,
            });
            const newSpace = {
                spaceId: response.data.spaceId,
                spaceName: newSpaceName,
                role: 'top_manager',
            };
            setSpaces((prev) => [...prev, newSpace]);

            // (추가)
            setNewSpaceName(''); // 입력 필드 초기화
            setShowNewSpaceField(false); // 필드 숨기기

            alert('스페이스가 생성되었습니다.');
        } catch (err) {
            console.error('스페이스 생성 오류:', err);
            alert('스페이스 생성에 실패했습니다.');
        }
    };

    //  입력 창이 열릴 때 자동으로 맨 아래로 스크롤 이동
    // (추가)
    const spaceScrollbottom = () =>{
        setShowNewSpaceField(true);
        setTimeout(()=>{
            if(newSpaceRef.current){
                newSpaceRef.current.scrollIntoView({behavior:'smooth',block:'end'});
                // behavior : 기본값은 auto // smooth를 쓰면서 부드럽게 이동하도록 변경
                // block : end 맨 끝으로 이동 입력 필드가 화면 하단에 위치
            }
        },0);
        //셋타임아웃은 상태 업데이트 후 dom 렌더링 완료를 보장
    }

    return (
        <SpaceViewWrap>
        {/* 헤더 */}
        <div className="space-header">
            <h2>스페이스</h2>
            <button className="create-btn" onClick={spaceScrollbottom}>
                + 새 스페이스 생성
            </button>
        </div>

        {/* 스페이스 목록 */}
        <div className="space-list">
            {spaces.map((space, idx) => (
                    <span onClick={() => handleSelectSpace(space.spaceId)}
                        key={space.spaceId}
                        className="space-item">
                        <div className="color-box"
                            style={{ backgroundColor: PASTEL_COLORS[idx % PASTEL_COLORS.length] }}
                            />
                        <h3>{space.spaceName}</h3>
                    </span>
                ))}

            {/* 새로운 스페이스 추가 필드 */}
            {/* 추가  (스페이스 모달 없애고 생성 스페이스)*/}
            {showNewSpaceField && (
                    <div className="space-item new-space-item" ref={newSpaceRef}>
                        <div className="color-box"
                            style={{
                                backgroundColor:
                                    PASTEL_COLORS[
                                        Math.floor( Math.random() * PASTEL_COLORS.length)
                                    ],
                            }}
                        />
                     <input type="text" placeholder="새 스페이스 이름" value={newSpaceName}
                            onChange={(e) => setNewSpaceName(e.target.value)}
                            className="new-space-input"
                            onKeyDown={(e)=>{
                                if(e.key === 'Enter'){
                                    handleCreateSpace();
                                }
                            }}
                            />

                        <button onClick={handleCreateSpace} className="create-space-btn">
                            생성
                        </button>
                </div>
            )}
        </div>

        {/* 에러 메시지 */}
        {error && <p className="error-message">{error}</p>}
    </SpaceViewWrap>
    );
};

export default SpaceView;