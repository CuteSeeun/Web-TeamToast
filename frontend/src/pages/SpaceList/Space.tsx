import React, { useEffect, useState } from 'react';
import { SpaceAllWrap } from '../../components/SpaceStyle';
import { GoPlus } from "react-icons/go";
import SpaceModal from './SpaceModal';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccessToken from '../Login/AccessToken';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';

interface SpaceItem {
    spaceId : string;
    spaceName:string;
    role:string;
    // uuid:string;
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
    
    const userName = useRecoilValue(userState);

    //스페이스 목록
    useEffect(() => {
        const fetchSpace = async () => {
            try {
                 // 하나의 API 호출만 유지
                 // 서버에서 해당 로그인 유저의 이메일을 가져와서
                 // 유저롤과 유저 의 이메일 같은걸 찾고 유저롤에서 
                 // 같은 이메일의 
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
    const handleSelectSpace = async(spaceId:string) => {
        try {
                await AccessToken.post('/space/select-space',{spaceId});
                sessionStorage.setItem('sid',spaceId);
                console.log(sessionStorage.getItem('sid'));
                
            const selectSpace = spaces.find(space=>space.spaceId === spaceId);
            if(selectSpace){
                sessionStorage.setItem('userRole',selectSpace.role);
              }
              // 스토리지 이벤트 강제 발생
              // 같은 탭에서 동작하게 하려면 수동으로 이벤트를 걸어야한다.
              window.dispatchEvent(new Event('storage'));
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
            if (response.data.spaceId) {
                setSpaces((prev) => [
                    ...prev,
                    {
                        spaceId: response.data.spaceId,
                        spaceName: spaceName,
                        role: 'top_manager',
                        // uuid: response.data.spaceUuid,
                    },
                ]);
            }
            await alert('스페이스가 생성되었습니다.');
            await setShowModal(false);
           
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                alert(error.response.data.message); // 중복된 경우의 에러 메시지 표시
            } else {
                console.error('스페이스 생성 에러:', error);
                alert('스페이스 생성에 실패했습니다.');
            }
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
          
            {spaces.length === 0 ? (
              <p className="centered-message">생성된 스페이스가 없습니다.</p>
            ) : (
      // 기존 스페이스 렌더링 로직
      spaces.map((space, idx) => (
        <Link
          to={`/projectlist/${space.spaceId}`} // sid값 라우팅위한값
          onClick={()=>handleSelectSpace(space.spaceId)} // uuid 로컬 저장값
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