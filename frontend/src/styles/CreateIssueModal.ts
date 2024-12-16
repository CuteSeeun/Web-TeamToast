import styled from "styled-components"

export const CreateIssueModalWrap = styled.div`
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

  /* 모달창 밖 영역 클릭 불가능하게 */
  pointer-events: none;

  .CreateIssueInner {
    height: auto;
    max-height: 90vh; 
    overflow: hidden;
  }

  .modal {
    background: white;
    padding: 24px;
    border-radius: 4px;
    width: 90%;
    max-width: 400px;
    height: auto; 
    max-height: 80vh; 
    overflow-y: auto; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    /* 모달 내부는 클릭 가능하게 */
    pointer-events: auto;

    h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #4D4D4D;
    }

    /* 내부 컨텐츠에 스크롤 추가 */
    .bodycontent {
      overflow-y: auto;
      height: calc(100% - 50px); 
    }

    p {
      color: #4D4D4D;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    .select-container {
      position: relative;
      width: 120px;

    
      .downIcon {
        position: absolute;
        top: 50%;
        right: 7px;
        transform: translateY(-50%);
        pointer-events: none;
        color: #4D4D4D;
      }
    }
    
    .sprint-select {
      width: 100%;

      select {
        width: calc(90% + 26px);
      }

      .downIcon {
        right: calc(10% - 26px + 7px);
      }
    }

    select::-ms-expand { 
      display: none;
    }

    select {
      -o-appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      width: 100%;
      padding: 8.5px 12px;
      border-radius: 4px;
      border: 1px solid #CCC;

      &:focus {
        outline: none;
        border-color: #038C8C;
        box-shadow: 0 0 0 2px rgba(0, 163, 191, 0.1);
      }

      option {
        padding: 5px;
      }
    }

    .select-group {
      display: flex;
      gap: 0 10px
    }

    .input-group {
      margin-bottom: 16px;

      .flex-box {
        display: flex;
        align-items: flex-start;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #4D4D4D;
      }

      .custom-file-button{
        width: 100px;
        height: 100px;
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='5' ry='5' stroke='%23999999FF' stroke-width='1' stroke-dasharray='9' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
        border-radius: 5px;
        box-sizing: border-box;
        position: relative;
        
        .file-btn {
          color: #888888;
          padding: 24px;
          font-size: 50px;
          position: absolute;
          cursor: pointer;
          border-radius: 5px;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
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
          box-shadow: 0 0 0 2px rgba(0, 163, 191, 0.1);
        }

        &::placeholder {
          color: #9ca3af;
        }
      }
    }
    
    .disabled {
      pointer-events: none;
      background-color: #E6E6E6;
      color: #555;
      opacity: 1;
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
`

// 스타일링 추가
export const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .custom-file-button {
    margin: 0 !important;
    width: 100px;
    height: 100px;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='5' ry='5' stroke='%23999999FF' stroke-width='1' stroke-dasharray='9' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
    border-radius: 5px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;

    .file-btn {
      color: #888888;
      font-size: 50px;
    }

    &:hover {
      background-color: #f2f2f2;
    }
  }

  .preview-wrap {
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 5px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    margin: 0;
    background: #ffffff;

    img-wrap {
      width: 98px;
      height: 98px;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 5px;
    }

    img {
      width: 100%;
      min-height: 98px;
      object-fit: cover;
      border-radius: 5px;
      display:block;
    }

    .file-btn {
      display: none;
      color: #4d4d4d;
      font-size: 50px;
      position: absolute;
      cursor: pointer;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }

    .file-name {
      margin: 5px 0;
      font-size: 12px;
      color: #4d4d4d;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:hover {
      img {
        filter: opacity(60%);
      }

      .file-btn {
        display: block;
      }
    }
  }
`;