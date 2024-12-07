import styled from 'styled-components';


//팝업 스타일
export const NotificationsPopup = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 300px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border: 1px solid #e5e5e5;
`;


// 
export const NotificationCard = styled.div`
 display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #e5e5e5;

  &:hover{
    background: #e5e5e5;
  }

/* 
  a{
    &:hover{
      background: #e5e5e5;
      border-radius: 4px;
      padding: 5px;
    }
  } */

  .notification-header {
    font-weight: bold;
    font-size: 14px;
    color: #333;
  }

  .notification-body {
    font-size: 12px;
    color: #555;
  }

  .time-stamp {
    font-size: 10px;
    color: #888;
    margin-top: 4px;
    text-align: right;
  }
`;


export const ProjectHeaderWrap = styled.div`
  width: 100%;
  max-width: 1920px;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;

  .headerProject {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
  }

    .centerPro {
    display: flex;
    align-items: center;
    gap: 20px;

    span {
      font-size: 14px;
      color: #4d4d4d;
      cursor: pointer;

      &:hover {
        color: #333;
      }
    }
  }

  .leftPro {
    display: flex;
    align-items: center;
    gap: 24px;
    
    
    h1 {
      font-size: 20px;
      font-weight: 600;
      color: #038c8c;
    }

    nav {
      display: flex;
      gap: 20px;
    }

    .menu-wrap {
      position: relative;

      &:hover .sub-menu {
        display: block;
      }
    }

    .menu-text {
      width: 100%;
      height: 32px;
      color: #4D4D4D;
      cursor: pointer;
      line-height:32px;
      display: flex;
      justify-content:center;
      align-items:center;
      border-radius: 5px;
      padding: 0 5px;

      &:hover {
        background: #E6E6E680;
      }

      &:hover {
        color: #333;
      }
    }

    .text-with-rigth-icon{
      padding-right: 5px;
    }

    .sub-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      min-width: 150px;
      padding: 8px 0;

      li {
        padding: 8px 16px;
        font-size: 14px;
        color: #4D4D4D;
        cursor: pointer;

        &:hover {
          background: #f5f5f5;
          color: #333;
        }
      }
    }
  }

  .rightPro {
    display: flex;
    align-items: center;
    gap: 20px;
    color: #4D4D4D;
    font-size: 24px;
    margin-right:10px;
    line-height:50%;

    .menu-wrap {
      position: relative;
      border-radius: 4px;

    &:hover {
      background: #E6E6E680;
    }
      &:last-of-type {
        border-radius: 50%;
        padding: 4px;
      }

      &:hover .sub-menu {
        display: block;
      }
    }

    .Subscription{
    padding: 10px 16px; /* 배경 네모를 명확히 하기 위한 여백 추가 */
    border-radius: 4px;
    font-size: 15px;
    cursor: pointer;
    border: 1px solid #038c8c;
    color: #038c8c;

    &:hover {
      border: 1px solid #017276;
      color: #017276;
    }
    }

    
    .icon-wrap{
      padding: 8px;
    }

    .user-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #333;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
}

.notification-icon {
    position: relative;
    border-radius: 4px;

    &:hover {
      background: #E6E6E680;
    }
    
    .notification-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 8px;
        height: 8px;
        background: #ff4d4f;
        border-radius: 50%;
    }
}
    .menu-text {
      cursor: pointer;

      &:hover {
        color: #333;
      }
    }

    .sub-menu {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 150px;
      padding: 8px 0;
      line-height: 1.5;

      li {
        padding: 8px 16px;
        font-size: 14px;
        color: #4D4D4D;
        cursor: pointer;

        &:hover {
          background: #f5f5f5;
          color: #333;
        }
      }
    }
  }
`;

export const IntroHeaderWrap = styled.div`
  width: 100%;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;

  .headerIntro {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .leftIntro {
    display: flex;
    align-items: center;
    gap: 20px;

    h1 {
      margin: 0;
      padding: 0 8px;  /* 로고 주변 여백 추가 */
      
      .logo {
        font-size: 20px;
        font-weight: 600;
        color: #038C8C;
        text-decoration: none;
        
        &:hover {
          opacity: 0.8;
        }
      }
    }

    nav {
      margin-left: 10px;  /* 네비게이션 왼쪽 여백 추가 */
      
      .nav-link {
        font-size: 14px;
        color: #4D4D4D;
        text-decoration: none;
        padding: 8px;  /* 링크 주변 여백 증가 */
        
        &:hover {
          color: #333;
        }
      }
    }
  }

  .menu-wrap {
      position: relative;
      padding: 8px;

      &:hover .sub-menu {
        display: block;
      }
    }

    .user-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #333;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
}

.sub-menu {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 150px;
      padding: 8px 0;

      li {
        padding: 8px 16px;
        font-size: 14px;
        color: #4D4D4D;
        cursor: pointer;

        &:hover {
          background: #f5f5f5;
          color: #333;
        }
      }
    }



  .rightIntro {
    display: flex;
    align-items: center;
    gap: 12px;  /* 버튼 사이 간격 증가 */
    margin-right: 12px;  /* 오른쪽 끝 여백 추가 */




    .btn {
      padding: 8px 22px;  /* 버튼 내부 여백 증가 */
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-signup {
      color: #4D4D4D;
      border: 1px solid #e5e5e5;
      
      &:hover {
        background: #f5f5f5;
      }
    }

    .btn-login {
      background: #038C8C;
      color: white;
      
      &:hover {
        background: #008CA0;
      }
    }
  }
`

export const LogoHeaderWrap = styled.div`
 width: 100%;
   height: 64px;
   background: #fff;
   border-bottom: 1px solid #e5e5e5;

   .logoArea {
       height: 100%;
       padding: 0 8px;
       display: flex;
       align-items: center;

       a {
           text-decoration: none;

           h1 {
               font-size: 20px;
               font-weight: 600;
               color: #038c8c;

               &:hover {
                   opacity: 0.8;
               }
           }
       }
   }

`

// Logo 스타일 컴포넌트
export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 152px;
    height: 40px;
    fill: #038c8c;

    &:hover {
      fill: #026f6f;
    }
  }
`;