import styled from "styled-components";


export const IntroWrap = styled.div`
 background: linear-gradient(180deg, #60c1df, #84d1b6);
  height: 100vh;
  display: flex;
  justify-content: center;
  width: 100%;

  .intro-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 200px;
    max-width: 1200px;
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

  .space-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .space-modal-content {
    background: white;
    width: 80%;
    max-width: 600px; /* 적정 너비 설정 */
    max-height: 90%;
    overflow-y: auto;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    position: relative;
  }

`


export const SpaceViewWrap = styled.div`
 display: flex;
  flex-direction: column;
  padding: 20px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  height: 70%;
  width: 500px; /* 고정 너비 */
  overflow: hidden; /* 스크롤 영역을 한정 */
  position: relative; /* 버튼과 제목 위치 조정용 */

     .space-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative;

    h2 {
      font-size: 24px;
      font-weight: 900;
      text-align: center;
      flex-grow: 1; /* 제목이 가운데로 오도록 */
    }
    
  }

  .create-btn {
    
    background-color: #038c8c;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 50%;


      &:hover {
        background-color: #008ca3;
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
