// 2024-11-25 한채경 수정
// NavStyle.ts
//로그인, 회원가입, 카카오톡

import styled from 'styled-components';

export const LoginWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .join-pass {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    
    span {
        font-size: 14px;
        color: #666;
        cursor: pointer;
        position: relative;
        
        &:first-child::after {
            content: '';
            position: absolute;
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 12px;
            background: #4d4d4d;
        }
        
        &:hover {
            color: #038c8c;
            text-decoration: underline;
        }
    }
}

  .inner {
    background: #ffffff;
    padding: 30px 20px;
    border-radius: 8px;
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
  padding:100px 0 100px 0;

  .Join-pass {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    
    p {
        font-size: 14px;
        color: #666;
        cursor: pointer;
        position: relative;
        
        &:first-child::after {
            content: '';
            position: absolute;
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 12px;
            background: #4d4d4d;
        }
        
        &:hover {
            color: #038c8c;
            text-decoration: underline;
        }
    }
}
.message {
  margin-top:-10px;
  margin-bottom: 5px;
}

.emailBtn {
  background: #038c8c;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  width: 80px;
  height: 25px;
  margin-top: 5px;
}

.telBtn {
  background: #038c8c;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  width: 80px;
  height: 25px;
  margin-top: 5px;
}

.telCheckBtn {
  background: #038c8c;
  border: none;
  color: #fff;
  cursor: pointer;
  width: 80px;
  height: 25px;
  margin-top: 5px;
  padding-bottom: 3px;
  margin-left: 5px;
  border-radius: 2px;
}

  .inner {
    background: #ffffff;
    padding: 30px 20px;
    border-radius: 8px;
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
    position: relative;

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


   // 이메일, 휴대폰번호용 새로운 클래스
   .inputBoxFlex {
    margin-bottom: 15px;
    text-align: left;
    position: relative;
    
    span {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    .input-button-wrap {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    input {
      flex: 1;
      height: 40px;
      padding: 0 10px;
      border: 1.5px solid #ccc;
      border-radius: 4px;
      outline: none;
      font-size: 14px;

      &:focus {
        border-color: #038c8c;
      }
    }

    button {
      height: 40px;
      width: 100px;
      padding: 0;
      background: #038c8c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background: #026868;
      }

      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
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


export const PassFindWrap = styled.div`
max-width: 400px;
   margin: 100px auto;
   padding: 0 20px;

   .inner {
       h2 {
           font-size: 24px;
           text-align: center;
           font-weight: 600;
           margin-bottom: 40px;
       }

       .inputBox {
           margin-bottom: 16px;

           input {
               width: 100%;
               height: 48px;
               padding: 0 16px;
               border: 1px solid #e0e0e0;
               border-radius: 6px;
               font-size: 14px;

               &:focus {
                   outline: none;
                   border-color: #038c8c;
               }

               &::placeholder {
                   color: #999;
               }
           }
       }

       .find-btn {
           width: 100%;
           height: 48px;
           background: #038c8c;
           color: white;
           border: none;
           border-radius: 6px;
           font-size: 16px;
           cursor: pointer;
           margin-top: 24px;

           &:hover {
               background: #027979;
           }
       }

       .link-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 24px;
    
    span {
        font-size: 14px;
        color: #666;
        cursor: pointer;
        position: relative;
        
        &:first-child::after {
            content: '';
            position: absolute;
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 12px;
            background: #4d4d4d;
        }
        
        &:hover {
            color: #038c8c;
            text-decoration: underline;
        }
    }
}
       }
`

export const PassFindModalWrap = styled.div`

position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(0, 0, 0, 0.5);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;

   .modal-content {
       background: white;
       padding: 32px;
       border-radius: 8px;
       width: 100%;
       max-width: 400px;

       h3 {
           font-size: 20px;
           font-weight: 600;
           color: #333;
           text-align: center;
           margin-bottom: 24px;
       }

       .input-box {
           margin-bottom: 16px;

           label {
               display: block;
               font-size: 14px;
               color: #666;
               margin-bottom: 8px;
           }

           input {
               width: 100%;
               height: 48px;
               border: 1px solid #e0e0e0;
               border-radius: 6px;
               font-size: 14px;

               &:focus {
                   outline: none;
                   border-color: #038c8c;
               }

               &::placeholder {
                   color: #999;
               }
           }
       }

       .error-message {
           color: #dc2626;
           font-size: 14px;
           margin-top: 8px;
           text-align: center;
       }

       .button-group {
           display: flex;
           justify-content: flex-end;
           gap: 8px;
           margin-top: 24px;

           button {
               padding: 8px 16px;
               border-radius: 4px;
               font-size: 14px;
               cursor: pointer;

               &.cancel-btn {
                   background: white;
                   border: 1px solid #e0e0e0;
                   color: #666;

                   &:hover {
                       background: #f9fafb;
                   }
               }

               &.submit-btn {
                   background: #038c8c;
                   border: none;
                   color: white;

                   &:hover {
                       background: #027979;
                   }
               }
           }
       }
   }
`