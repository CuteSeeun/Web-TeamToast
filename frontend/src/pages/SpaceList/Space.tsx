import React, { useEffect, useState } from 'react';
import { SpaceAllWrap } from '../../components/SpaceStyle';
import { GoPlus } from "react-icons/go";
import SpaceModal from './SpaceModal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { spaceIdState } from '../../recoil/atoms/spaceAtoms';
import { useCurrentSpace } from '../../hooks/spaceId';

interface SpaceItem {
    spaceId : number;
    spaceName:string;
    role:string;
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

    // const setSpaceId = useSetRecoilState(spaceIdState);
    const {selectSpace} = useCurrentSpace();

    const RandomColor = (idx : number) =>{
        return PASTEL_COLORS[idx % PASTEL_COLORS.length];
    };
    
useEffect(()=>{
    const fetchSpaces = async() => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/space/my-spaces',{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setSpaces(response.data.spaces);
        } catch (error) {
            setError('스페이스 목록을 불러오는데 실패했습니다.');
            console.error('스페이스 조회 에러 : ',error);
        }finally{
            setLoading(false);
        }
    };
fetchSpaces();
},[])
  
    const handleCreateClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirm = async(spaceName:string) => {
        try {
            const response = await axios.post('http://localhost:3001/space/create',{
                sname:spaceName},
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            if(response.data.spaceId){
                //try되면 목록 새로고침
                // fetchSpaces();
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
          to={`/projectlist/${space.spaceId}`}
          onClick={()=>selectSpace(space.spaceId)}
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