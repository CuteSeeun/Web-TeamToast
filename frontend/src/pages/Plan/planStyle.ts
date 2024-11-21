import styled from "styled-components";

export const PlanWrap = styled.div`
padding: 20px;
width: 1400px;
margin: 60px auto;

.plan-section {
  margin-top: 20px;
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

  &.selected {
    border-color: #038c8c;
    background:rgba(3,140,140,0.2);

    .plan-info {
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

  }

  input[type="radio"] {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}

.plan-info {
  h3 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  p {
    color: #666;
    margin: 5px 0;

    &.price {
      font-size: 18px;
      color: #000;
      margin-top: 15px;
    }
  }
}

.calculator {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;

  h3 {
    margin-bottom: 20px;
  }

  .calc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    input {
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

  .change-btn {
    width: 100%;
    padding: 12px;
    background: #038c8c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #017276;
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
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  
  h3 {
    font-size: 18px;
    font-weight: 500;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #e7e7e7;
    text-align: left;
  }

  .modal-content {
    text-align: left;
    margin-bottom: 24px;

    p {
      color: #666;
      margin-bottom: 8px;
      line-height: 1.1;
      font-size: 14px;
    }
  }

  .button-group {
    display: flex;
    gap: 8px;
    justify-content: flex-end;

    button {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;

      &.confirm {
        background: white;
        color: #666;
        border: 1px solid #e5e7eb;

        &:hover {
          background: #f9fafb;
        }
      }

      &.maximize {
        background: #038c8c;
        color: white;
        border: none;

        &:hover {
          background: #017276;
        }
      }
    }
  }
}
`