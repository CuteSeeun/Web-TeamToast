// 2024-11-28 한채경
// CreateIssueModal.ts
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

  .modal {
    background: white;
    padding: 24px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

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