import styled from "styled-components";

export const ProjectInviteWrap = styled.div`
 position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .modal-content {
        background: white;
        padding: 24px;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;

        h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            color: #333;
        }

        .input-group {
            margin-bottom: 20px;

            label {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                color: #666;
            }

            input {
                width: 100%;
                padding: 10px;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
                font-size: 14px;

                &:focus {
                    outline: none;
                    border-color: #00A3BF;
                }

                &::placeholder {
                    color: #9ca3af;
                }
            }

            .select-wrapper {
                position: relative;
                
                select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                    font-size: 14px;
                    appearance: none;
                    background: white;
                    cursor: pointer;

                    &:focus {
                        outline: none;
                        border-color: #00A3BF;
                    }
                }

                &::after {
                    content: '';
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid #666;
                    pointer-events: none;
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

                &.cancel {
                    background: white;
                    border: 1px solid #e5e7eb;
                    color: #666;

                    &:hover {
                        background: #f9fafb;
                    }
                }

                &.invite {
                    background: #038c8c;
                    border: none;
                    color: white;

                    &:hover {
                        background: #017276;
                    }
                }
            }
        }
    }

`