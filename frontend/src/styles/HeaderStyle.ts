import styled from 'styled-components';


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
      padding: 4px 8px;

      &:hover .sub-menu {
        display: block;
      }
    }

    .menu-text {
        width: 32px;
        height: 32px;
        color: #666;
      cursor: pointer;

      &:hover {
        color: #333;
      }
    }

    .sub-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 150px;
      padding: 8px 0;

      li {
        padding: 8px 16px;
        font-size: 14px;
        color: #666;
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

    .menu-wrap {
      position: relative;
      padding: 4px 8px;

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

.notification-icon {
    position: relative;
    
    .notification-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background: #ff4d4f;
        border-radius: 50%;
    }
}

    /* .notification-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      border-radius: 50%;
      cursor: pointer;

      &:hover {
        background: #f5f5f5;
      }
    } */

    .menu-text {
      font-size: 14px;
      color: #666;
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

      li {
        padding: 8px 16px;
        font-size: 14px;
        color: #666;
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
        color: #00A2B9;
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
        color: #666;
        text-decoration: none;
        padding: 4px 8px;  /* 링크 주변 여백 증가 */
        
        &:hover {
          color: #333;
        }
      }
    }
  }

  .menu-wrap {
      position: relative;
      padding: 4px 8px;

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
        color: #666;
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
      color: #666;
      border: 1px solid #e5e5e5;
      
      &:hover {
        background: #f5f5f5;
      }
    }

    .btn-login {
      background: #00A2B9;
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
    width: 40px;
    height: 40px;
    fill: #038c8c;

    &:hover {
      fill: #026f6f;
    }
  }
`;