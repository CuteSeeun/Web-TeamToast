import styled from "styled-components";


export const IntroWrap = styled.div`
 background: linear-gradient(180deg, #60c1df, #84d1b6);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;

    .intro-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1200px;
    }

    .text-section {
        max-width: 50%;
        text-align: left;

        .main-title {
            font-size: 3rem;
            font-weight: bold;
            color: #fff;
            margin-bottom: 20px;
        }

        .sub-title {
            font-size: 1.2rem;
            color: #f0f0f0;
            margin-bottom: 30px;
        }

        .button-group {
            display: flex;
            gap: 10px;

            .primary-button {
                background-color: #4caf50;
                color: #fff;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
            }

            .secondary-button {
                background-color: #fff;
                color: #4caf50;
                padding: 10px 20px;
                border: 2px solid #4caf50;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
            }

            .primary-button:hover,
            .secondary-button:hover {
                opacity: 0.9;
            }
        }
    }

    .visual-section {
        position: relative;
        max-width: 50%;

        .floating-box {
            position: absolute;
            top: -30px;
            left: 20px;
            background: #fff;
            padding: 10px 20px;
            border-radius: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-size: 0.9rem;
            color: #555;
        }

        .ai-summary {
            position: absolute;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 250px;

            h3 {
                font-size: 1rem;
                color: #4caf50;
                margin-bottom: 10px;
            }

            p {
                font-size: 0.9rem;
                color: #555;
                margin-bottom: 5px;
            }
        }

        .background-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
    }
`

