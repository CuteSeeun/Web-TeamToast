//로그인, 회원가입, 카카오톡

import styled from 'styled-components';

export const LoginWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .inner {
    background: #ffffff;
    padding: 30px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  h2 {
    font-size: 30px;
    margin-bottom: 10px;
  }

  p {
    font-size: 18px;
    margin-bottom: 20px;
    color: #999;
  }

  .inputBox {
    margin-bottom: 15px;
  }

  .inputBox input {
    width: 95%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
  }

  .loginBtn {
    width: 100%;
    padding: 10px;
    background: #038c8c;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
      background: #026868;
    }
  }

  .social-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;

    .line-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center;
      margin: 10px 0;
    }

    .line {
      flex: 1;
      height: 1px;
      background-color: #ccc;
      margin: 0 10px;
    }

    .social-text {
      font-size: 14px;
      color: #888;
    }
  }

  .social-media {
    display: flex;
    flex-direction:column;/* 공간을 균등하게 나눔 */
    margin-top: 15px;
    gap: 10px; /* 버튼 간 간격 */

    button {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      flex: 1; /* 버튼이 같은 크기를 유지 */
      max-width: 400px; /* 버튼의 최대 너비 설정 */
      justify-content: center;

      span {
        font-weight: 500;
        font-size: 14px;
        margin-left: 8px; /* 아이콘과 텍스트 사이 여백 */
      }

      i {
        font-size: 20px;
      }
    }

    .kakaoBtn {
      background: #ffe812;
      border: none;
      color: #3a1d1d;
    }

    .googleBtn {
      background: #fff;
      border: 1px solid #ccc;
      color: #333;
    }
  }
`;

export const JoinWrap = styled.div`
 display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding:60px 0 60px 0;

  .inner {
    background: #ffffff;
    padding: 30px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  h2 {
    margin-bottom: 40px;
    font-size: 35px;
    font-weight: bold;
    width: 380px;
    height: 62px;
  }

  .inputBox {
    margin-bottom: 15px;
    text-align: left;

    span {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    input {
      width:95%;
      padding: 10px;
      border: 1.5px solid #ccc;
      border-radius: 4px;
      outline: none;
      font-size: 14px;
    }

    input:focus {
      border-color: #038c8c;
    }
  }

  .submitBtn {
    width: 100%;
    padding: 12px;
    background: #038c8c;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;

    &:hover {
      background: #026868;
    }
  }

  .social-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;

    .line-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center;
      margin: 10px 0;
    }

    .line {
      flex: 1;
      height: 1px;
      background-color: #ccc;
      margin: 0 10px;
    }

    .social-text {
      font-size: 14px;
      color: #888;
    }
  }

  .social-media {
    display: flex;
    flex-direction:column;/* 공간을 균등하게 나눔 */
    margin-top: 15px;
    gap: 10px; /* 버튼 간 간격 */

    button {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      flex: 1; /* 버튼이 같은 크기를 유지 */
      max-width: 400px; /* 버튼의 최대 너비 설정 */
      justify-content: center;

      span {
        font-weight: 500;
        font-size: 14px;
        margin-left: 8px; /* 아이콘과 텍스트 사이 여백 */
      }

      i {
        font-size: 20px;
      }
    }

    .kakaoBtn {
      background: #ffe812;
      border: none;
      color: #3a1d1d;
    }

    .googleBtn {
      background: #fff;
      border: 1px solid #ccc;
      color: #333;
    }
  }


`