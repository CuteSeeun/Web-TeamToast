import styled from "styled-components";

export const PriceCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  width: 100%;
  max-width: 350px;
  height: auto;
  margin-top: 50px;
  background-color: #fff;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;

  h2 {
    font-size: 28px;
    margin-bottom: 15px;
    font-weight: bold;
  }

  button {
    height: 45px;
    width: 80%;
    margin-top: 15px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 40px;
    background-color: #007bff;
  }

  .freebtn {
    background-color: #038c8c;
    cursor: default;
  }

  .teambtn {
    background-color: #05a6a6;

    &:hover {
      background-color: #038c8c;
    }
  }

  p {
    margin-top: 15px;
    font-size: 16px;
    color: #333;
    text-align: left;
    padding-left: 15px;
    line-height: 1.5;

    span {
      font-weight: 600;
    }
  }

  ul {
    margin-top: 10px;
    padding-left: 30px;
    list-style: none;

    li {
      margin-bottom: 10px;
      display: flex; /* 플렉스 컨테이너로 변경 */
      align-items: center; /* 텍스트와 * 정렬 */
      line-height: 1.5;

      &:before {
        content: "•";
        color: #038c8c;
        font-weight: bold;
        margin-right: 8px; /* 텍스트와 기호 간격 */
        flex-shrink: 0; /* 크기 고정 */
      }
    }
  }

  .description {
    margin-top: 20px;
    font-size: 15px;
    color: #555;
  }
`;

export const PaymentWrap = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 60px auto;

  .plan-section,
  .billing-info {
    margin-top: 10px;
    font-size: 14px;
    color: #333;
  }

  .billing-info p {
    margin: 5px 0;
  }
  .card-section {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    margin-bottom: 30px;
  }

  .plan-section .section-header {
    display: flex; /* Flexbox 활성화 */
    justify-content: space-between; /* 좌우 정렬 */
    align-items: center; /* 세로 정렬 */
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
  }

  .billing-date {
    font-size: 16px; /* 결제 예정일 폰트 크기 */
    color: #555; /* 텍스트 색상 */
  }

  .card-section .card-info h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
  }

  .plan-options {
    display: flex;
    gap: 20px;
    margin-bottom: 40px;
  }

  .plan-card {
    flex: 1;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    position: relative;
    cursor: pointer;

    &:hover {
      border-color: #038c8c;
      background: rgba(3, 140, 140, 0.1);
    }

    &.selected {
      border-color: #038c8c;
      background: rgba(3, 140, 140, 0.2);

      h3 {
        color: #038c8c;
      }

      p {
        color: #038c8c;

        &.price {
          color: #038c8c;
        }
      }
    }

    input[type="radio"] {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }

  .calculator {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #ddd;

    h3 {
      margin-bottom: 20px;
      font-size: 18px;
    }

    .calc-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      span {
        font-size: 16px;
        color: #666;
      }

      input {
        margin-left: auto; /* 입력 필드를 오른쪽으로 이동 */
        text-align: right; /* 입력 필드 내 텍스트를 오른쪽 정렬 */
        width: 80px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    }

    .summary {
      margin: 20px 0;
      padding: 20px 0;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;

      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }

    .total-price {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0;
    }
  }

  /* 공통 버튼 스타일 */
  .change-btn {
    width: 100%;
    padding: 12px;
    background: #038c8c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    margin-top: 20px;

    &:hover {
      background: #017276;
    }
  }

  .card-section {
    background: #ffffff;
    border: 2px solid #e0e0e0;

    .card-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      span {
        font-size: 16px;
        color: #666;
      }
    }

    .card-actions {
      display: flex;
      gap: 10px;

      button {
        padding: 10px 20px;
        font-size: 14px;
        font-weight: bold;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &.card-change-btn {
          margin-left: auto; /* 버튼을 오른쪽으로 밀기 */
          padding: 0.5rem 1rem;
          background-color: #038c8c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #038c8c;
          }
        }

        &.card-delete-btn {
          background: #e53935;

          &:hover {
            background: #d32f2f;
          }
        }
      }
    }
  }
`;

export const UpgradeSuccessWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f9f9f9;

  h1 {
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    color: #555;
    margin-bottom: 40px;
  }

  button {
    font-size: 20px;
    padding: 15px 30px;
    background-color: #038c8c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #017276;
    }
  }
`;

export const FailureWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f9f9f9;

  h1 {
    font-size: 36px;
    font-weight: bold;
    color: #e53935;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    color: #555;
    margin-bottom: 40px;
  }

  button {
    font-size: 20px;
    padding: 15px 30px;
    background-color: #038c8c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #017276;
    }
  }
`;
