// ModalStyle.ts
import styled from "styled-components";

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 필요에 따라 조정 */
`;

export const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 5px;
    position: relative;
    min-width: 300px;
    max-width: 500px; /* 최대 너비 설정 */
    width: 100%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* 모달 그림자 추가 */
`;


export const FormRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

export const FormGroup = styled.div`
    margin-bottom: 20px;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 5px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

export const Head = styled.h3`
    font-size: 2em; /* 원하는 크기로 설정 */
    margin-bottom: 20px; /* 원하는 여백 설정 */
    text-align: center; /* 필요한 경우 정렬 설정 */
`;
