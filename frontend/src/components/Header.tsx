// components/Header.tsx
//세은
import React from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoIcon } from '../assets/icons/Logo.svg'; // icons 폴더에서 로고 가져옴
import { FaBell, FaCog, FaUserCircle, FaChevronDown } from 'react-icons/fa'; // React Icons 사용

const HeaderContainer = styled.div`
    display: flex;
  justify-content: space-between;                
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  width: 100%; /* 헤더가 화면 전체를 채우도록 */
  max-width: 100%; /* 화면 폭 이상으로 확장되지 않도록 제한 */
  box-sizing: border-box; /* 패딩과 너비를 함께 계산 */
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;

  /* 로고와 메뉴 간 간격 */
  & > *:not(:last-child) {
    margin-right: 20px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 150px; /* 로고 크기 */
    height: auto;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 20px; /* "프로젝트"와 "팀" 간 간격 */
    cursor: pointer;
    font-size: 16px; /* 기본 글씨 크기 */
    color: #4d4d4d; /* 기본 색상 */
  }

  span:hover {
    color: #038C8C; /* 호버 색상 */
  }
`;

const TeamMenu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    margin-right: 5px; /* "팀"과 화살표 간 간격 */
    font-size: 16px;
  }

  svg {
    font-size: 12px; /* 화살표 크기 */
  }
`;

const RightIcons = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin-left: 20px; /* 아이콘 사이 간격 */
    font-size: 20px; /* React Icons 크기 */
    cursor: pointer;
    color: #4d4d4d;
  }

  & > *:hover {
    color: #038C8C;
  }
`;

const Header: React.FC = () => {
    return (
        <HeaderContainer>
          {/* 로고와 왼쪽 메뉴 */}
          <LeftSection>
            <Logo>
              <LogoIcon />
            </Logo>
            <NavLinks>
              <span>프로젝트</span>
              <TeamMenu>
                <span>팀</span>
                <FaChevronDown />
              </TeamMenu>
            </NavLinks>
          </LeftSection>
    
          {/* 오른쪽 아이콘 */}
          <RightIcons>
            <FaBell />
            <FaCog />
            <FaUserCircle />
          </RightIcons>
        </HeaderContainer>
      );
};

export default Header;