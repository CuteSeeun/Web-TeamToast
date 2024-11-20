import styled from 'styled-components';

// export const RatePlanWrap = styled.div`
//  background-color: #f9f9f9;
//    display: flex;
//    flex-direction: column;
//    align-items: center;
//    padding: 20px;
//    margin-top: 100px;

//    .maincontainer {
//        display: flex;
//        gap: 40px;
//        justify-content: center;
//        width: 100%;
//        max-width: 1200px;
//    }

// `
export const PriceCard = styled.div`
border: 1px solid #ccc;
   border-radius: 12px;
   width: 350px;
   height: 500px;
   margin-top: 50px;
   background-color: #fff;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   padding: 20px;
   text-align: center;

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
       background-color: #00597d;
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
       padding-left: 30px;

       span {
           font-weight: 600;
       }
   }

   .description {
       margin-top: 20px;
       font-size: 15px;
       color: #555;
   }

`

export const PaymentWrap = styled.div`
  .container {
   max-width: 600px;
   margin: 0 auto;
   padding: 24px;
   background: white;
 }

 h2 {
   text-align: center;
   font-size: 24px;
   font-weight: bold;
   margin-bottom: 32px;
 }

 .card {
   background: white;
   border: 1px solid #e5e7eb;
   border-radius: 8px;
   padding: 32px;
   margin-bottom: 32px;
 }

 .subtitle {
   font-size: 18px;
   font-weight: bold;
   margin-bottom: 16px;
 }

 .plan-info {
   margin-bottom: 40px;
   
   p {
     margin-bottom: 10px;
     line-height: 1.6;
   }
 }

 .section {
   h4 {
     font-weight: bold;
     margin-bottom: 24px;
   }
 }

 .flex-box {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 16px;
 }

 .input-with-unit {
   display: flex;
   align-items: center;
   gap: 8px;
   
   input {
     width: 100px;
     text-align: right;
   }
 }

 input {
   padding: 8px 12px;
   border: 1px solid #e5e7eb;
   border-radius: 4px;
   &:focus {
     outline: none;
     border-color: #2563eb;
   }
   &.medium {
     width: 120px;
   }
 }

 .divider {
   border-top: 1px solid #e5e7eb;
   border-bottom: 1px solid #e5e7eb;
   padding: 16px 0;
   margin: 24px 0;

   .mute {
     color: #6b7280;
     margin-bottom: 0;
   }
 }

 .price {
   font-size: 16px;
 }

 .total {
   margin-top: 24px;
   font-weight: bold;
   font-size: 18px;

   .flex-box {
     margin-bottom: 0;
   }
 }

 label {
   display: block;
   margin-bottom: 8px;
 }

 .input-group {
   margin-bottom: 16px;
 }

 .button-group {
   display: flex;
   gap: 16px;
   margin-top: 32px;
 }

 button {
   flex: 1;
   padding: 12px;
   border-radius: 4px;
   font-weight: 500;
   cursor: pointer;

   &.outline {
     background: white;
     border: 1px solid #e5e7eb;
     color: #374151;
     &:hover {
       background: #f9fafb;
     }
   }

   &.primary {
     background: #2563eb;
     border: 1px solid #2563eb;
     color: white;
     &:hover {
       background: #1d4ed8;
     }
   }
 }

`

export const PaymentModalWrap = styled.div`
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
    padding: 40px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    text-align: center;
  }

  h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  p {
    color: #6b7280;
    margin-bottom: 32px;
  }

  .button-group {
    display: flex;
    gap: 12px;
  }

  button {
    flex: 1;
    padding: 12px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;

    &.confirm {
      background: #038c8c;
      border: 1px solid #038c8c;
      color: white;
      &:hover {
        background: #1d4ed8;
      }
    }

    &.cancel {
      background: white;
      border: 1px solid #e5e7eb;
      color: #374151;
      &:hover {
        background: #f9fafb;
      }
    }
  }
`