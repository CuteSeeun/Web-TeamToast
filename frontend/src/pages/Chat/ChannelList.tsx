import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil'; // Recoil 훅 가져오기
import { userState } from '../../recoil/atoms/userAtoms'; // Recoil atom 가져오기
import { channelAtom } from '../../recoil/atoms/channelAtoms';
import { selectedChannelAtom } from '../../recoil/atoms/selectedChannelAtoms';


const ChannelListWrapper = styled.div<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? 'auto' : '0px')};
  overflow: hidden;
  transition: height 0.3s ease; /* 부드러운 애니메이션 */
`;

const ChannelListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChannelItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: ${({ active }) => (active ? "#e7f3f3" : "transparent")};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#038c8c" : "#333")};
  box-shadow: ${({ active }) =>
    active ? "0 0 5px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    background-color: #e9ecef;
  }
`;



const ChannelList: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  // const [channels, setChannels] = useState([]);
  const [channels, setChannels] = useRecoilState(channelAtom); // Recoil Atom 상태 읽기 및 업데이트
  const [selectedChannel, setSelectedChannel] = useRecoilState(selectedChannelAtom); // 선택된 채널 상태
  const user = useRecoilValue(userState); // Recoil에서 userState 가져오기

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        
        const user = {
          uid: 8,
          uname: '김송내',
          email: 'kh32100@naver.com',
        };

        console.log('유저이메일:', user.email); // 이메일 출력
        console.log('Request params:', { email: user.email });

        const response = await axios.get('http://localhost:3001/channel', {
          params: { email: user.email }, // 이메일을 쿼리로 전달
        });

        setChannels(response.data); // API로 가져온 데이터를 상태에 저장
        console.log('채팅 채널 이름 가져와 상태에 저장 성공');
      } catch (err) {
        console.error('채팅 채널 이름 가져오기 개실패', err);
      }
    };

    fetchChannels();
  }, [setChannels, user]); // user가 변경되면 fetchChannels 재실행

  return (
    <ChannelListWrapper isOpen={isOpen}>
      <ChannelListContainer>
        {channels.map((channel: { rid: number; rname: string }, index) => (
          <ChannelItem key={channel.rid}
          active={selectedChannel?.rid === channel.rid}
            onClick={() => setSelectedChannel(channel)}>
                      {/* //  active={index === 0}> */}
                       {channel.rname}
          </ChannelItem>
        ))}
      </ChannelListContainer>
    </ChannelListWrapper>
  );
};

export default ChannelList;
