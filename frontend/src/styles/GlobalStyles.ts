// 2024-11-25 한채경
// GlobalStyles.ts

import { createGlobalStyle } from "styled-components";

// 스타일 초기화
const GlobalStyles = createGlobalStyle`

    html, body, div, span, applet, object, iframe,
    h1, h3 ,h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        font-size: 100%;
        font: inherit;
        font-family: Pretendard-Regular, Roboto-Regular;
        
    }
    h2 {
        font-family: Pretendard-SemiBold;
    }
    
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1.5;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    a{
        text-decoration:none;
        color: #4D4D4D;
    }

    /* Chrome, Edge, Safari */
    &::-webkit-scrollbar {
    width: 8px;
    }

    &::-webkit-scrollbar-thumb {
    background-color: #cccccc; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 모서리 둥글게 */
    }

    &::-webkit-scrollbar-thumb:hover {
    background-color: #888888; /* 호버 시 색상 */   
    }
`;

export default GlobalStyles;
