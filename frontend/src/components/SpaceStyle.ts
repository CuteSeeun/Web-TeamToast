import styled from 'styled-components';


export const SpaceAllWrap = styled.div`
   width: 40%;
  margin: 100px auto;
  min-height: 500px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

    .spaceTop{
        display: flex;
        flex-direction: column;
        align-items: flex-end; 
    position: relative;    
    }

  h2 {
    position: absolute; 
        width: 100%;      
        text-align: center;
        font-size: 32px;
        font-weight: 400;
        margin-bottom: 40px;
        left: 0;     
    
  }

  .create-btn {
    margin-top: 50px;  
        display: flex;
        align-items: center; 
        width: 162px;
        height: 50px;
        gap: 8px;
        padding: 8px 16px;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        background: white;
        color: #666;
        cursor: pointer;
    
    &:hover {
      background: #f5f5f5;
    }

    svg {
      font-size: 18px;
    }
  }

  .space-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .space-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    /* width: 500px;
    height: 100px; */

    &:hover {
      background: #f5f5f5;
    }

    .color-box {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }

    .space-info {
      h3 {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      p {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .color-1 { background: #ff8787; }
  .color-2 { background: #ffd43b; }
  .color-3 { background: #a9e34b; }
  .color-4 { background: #66d9e8; }
  .color-5 { background: #748ffc; }
`

export const SpaceModalWrap = styled.div`
 .modal-overlay {
    position: fixed;
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

  .modal-content {
    background: white;
    padding: 32px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;

    h3 {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 24px;
    }

    .input-box {
      margin-bottom: 24px;

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
      }

      input {
        width: 100%;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        
        &:focus {
          outline: none;
          border-color: #2563eb;
        }
      }
    }

    .button-group {
      display: flex;
      gap: 12px;
      justify-content: flex-end;

      button {
        padding: 8px 24px;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;

        &.cancel {
          background: white;
          border: 1px solid #e5e7eb;
          color: #374151;
          &:hover {
            background: #f9fafb;
          }
        }

        &.confirm {
          background: #00A3BF;
          border: 1px solid #00A3BF;
          color: white;
          &:hover {
            background: #008CA3;
          }
        }
      }
    }
  }

`

export const SpaceEditWrap = styled.div`
max-width: 800px;
 margin: 60px auto 0;
 padding: 40px;
 background: white;
 border-radius: 8px;
 box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
 border: 1px solid #f0f0f0;
 position: relative;

 .tab-menu {
  position: absolute;
    left: -149px;  // 살짝 왼쪽으로 겹치게
    top: 40px;   // 위치 조정
    display: flex;
    flex-direction: column;  // 세로 배치
    gap: 10px;

    .tab-button {
        border: none;
        background: white;
        font-size: 16px;
        color: #666;
        font-weight: 400;
        cursor: pointer;
        padding: 12px 24px;
        border-radius: 4px 0px 0px 4px;  // 오른쪽만 둥글게
        border: 1px solid #e5e7eb;
        border-right: none;  // 왼쪽 테두리 제거
        text-align: left;
        transition: all 0.2s;

        &.active {
            color: #00A3BF;
            font-weight: 600;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.05);
            border-color: #00A3BF;
            padding-left: 28px;  // 활성화됐을 때 살짝 더 튀어나오게
        }

        &:hover:not(.active) {
            background: #f9fafb;
        }
    }
 }

 h1 {
   font-size: 20px;
   text-align: center;
   margin-bottom: 48px;
   color: #333;
 }

 h2 {
   font-size: 16px;
   font-weight: 500;
   margin-bottom: 20px;
   color: #333;
 }

 .edit-section {
   margin-bottom: 60px;
 }

 .name-edit {
   label {
     display: block;
     font-size: 14px;
     color: #666;
     margin-bottom: 8px;
   }
 }

 .input-group {
   position: relative;
   display: flex;
   gap: 8px;

   input {
     flex: 1;
     height: 40px;
     padding: 0 12px;
     border: 1px solid #e0e0e0;
     border-radius: 4px;
     font-size: 14px;
     margin-bottom: 20px;

     &::placeholder {
       color: #999;
     }
   }

   button {
     height: 40px;
     padding: 0 20px;
     border: none;
     border-radius: 4px;
     font-size: 14px;
     cursor: pointer;

     &.confirm-btn {
       background: #038c8c;
       color: white;
     }

     &.delete-btn {
       background: #ff6b6b;
       color: white;
     }
   }

   .validation-message {
     position: absolute;
     bottom: -20px;
     left: 0;
     font-size: 14px;
     margin-top: 8px;
     
     &.success {
       color: #2ecc71;
     }
     
     &.error {
       color: #e74c3c;
     }
   }
 }

 .delete-info {
   .warning {
     font-size: 14px;
     color: #666;
     margin-bottom: 16px;
     line-height: 1.5;
   }

   ul {
     margin: 16px 0;
     padding: 0;
     list-style: none;

     li {
       font-size: 14px;
       color: #666;
       margin-bottom: 8px;
       line-height: 1.5;
     }
   }

   .note {
     font-size: 14px;
     color: #666;
     margin: 16px 0;
   }

   .delete-confirm {
     margin-top: 24px;
     
     p {
       font-size: 14px;
       color: #666;
       margin-bottom: 12px;
     }
   }
 }

 .modal-overlay {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: rgba(0, 0, 0, 0.5);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;

   .modal {
     background: white;
     padding: 24px;
     border-radius: 8px;
     text-align: center;

     h3 {
       margin: 0 0 16px 0;
     }

     p {
       margin-bottom: 24px;
     }

     .confirm {
       padding: 8px 16px;
       background: #00A3BF;
       color: white;
       border: none;
       border-radius: 4px;
       cursor: pointer;

       &:hover {
         background: #009CAB;
       }
     }
   }
 }

 .plan-section {
   .plan-options {
     display: flex;
     gap: 16px;
     margin-bottom: 32px;

     .plan-card {
       flex: 1;
       padding: 20px;
       border: 1px solid #e5e7eb;
       border-radius: 8px;
       display: flex;
       gap: 12px;

       &.selected {
         background: #f0f9ff;
         border-color: #00A3BF;
       }

       input[type="radio"] {
         margin-top: 4px;
       }

       .plan-info {
         h3 {
           margin-bottom: 12px;
           font-weight: 500;
         }

         p {
           color: #666;
           margin-bottom: 4px;
         }

         .price {
           margin-top: 12px;
           font-weight: 500;
         }
       }
     }
   }

   .calculator {
     background: #f9fafb;
     padding: 24px;
     border-radius: 8px;

     h3 {
       margin-bottom: 20px;
     }

     .calc-row {
       display: flex;
       justify-content: space-between;
       align-items: center;
       margin-bottom: 12px;

       input {
         width: 80px;
         padding: 6px 12px;
         border: 1px solid #e5e7eb;
         border-radius: 4px;
       }
     }

     .summary {
       margin: 20px 0;
       padding: 16px 0;
       border-top: 1px solid #e5e7eb;
       border-bottom: 1px solid #e5e7eb;

       .row {
         display: flex;
         justify-content: space-between;
         margin-bottom: 8px;
       }
     }

     .total-price {
       display: flex;
       justify-content: space-between;
       font-weight: 500;
       margin-bottom: 24px;
     }

     .change-btn {
       width: 100%;
       padding: 12px;
       background: #00A3BF;
       color: white;
       border: none;
       border-radius: 4px;
       cursor: pointer;

       &:hover {
         background: #009CAB;
       }
     }
   }
 }

 .delete-btn {
   &:disabled {
     background: #ccc;
     cursor: not-allowed;
   }
 }
`