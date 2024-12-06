import React, { useEffect, useState } from 'react';
import { SpaceAllWrap } from '../../components/SpaceStyle';
import { GoPlus } from "react-icons/go";
import SpaceModal from './SpaceModal';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccessToken from '../Login/AccessToken';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import { spaceIdState } from '../../recoil/atoms/spaceAtoms';

interface SpaceItem {
    spaceId : number;
    spaceName:string;
    role:string;
    uuid:string;
}

const PASTEL_COLORS = [
    '#ff9a9e',  // 파스텔 핑크
    '#ffd280',  // 파스텔 옐로우
    '#aff1b6',  // 파스텔 그린
    '#81deea',  // 파스텔 블루
    '#c4b5fd'   // 파스텔 퍼플
];

const SpaceAll:React.FC = () => {

    const [showModal, setShowModal] = useState<boolean>(false);
    const [spaces , setSpaces]=useState<SpaceItem[]>([]);
    const [loading,setLoading] = useState<boolean>(false);
    const [error , setError] = useState<string>('');
    const navgate = useNavigate();
    
    const spaceId = useSetRecoilState(spaceIdState);

    
    
    const userName = useRecoilValue(userState);

    //현재 로그인한 유저 정보
    
    useEffect(() => {
        const fetchSpace = async () => {
            try {
                 // 하나의 API 호출만 유지
                 const response = await AccessToken.get('/space/my-spaces');
                 setSpaces(response.data.space || []);
            } catch (error) {
                console.error('스페이스 정보 조회 실패:', error);
                // 토큰이 만료되었거나 오류가 발생하면 로그인 페이지로
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navgate('/login');
                }
            } 
        };
        fetchSpace();
    }, [navgate]);

  // 선택된 스페이스 저장
    const handleSelectSpace = async(uuid:string) => {
        try {
            await AccessToken.post('/space/select-space',{uuid});
            const selectSpace = spaces.find(space=>space.uuid === uuid);
            if(selectSpace){
                localStorage.setItem('currentSpaceUuid', uuid);
                localStorage.setItem('userRole',selectSpace.role);
                spaceId(String(selectSpace.spaceId)); 
                // 스토리지 이벤트 강제 발생
                // 같은 탭에서 동작하게 하려면 수동으로 이벤트를 걸어야한다.
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            console.error("Error selecting space:", error);
        }
      };

    const RandomColor = (idx : number) =>{
        return PASTEL_COLORS[idx % PASTEL_COLORS.length];
    };
    
    const handleCreateClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirm = async(spaceName:string) => {
        try {
            const response = await AccessToken.post('/space/create', {
                sname: spaceName,
                uname:userName?.uname,
            });
            if (response.data.spaceUuid) {
                setSpaces((prev) => [
                    ...prev,
                    {
                        spaceId: response.data.spaceId,
                        spaceName: spaceName,
                        role: 'top_manager',
                        uuid: response.data.spaceUuid,
                    },
                ]);
                setShowModal(false);
            }
        } catch (error) {
            console.error('스페이스 생성 에러:', error);
            alert('스페이스 생성에 실패했습니다.');
        }
    };

    return (
        <SpaceAllWrap>
            <div className="spaceTop">
              <h2>스페이스</h2>
            <button className="create-btn" onClick={handleCreateClick}>
                <GoPlus />새 스페이스 생성
            </button>
            </div>

            <div className="space-list">
            {loading ? (
              <p className="centered-message">로딩 중...</p>
            ) : error ? (
              <p className="centered-message">{error}</p>
            ) : spaces.length === 0 ? (
              // 중앙 배치된 메시지
              <p className="centered-message">생성된 스페이스가 없습니다.</p>
            ) : (
      // 기존 스페이스 렌더링 로직
      spaces.map((space, idx) => (
        <Link
          to={`/projectlist/${space.spaceId}`} // sid값 라우팅위한값
          onClick={()=>handleSelectSpace(space.uuid)} // uuid 로컬 저장값
          key={space.spaceId}
          className="space-item"
        >
          <div
            className="color-box"
            style={{ backgroundColor: RandomColor(idx) }}
          />
          <div className="space-info">
            <h3>{space.spaceName}</h3>
          </div>
        </Link>
      ))
    )}
            </div>
            {showModal && (
                <SpaceModal 
                    onClose={handleCloseModal}
                    onConfirm={handleConfirm}
                />
            )}

        </SpaceAllWrap>
    );
};

export default SpaceAll;