import styled from "styled-components";

export const ProfileWrap = styled.div`
   max-width: 800px;
 height: 570px;
 margin: 0 auto;
 background: white;
 border-radius: 8px;
 border: 1px solid #f0f0f0;

 h1 {
   font-size: 20px;
   text-align: center;
   margin: 60px 0 60px 0;
 }

 .profile-container {
   display: block;
   padding: 0 40px;
 }

 .info-section {
   h2 {
     font-size: 16px;
     font-weight: 500;
     margin-bottom: 24px;
     color: #333;
   }
 }

 .form-row {
   margin-bottom: 24px;
   position: relative;

   label {
     display: block;
     font-size: 14px;
     color: #666;
     margin-bottom: 8px;
   }

   input {
     width: 100%;
     height: 40px;
     border: 1px solid #e0e0e0;
     border-radius: 4px;
     padding: 0 12px;
     font-size: 14px;
   }
 }

 .password-group {
   position: relative;
   margin-bottom: 40px;
   
   .change-pwd-btn {
     width: 50%;
     height: 40px;
     border-radius: 4px;
     font-size: 14px;
     cursor: pointer;
     background: #038c8c;
     border: none;
     color: white;
     &:hover{background: #017276;}
   }

   .save-btn {
     position: absolute;
     right: 0;
     bottom: -40px;
     padding: 8px 20px;
     height: 40px;
     background: #038c8c;
     border: none;
     border-radius: 4px;
     color: white;
     font-size: 14px;
     cursor: pointer;
   }
 }
`

export const PlanWrap = styled.div`

max-width: 800px;
  margin: 60px auto 70px ;
  padding: 40px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;

  h1 {
    font-size: 20px;
    text-align: center;
    margin-bottom: 48px;
  }

  .plan-container {
    display: flex;
    flex-direction: column;
    gap: 60px;
  }

  .plan-section, .cancellation-section {
    h2 {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 24px;
      color: #333;
    }

    h3 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #333;
    }
  }

  .plan-desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  .team-plan {
    margin-top: 32px;
  }

  .members-info {
    margin-bottom: 24px;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-size: 14px;

      .input-wrap {
        display: flex;
        align-items: center;
        gap: 8px;

        input {
          width: 80px;
          height: 32px;
          padding: 0 8px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          text-align: right;
        }
      }
    }
  }

  .calculation {
    background: #f8f8f8;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 24px;

    .calc-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      color: #666;
    }

    .total-price {
      display: flex;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
      font-weight: 500;
      font-size: 14px;
    }
  }

  .update-btn, .cancel-btn {
    width: 100%;
    height: 40px;
    background: #038c8c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background: #027979;
    }
  }

  .cancel-info {
    p {
      margin: 16px 0;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }

    ul {
      margin: 24px 0;
      padding-left: 20px;
      font-size: 14px;
      color: #666;
      line-height: 1.6;

      li {
        margin-bottom: 8px;
      }
    }
  }
`

export const PasswordModalWrap = styled.div`
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
       padding: 24px;
       border-radius: 8px;
       width: 100%;
       max-width: 400px;

       h3 {
           font-size: 18px;
           font-weight: 600;
           margin-bottom: 24px;
           color: #333;
       }

       .input-box {
           margin-bottom: 16px;
           position: relative;

           label {
               display: block;
               font-size: 14px;
               color: #666;
               margin-bottom: 8px;
           }

           input {
               width: 90%;
               padding: 10px 12px;
               border: 1px solid #e5e7eb;
               border-radius: 4px;
               font-size: 14px;

               &:focus {
                   outline: none;
                   border-color: #038c8c;
               }

               &::placeholder {
                   color: #9ca3af;
               }
           }

           .valid-feedback,
           .invalid-feedback {
               display: block;
               font-size: 12px;
               margin-top: 4px;
               padding-left: 2px;
           }

           .valid-feedback {
               color: #059669;
           }

           .invalid-feedback {
               color: #dc2626;
           }
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
                   border: 1px solid #e5e7eb;
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
                       background: #017276;
                   }

                   &:disabled {
                       background: #9ca3af;
                       cursor: not-allowed;

                       &:hover {
                           background: #9ca3af;
                       }
                   }
               }
           }
       }
   }
`