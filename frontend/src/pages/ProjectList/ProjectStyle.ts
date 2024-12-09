import styled from "styled-components";

// 프로젝트 페이지 스타일
export const ProjectListWrap = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  /* 헤더 스타일 */
  .project-header {
    text-align: center;

    h2 {
      font-size: 32px;
      font-weight: 600;
      color: #1A1A1A;
      margin: 0;
      margin-bottom: 50px;
    }
  }
  /* ============ */

  /* 생성 버튼 스타일 */
  .create-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    background: #038C8C;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;

      
    &:hover {
      background: #017276;
    }

    svg {
      font-size: 16px;
    }
  }

  /* 버튼 컨테이너 스타일 */
  .table-container {
    margin-bottom: 40px;
    display: flex;
    justify-content: flex-end;


  }
  /* ============ */

  /* 테이블 스타일 */
  .project-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
    }

    th {
      font-weight: 500;
      color: #1A1A1A;
      padding: 12px;
    }

    td {
      color: #4D4D4D;
    }

    .project-info {
      display: flex;
      align-items: center;
      gap: 8px;

      img {
        width: 24px;
        height: 24px;
        border-radius: 4px;
      }
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      
      button {
        background: none;
        border: none;
        cursor: pointer;
        color: #4D4D4D;
        padding: 4px;
        
        &:hover {
          color: #038C8C;
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  /* ============ */

  /* 페이지네이션 스타일 */
  .pagination {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 24px;

    button {
      padding: 6px 10px;
      border: none;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 14px;
      color: #4D4D4D;

      &.active {
        background: #E6E6E6;
        color: #4D4D4D;
      }

      &:hover:not(.active):not(:disabled) {
        background: #E6E6E680;
      }

      &:disabled {
        cursor: not-allowed;
        color: #B3B3B3;
      }
    }
  }
  /* ============ */

  /* 프로젝트 없을 시 띄우는 알림 스타일 */
  .project-alert-container {
    margin: 0 auto;
    text-align: center;

    .project-alert-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .alert-svg {
      width: 256px;
      height: 256px;
      padding: 80px 40px 40px;
    }

    p {
      font-size: 20px;
      color: #4D4D4D;
      padding-bottom: 40px;
    }
  }
`

// 프로젝트 모달 스타일
export const ProjectModalWrap = styled.div`
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
   width: 100%;
   max-width: 400px;

   h3 {
     margin: 0 0 20px 0;
     font-size: 18px;
     font-weight: 600;
     color: #4D4D4D;
   }

   p {
     color: #4D4D4D;
     font-size: 14px;
     line-height: 1.5;
     margin-bottom: 20px;
   }

   .input-group {
     margin-bottom: 16px;

     label {
       display: block;
       margin-bottom: 8px;
       font-size: 14px;
       color: #4D4D4D;
     }

     input {
       width: 90%;
       padding: 8px 12px;
       border: 1px solid #e5e7eb;
       border-radius: 4px;
       font-size: 14px;

       &:focus {
         outline: none;
         border-color: #038C8C;
       }

       &::placeholder {
         color: #9ca3af;
       }
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
       font-weight: 500;
       cursor: pointer;
       transition: all 0.2s;

       &:first-child {
         background: white;
         border: 1px solid #e5e7eb;
         color: #4D4D4D;

         &:hover {
           background: #f9fafb;
         }
       }

       &:last-child {
         background: #038C8C;
         border: none;
         color: white;

         &:hover {
           background: #038C8C;
         }

         &.delete {
           background: #EF4444;

           &:hover {
             background: #DC2626;
           }
         }
       }
     }
   }
 }

 /* 삭제 모달 특화 스타일 */
 .modal.delete {
   max-width: 360px;
   
   p {
     margin: 16px 0 24px;
     color: #4B5563;
   }
   
   .button-group {
     margin-top: 0;
     
     button.delete {
       background: #EF4444;
       
       &:hover {
         background: #DC2626;
       }
     }
   }
 }

`