import styled, { keyframes } from "styled-components";


const waveEffect = keyframes`
   0% {
    color: #37474F;
    opacity: 0.5;
    transform: translateY(5px);
  }
  25% {
    color: #37474F;
    opacity: 0.75;
    transform: translateY(2.5px);
  }
  50% {
    color: #37474F;
    opacity: 1;
    transform: translateY(0);
  }
  75% {
    color: #37474F;
    opacity: 0.75;
    transform: translateY(2.5px);
  }
  100% {
    color: #fff;
    opacity: 0.5;
    transform: translateY(-5px);
  }
`;

export const AnimateWaveText = styled.span`
 display: inline-block;
  span.wave {
    display: inline-block;
    font-size: 3rem;
    font-weight: bold;
    animation: ${waveEffect} 5s ease-in-out infinite;
    opacity: 0.5; /* 초기 상태 */
  }
`

export const IntroWrap = styled.div`
  background: linear-gradient(180deg, #60c1df, #84d1b6);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding-top:150px;

  .intro-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto; /* 하단 탭 섹션과의 간격 추가 */
  }

  .text-section {
    max-width: 50%;
    text-align: left;

    .main-title {
      font-size: 3rem;
      font-weight: bold;
      color: #37474F;
      margin-bottom: 20px;
    }

    .sub-title {
      font-size: 1.2rem;
      color: #37474F;
      margin-bottom: 30px;
    }

    .button-group {
      display: flex;
      gap: 10px;

      .primary-button {
        background-color: #038c8c;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
      }

      .secondary-button {
        background-color: #fff;
        color: #038c8c;
        padding: 12px 25px;
        border: 2px solid #038c8c;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        transition: all 0.3s ease-in-out;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

        &:hover {
          background-color: #038c8c;
          color: #fff;
          transform: scale(1.05); /* 버튼 크기 확대 효과 */
          box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15); /* 그림자 효과 강화 */
        }

        &:active {
          transform: scale(0.98); /* 클릭 시 살짝 줄어드는 효과 */
          box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  
  .visual-section {
    max-width: 50%;
    display: flex;
    justify-content: center;
    margin-bottom: 100px;

    .intro-video {
      width: 100%;
      max-width: 600px;
      height: 400px;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }

 


/* 페이드 아웃 */
.fade-out {
  animation: fadeOut 0.5s ease-in-out forwards;
}

/* 페이드 인 */
.fade-in {
  animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}


@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(50px);
  }
}


.tab-section {
    margin-top: 50px;
    padding: 100px 20px;
    border-radius: 10px;
    max-width: 1200px;
    margin: 0 auto;
    opacity: 0; /* 기본 숨김 상태 */
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
   
    &.animate-fade-in {
      animation: fadeInUp 1s ease-in-out forwards;
    }

    &.animate-fade-out {
    animation: fadeOutDown 0.8s ease-in-out forwards;
  }
  
  }




`


export const SpaceViewWrap = styled.div`
 display: flex;
  flex-direction: column;
  padding: 0 20px 30px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  height: 400px;
  width: 600px; /* 고정 너비 */
  position: relative; /* 버튼과 제목 위치 조정용 */

     .space-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    position: relative;

    h2 {
      font-size: 24px;
      color:#000;
      font-weight: 900;
      text-align: center;
      flex-grow: 1; /* 제목이 가운데로 오도록 */
    }
    
    .create-btn {
        position: absolute;
        top: 60px;
        right: 0;
        background-color: #038c8c;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
  
  
        &:hover {
          background-color: #008ca3;
        }
      }
  }

  .space-list {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 10px; /* 스크롤바가 겹치지 않도록 */
  }

  .space-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }

    .color-box {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      margin-right: 10px;
    }
  }

  .space-item.new-space-item {
    display: flex; /* 가로 정렬 */
    align-items: center; /* 세로 가운데 정렬 */
    padding: 10px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    gap: 10px; /* 요소 간 간격 */
}

.new-space-input {
    flex: 1; /* 입력 필드가 가로로 최대 공간 차지 */
    padding: 12px 15px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s;

    &:focus {
        border-color: #038c8c; /* 초록색 강조 */
        outline: none;
    }
}

.create-space-btn {
    padding: 12px 20px;
    font-size: 1rem;
    background-color: #038c8c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #027979; /* hover 효과 */
    }
}

`

export const TabSectionWrap = styled.div`
 display: flex;
  flex-direction: column;
  width: 1200px;
  margin: 60px 0;

  .tab-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;

    .tab-button {
      padding: 10px 20px;
      border: 1px solid #ccc;
      border-radius: 20px;
      background: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        background: #038c8c;
        color: white;
        border-color: #038c8c;
      }

      &:hover:not(.active) {
        background: #f0f0f0;
      }
    }
  }

  .content-section {
    display: flex;
    gap: 50px;
    align-items: center;
    max-width: 1200px;

    .image-container {
      flex: 1;

      img {
        max-width: 600px;
        height: 400px;
        border-radius: 10px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      }
    }

    .text-container {
      flex: 1;
      text-align: left;

      h2 {
        font-size: 3rem;
        margin-bottom: 20px;
        font-weight: bold;
        background: #37474F;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
      }

      p {
        font-size: 1.3rem;
        line-height: 1.8;
        color: #37474F;
        margin-bottom: 20px;

        strong {
          color: #038c8c;
          font-weight: bold;
        }
      }

      .cta-button {
        padding: 10px 20px;
        background-color: #038c8c;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &:hover {
          background-color: #027979;
          transform: scale(1.05);
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

`


export const IntroFooterWrap = styled.footer`
 background-color: #00474F;
  color: #fff;
  padding: 20px 40px;
  font-family: Arial, sans-serif;
  font-size: 0.9rem;

  .footer-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .footer-info {
      max-width: 60%;

      p {
        margin: 5px 0;
        line-height: 1.5;
      }
    }

    .footer-links {
      display: flex;
      flex-direction: column;

      a {
        color: #ccc;
        text-decoration: none;
        margin-bottom: 10px;
        transition: color 0.3s;

        &:hover {
          color: #fff;
        }
      }
    }
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #333;
    padding-top: 10px;

    p {
      margin: 0;
    }

    .footer-partners {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    .footer-logo {
      margin-right: 120px; /* 로고와 다른 요소 간 간격 */
      height: 30px; /* 필요에 따라 높이 조정 */
      width: auto; /* 비율 유지 */
    }
    }
  }

  .floating-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #ff497c;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 0.9rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: #e0366b;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }


`
