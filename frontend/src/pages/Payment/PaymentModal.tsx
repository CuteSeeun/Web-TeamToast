// import React from 'react';
// import { PaymentModalWrap } from './priceStyle';

// interface PaymentModalProps {
//     onClose: () => void;
//     onConfirm: () => void;
//     type: 'confirm' | 'complete';
// }

// const PaymentModal: React.FC<PaymentModalProps>  = ({ onClose, onConfirm , type }) => {

//     const modalContent = {
//         confirm: {
//           title: '결제 확인',
//           message: '결제를 진행하시겠습니까?',
//           confirmText: '확인',
//           cancelText: '취소'
//         },
//         complete: {
//           title: '결제 완료',
//           message: '결제가 성공적으로 완료되었습니다.\n이제 추가 사용자를 초대할 수 있습니다.',
//           confirmText: '사용자 초대하기',
//           cancelText: '취소'
//         }
//       };

//       const content = modalContent[type];

//     return (
//         <PaymentModalWrap>
//             <div className="modal-overlay">
//         <div className="modal-content">
//           <h3>{content.title}</h3>
//           <p>
//             {content.message}
//           </p>
//           <div className="button-group">
//             <button className="confirm" onClick={onConfirm}>
//               {content.confirmText}
//             </button>
//             <button className="cancel" onClick={onClose}>
//               {content.cancelText}
//             </button>
//           </div>
//         </div>
//       </div>
//         </PaymentModalWrap>
//     );
// };

// export default PaymentModal;
