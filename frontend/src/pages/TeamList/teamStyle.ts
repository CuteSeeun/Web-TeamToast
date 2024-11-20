import styled from "styled-components";

export const TeamMaWrap = styled.div`
max-width: 800px;
  margin: 0 auto;
  position: relative;

  .header-area {
    margin-top: 60px;
  }

  .title-area {
    position: relative;
    margin-bottom: 80px;

    h2 {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .add-member-btn {
      position: absolute;
      right: 0;
      bottom: -40px;
      padding: 8px 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      cursor: pointer;
      
      &:hover {
        background: #f5f5f5;
      }
    }
  }

  .member-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .member-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;

    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 12px;
    }

    .info {
      display: flex;
      align-items: center;
      flex: 1;
      font-size: 14px;

      .name {
        width: 100px;
        font-weight: 500;
      }

      .email {
        flex: 1;
        color: #666;
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      align-items: center;

      .role-wrapper {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #666;

        .auth-button {
          padding: 4px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: inherit;
        }
      }

      .delete-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        display: flex;
        align-items: center;
        padding: 4px;

        &:hover {
          color: #333;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 16px;

    button {
      min-width: 32px;
      height: 32px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 14px;
      color: #666;

      &.active {
        background: #f5f5f5;
        border-color: #e5e7eb;
        color: #333;
      }

      &:hover:not(.active) {
        background: #f5f5f5;
      }
    }
  }

`