import React, { useState } from 'react';
import { TabSectionWrap } from './introStyle';

type TabKey = '회사 전체' | '마케팅' | '운영' | 'IT' | '제품';
type TabData = {
  [key in TabKey]: {
    image: string;
    title: string;
    description: string;
  };
};

const TabSection:React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('회사 전체');
  const tabData:TabData = {
    '회사 전체': {
      image: '/sprint.jpg',
      title: '회사 전체',
      description: '회사 전체에 대한 설명입니다. 회사 전반의 흐름을 이해하고 팀워크를 높이세요.',
    },
    마케팅: {
      image: '/sprint.jpg',
      title: '마케팅',
      description: '마케팅에 대한 설명입니다. 전략과 기획을 중심으로 성과를 높이세요.',
    },
    운영: {
      image: '/sprint.jpg',
      title: '운영',
      description: '운영에 대한 설명입니다. 효율적인 관리를 통해 더 나은 결과를 만들어 보세요.',
    },
    IT: {
      image:'/sprint.jpg',
      title: 'IT',
      description: 'IT에 대한 설명입니다. 기술을 활용해 혁신을 이끄세요.',
    },
    제품: {
      image: '/sprint.jpg',
      title: '제품',
      description: '제품에 대한 설명입니다. 고객 중심의 제품을 설계하세요.',
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
          <button className="cta-button">자세히 보기</button>
        </div>
      </div>
        </TabSectionWrap>
    );
};

export default TabSection;