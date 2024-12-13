import styled from "styled-components";


export const IntroWrap = styled.div`
  background: linear-gradient(180deg, #60c1df, #84d1b6);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 50px 20px; /* 전체 패딩 추가 */

  .intro-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto 50px; /* 하단 탭 섹션과의 간격 추가 */
  }

  .text-section {
    max-width: 50%;
    text-align: left;

    .main-title {
      font-size: 3rem;
      font-weight: bold;
      color: #fff;
      margin-bottom: 20px;
    }

    .sub-title {
      font-size: 1.2rem;
      color: #f0f0f0;
      margin-bottom: 30px;
    }

    .button-group {
      display: flex;
      gap: 10px;

      .primary-button {
        background-color: #4caf50;
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
        color: #4caf50;
        padding: 10px 20px;
        border: 2px solid #4caf50;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
      }
    }
  }

  .visual-section {
    max-width: 50%;
    display: flex;
    justify-content: center;

    .intro-video {
      width: 100%;
      max-width: 600px;
      height: 400px;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }

  .tab-section {
    margin-top: 50px;
    /* background: #f9f9f9; */
    padding: 50px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    margin: 0 auto;
  }

`


export const SpaceViewWrap = styled.div`
 display: flex;
  flex-direction: column;
  padding: 20px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  height: 30%;
  width: 500px; /* 고정 너비 */
  overflow-y: scroll; /* 스크롤 영역을 한정 */
  position: relative; /* 버튼과 제목 위치 조정용 */

     .space-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    position: relative;

    h2 {
      font-size: 24px;
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
`

export const TabSectionWrap = styled.div`
display: flex;
  flex-direction: column;
  align-items: center;
  width: 1200px;
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
        background: #ff8484;
        color: white;
        border-color: #ff8484;
      }

      &:hover:not(.active) {
        background: #f0f0f0;
      }
    }
  }

  .content-section {
    display: flex;
    gap: 40px;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;

    .image-container {
      flex: 1;

      img {
        /* width: 100%; */
        max-width: 800px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }

    .text-container {
      flex: 1;
      text-align: left;

      h2 {
        font-size: 2rem;
        margin-bottom: 20px;
        color: #333;
      }

      p {
        font-size: 1rem;
        margin-bottom: 20px;
        color: #555;
      }

      .cta-button {
        padding: 10px 20px;
        background-color: #038c8c;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;

        &:hover {
          background-color: #006f6f;
        }
      }
    }
  }

`
