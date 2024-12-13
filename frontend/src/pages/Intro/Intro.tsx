import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import { Link, useNavigate } from 'react-router-dom';
import { IntroWrap } from './introStyle';
import SpaceAll from '../SpaceList/Space';
import SpaceView from './SpaceView';
import TabSection from './TabSection';

const Intro = () => {

    const user = useRecoilValue(userState);
    const [space , setSpace] = useState(false);

    const navigate = useNavigate();

    // const loginGo = () =>{
    //     alert('로그인 후 사용해주세요.');
    // }

    const openSpaceModal = () =>{
        if(user) {
            setSpace(true);
        }else{
            alert('로그인 후 입장해주세요.');
        }
    }

    const closeSpaceModal = () =>{
        setSpace(false);
    };



    return (
        <IntroWrap>
             <div className="intro-container">
                <div className="text-section">
                    <h1 className="main-title">일이 술술 풀리는 협업툴 TeamToast</h1>
                    <p className="sub-title">
                        원활한 소통과 매끄러운 업무 흐름을 가장 쉬운 협업 공간,<br/>TeamToast에서 경험해 보세요.
                    </p>
                    <div className="button-group">
                        {user ? (
                            <>
                                 <button className="secondary-button" onClick={openSpaceModal}>
                            입장하기
                        </button>
                            </>
                        ):(
                            <>
                             <button className="secondary-button" onClick={openSpaceModal}>
                            회원가입
                        </button>
                            </>
                        )
                    }
                       
                    </div>
                </div>
                <div className="visual-section">
                {space ? (
            <div className="modal-overlay">
              <SpaceView onClose={closeSpaceModal} />
            </div>
          ) : (
            <video
              className="intro-video"
              src="/video.mp4"
              autoPlay
              muted
              loop
            />
          )}
                </div>
            </div>

            {/* 새로운 탭 섹션 추가 */}
            <div className="tab-section">
                <TabSection />
            </div>

        </IntroWrap>
    );
};

export default Intro;