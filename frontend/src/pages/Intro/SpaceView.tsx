import React, { useEffect, useState } from 'react';
import AccessToken from '../Login/AccessToken';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import axios from 'axios';
import { SpaceViewWrap } from './introStyle';
import SpaceModal from '../SpaceList/SpaceModal';
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

const SpaceView: React.FC<SpaceViewProps> = ({onClose}) => {
    const user = useRecoilValue(userState); // 현재 유저 정보
    const [spaces, setSpaces] = useState<SpaceItem[]>([]); // 스페이스 리스트
    const [showModal, setShowModal] = useState(false); // 모달 상태
    const [error, setError] = useState<string>(''); // 에러 메시지
    const navigate = useNavigate();

    // API: 스페이스 목록 가져오기
    const fetchSpaces = async () => {
        try {
            const response = await AccessToken.get('/space/my-spaces');
            setSpaces(response.data.space || []);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                alert('로그인 세션이 만료되었습니다.');
                localStorage.removeItem('accessToken');
                navigate('/login');
            } else {
                console.error('스페이스 정보 조회 실패:', err);
                setError('스페이스 정보를 불러오는 데 실패했습니다.');
            }
        }
    };

    // API: 스페이스 선택
    const handleSelectSpace = async (spaceId: string) => {
        try {
            await AccessToken.post('/space/select-space', { spaceId });
            await sessionStorage.setItem('sid',spaceId);
            const selectSpace = spaces.find(space=>space.spaceId === spaceId);
            if(selectSpace){
               await sessionStorage.setItem('userRole',selectSpace.role);
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
    const handleCreateSpace = async (spaceName: string): Promise<void> => {
        try {
            const response = await AccessToken.post('/space/create', {
                sname: spaceName,
                uname: user?.uname,
            });
            const newSpace = {
                spaceId: response.data.spaceId,
                spaceName: spaceName,
                role: 'top_manager',
            };
            setSpaces((prev) => [...prev, newSpace]);
            alert('스페이스가 생성되었습니다.');
        } catch (err) {
            console.error('스페이스 생성 오류:', err);
            alert('스페이스 생성에 실패했습니다.');
        }
    };

    // 초기 데이터 로드
    useEffect(() => {
        fetchSpaces();
    }, []);

    return (
        <SpaceViewWrap>
        {/* 헤더 */}
        <div className="space-header">
            <h2>스페이스</h2>
            <button className="create-btn" onClick={() => setShowModal(true)}>
                + 새 스페이스 생성
            </button>
        </div>

        {/* 스페이스 목록 */}
        <div className="space-list">
            {spaces.length === 0 ? (
                <p className="centered-message">스페이스가 없습니다.</p>
            ) : (
                spaces.map((space, idx) => (
                    <Link to={`/projectlist/${space.spaceId}`}
                    onClick={() => handleSelectSpace(space.spaceId)}
                        key={space.spaceId}
                        className="space-item"
                        >
                        <div
                            className="color-box"
                            style={{ backgroundColor: PASTEL_COLORS[idx % PASTEL_COLORS.length] }}
                            />
                        <h3>{space.spaceName}</h3>
                            </Link>
                ))
            )}
        </div>

        {/* 모달 */}
        {showModal && (
            <SpaceModal
                onClose={() => setShowModal(false)}
                onConfirm={async (spaceName) => {
                    await handleCreateSpace(spaceName); // `await`로 비동기 처리
                    setShowModal(false); // 모달 닫기
                }}
            />
        )}

        {/* 에러 메시지 */}
        {error && <p className="error-message">{error}</p>}
    </SpaceViewWrap>
    );
};

export default SpaceView;