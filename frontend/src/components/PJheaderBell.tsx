import axios from 'axios';
import React, { useState } from 'react';
import { GoBell } from "react-icons/go";
import { NotificationCard, NotificationsPopup } from '../styles/HeaderStyle';
import { Link } from 'react-router-dom';

type Notification = {
  nid: number;           // 알림 ID
  projectTitle: string;  // 프로젝트 제목
  issueTitle: string;    // 이슈 제목
  issueDetail: string;   // 이슈 내용
  projectId: number;     // 프로젝트 ID
  issueId: number;       // 이슈 ID
};

const PJheaderBell = () => {
    const [notifications , setNotifications] = useState<Notification[]>([]); // 알림 데이터
    const [popOpen , setPopOpen] = useState(false);
    const [loading , setLoading] = useState(false);


    const toggleOnPopup = async() =>{
        setPopOpen(true);

        //팝업이 열릴 때만 서버에서 알림 데이터 가져옴
        if(notifications.length === 0){
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3001/issues/notifications');
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

    const notificationClick = async(nid:number , issueId: number)=>{
      try {
        const response = await axios.get(`http://localhost:3001/issues/notifications/${nid}`);
        const projectId = response.data.projectId;

        sessionStorage.setItem('pid',projectId);

        window.location.href = `/issue/${issueId}`;
      } catch (error) {
        console.log("프로젝트 ID 가져오는 중 오류 발생 :" , error);
      }
    }

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
          {/* {loading ? (
            <div className="loading-message">로딩 중...</div> // 로딩 메시지
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard key={notification.nid}>
                <Link to={`/issue/${notification.nid}`}
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
          )} */}
           {loading ? (
            <div className="loading-message">로딩 중...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard key={notification.nid}>
                <div
                  onClick={() => notificationClick(notification.nid, notification.issueId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="notification-header">{notification.projectTitle}</div>
                  <div className="notification-body">{notification.issueTitle}</div>
                  <div className="notification-detail">
                    {notification.issueDetail.length > 30
                      ? `${notification.issueDetail.substring(0, 30)}...`
                      : notification.issueDetail}
                  </div>
                </div>
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