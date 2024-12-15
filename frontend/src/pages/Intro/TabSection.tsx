import React, { useState } from 'react';
import { TabSectionWrap } from './introStyle';

type TabKey = '스프린트' | '백로그' | '이슈' | '타임라인' | '채팅';
type TabData = {
  [key in TabKey]: {
    image: string;
    title: string;
    description: string;
  };
};

const TabSection:React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('스프린트');
  const tabData:TabData = {
    '스프린트': {
      image: '/sprint.jpg',
      title: '스프린트',
      description: `스프린트는 팀이 목표를 정해 일정 기간 동안 작업을 진행하는 단위로, 
      우선순위를 설정해 중요한 작업을 먼저 해결하고, 
      스프린트 보드에서 작업 상태를 한눈에 확인하며,
      완료된 작업과 남은 작업을 분석해 다음 스프린트를 준비합니다.`,
    },
    백로그: {
      image: '/sprint.jpg',
      title: '백로그',
      description:  `
      백로그는 스프린트에서 처리할 작업의 목록으로, 
      팀이 앞으로 진행할 이슈들을 관리하고 우선순위에 
      따라 정리하는 공간입니다.
      `,
    },
    이슈: {
      image: '/sprint.jpg',
      title: '이슈',
      description: `
      이슈는 프로젝트의 작업 단위로, 상태(백로그, 작업중, 완료 등), 
      우선순위, 담당자와 같은 세부 정보를 포함합니다. 
      작업 상태와 우선순위에 따라 필터링하거나 정렬할 수 있고, 
      이슈 상세 페이지에서는 제목, 설명, 스프린트, 
      파일 첨부와 같은 정보를 관리하며 댓글로 팀원과 소통할 수 있습니다.
      `,
    },
    타임라인: {
      image:'/sprint.jpg',
      title: '타임라인',
      description: '',
    },
    채팅: {
      image: '/sprint.jpg',
      title: '채팅',
      description: `
      채팅은 팀원 간의 실시간 커뮤니케이션을 돕는 기능으로, 
      채널별로 메시지를 나누어 관리할 수 있고 
      팀원과의 소통을 간편하게 진행할 수 있습니다. 
      메시지 입력 창을 통해 대화하고, 
      소켓 연결을 통해 실시간 업데이트가 이루어집니다.
      `,
    },
  };

  const handleTabClick = (tab:any) => {
    setActiveTab(tab);
  };
    return (
        <TabSectionWrap>
           <div className="tab-buttons">
        {Object.keys(tabData).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${tab === activeTab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="content-section">
        <div className="image-container">
          <img src={tabData[activeTab].image} alt={tabData[activeTab].title} />
        </div>
        <div className="text-container">
          <h2>{tabData[activeTab].title}</h2>
          <p>{tabData[activeTab].description}</p>
          {/* <button className="cta-button">자세히 보기</button> */}
        </div>
      </div>
        </TabSectionWrap>
    );
};

export default TabSection;