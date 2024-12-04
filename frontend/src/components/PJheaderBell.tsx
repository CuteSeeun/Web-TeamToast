import axios from 'axios';
import React, { useState } from 'react';
import { GoBell } from "react-icons/go";
import { NotificationCard, NotificationsPopup } from '../styles/HeaderStyle';
import { Link } from 'react-router-dom';

type Notification = {
    id: number;
    projectTitle: string;
    issueTitle: string;
  };

const PJheaderBell = () => {
    const [notifications , setNotifications] = useState<Notification[]>([]); // 알림 데이터
    const [popOpen , setPopOpen] = useState(false);
    const [loading , setLoading] = useState(false);

    const dummyNotifications = [
        {
          id: 1,
          projectTitle: "프로젝트 A",
          issueTitle: "버그 수정 필요",
        },
        {
          id: 2,
          projectTitle: "프로젝트 B",
          issueTitle: "새로운 기능 추가 요청",
        },
        {
          id: 3,
          projectTitle: "프로젝트 C",
          issueTitle: "UI 개선 작업 필요",
        },
        {
          id: 4,
          projectTitle: "프로젝트 D",
          issueTitle: "테스트 코드 작성",
        },
      ];

    const toggleOnPopup = async() =>{
        setPopOpen(true);

        //팝업이 열릴 때만 서버에서 알림 데이터 가져옴
        if(notifications.length === 0){
            try {
                setLoading(true);
                const response = { data: dummyNotifications };
                setNotifications(response.data);
                setLoading(false);
            } catch (error) {
                console.error('데이터 없슴 : ',error);
                setLoading(false);
            }
        }
    }

    const toggleDownPopup = () => {
            setPopOpen(false); // 팝업 닫기
      };

    return (
        <div
        style={{ position: 'relative' }}
        onMouseEnter={toggleOnPopup} // 팝업 열림
        onMouseLeave={toggleDownPopup} // 팝업 닫힘
      >
        {/* 알림 아이콘 */}
        <div className="notification-icon">
          <GoBell className="icon-wrap" style={{cursor:'pointer'}}/>
          {notifications.length > 0 && (
            <span className="notification-badge"></span> // 알림 배지
          )}
        </div>
      {/* 알림 팝업 */}
      {popOpen && (
        <NotificationsPopup>
          {loading ? (
            <div className="loading-message">로딩 중...</div> // 로딩 메시지
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard key={notification.id}>
                <Link to={`/project/${notification.id}`}
                 style={{ textDecoration: 'none', color: 'inherit' }}
                >
                <div className="notification-header">
                    {notification.projectTitle}
                  </div>
                  <div className="notification-body">
                    {notification.issueTitle}
                  </div>
                  <div className="time-stamp">10분 전</div>
                </Link>
              </NotificationCard>
            ))
          ) : (
            <div className="empty-message">새로운 알림이 없습니다.</div>
          )}
        </NotificationsPopup>
      )}
    </div>
    );
};

export default PJheaderBell;