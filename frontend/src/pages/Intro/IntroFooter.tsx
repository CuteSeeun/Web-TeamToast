import React from 'react';
import { IntroFooterWrap } from './introStyle';
import { ReactComponent as LogoIcon } from '../../assets/icons/Logo.svg';

const IntroFooter = () => {
    return (
        <IntroFooterWrap>
             {/* 상단 정보 */}
      <div className="footer-top">
        <div className="footer-info">
          <p><strong>(주)TeamToast</strong></p>
          <p>서비스 문의 Call: 010-6543-9118 | E-Mail: support@teamtoast.com</p>
          <p>(주)TeamToast는 협업툴 솔루션 공급 및 교육 지원을 전문으로 하고 있습니다.</p>
        </div>
        <div className="footer-links">
          <a href="/about">회사소개</a>
          <a href="/terms">이용약관</a>
          <a href="/privacy">개인정보 보호방침</a>
          <a href="/contact">이메일 무단수집 거부</a>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="footer-bottom">
        <p>Copyright © TeamToast Co., Ltd. All rights reserved.</p>
        <div className="footer-partners">
        <LogoIcon className="footer-logo" aria-label="TeamToast Partner"  />
          {/* <img src="/images/pipedrive-logo.png" alt="Pipedrive Solution Provider" /> */}
        </div>
      </div>

      {/* 플로팅 버튼 */}
      <button className="floating-button">1:1 문의하기</button>
        </IntroFooterWrap>
    );
};

export default IntroFooter;