import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import ActiveSprint from './pages/ActiveSprint/ActiveSprint';
import Backlog from './pages/Backlog/Backlog';
import Chat from './pages/Chat/Chat';
import Dashboard from './pages/Dashboard/Dashboard';
import IssueDetail from './pages/IssueDetail/IssueDetail';
import IssueList from './pages/IssueList/IssueList';
import Layout from './components/Layout';
import Intro from './pages/Intro/Intro';
import Login from './pages/Login/Login';
import Join from './pages/Join/Join';
import RatePlan from './pages/Intro/RatePlan';
import SpaceAll from './pages/SpaceList/Space';
import ProjectList from './pages/ProjectList/ProjectList';
import OAuthCallback from './pages/Login/KakaoLogin';
import TeamMa from './pages/TeamList/TeamList';
import Payment from './pages/Payment/Payment';
import SpaceManagement from './pages/SpaceManagement/SpaceManagement';
import Profile from './pages/Profile/Profile';
import Plan from './pages/Plan/Plan';
import { userState } from './recoil/atoms/userAtoms';
import { useSetRecoilState } from 'recoil';
import axios from 'axios';
import { RecoilRoot } from 'recoil'; // RecoilRoot 추가

const App: React.FC = () => {

  const setUser = useSetRecoilState(userState);

  // 로그인정보 새로고침해도 유지
  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.get('http://localhost:3001/editUser/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          //서버에서 유저정보 보낸게 있으면 리코일에 유저정보 저장
          if (response.data && response.data.user) {
            setUser({
              uid: response.data.user.uid,
              uname: response.data.user.uname,
              email: response.data.user.email,
              isLoggedIn: true,
              token: token,
              role: 'member'
            });
          } else {
            // 없으면 리코일 null
            setUser(null);
          }
        } catch (error) {
          console.error('에러 발생', error);
          sessionStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserData();
  }, [setUser]);

  return (
    <>
      <RecoilRoot>
        <GlobalStyles />
        {/* <ActiveSprint /> */}
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Intro />} />

              {/* <Route index element={<ActiveSprint/>}/> */}


              <Route path="/login" element={<Login />} />
              <Route path="/join" element={<Join />} />
              <Route path="/rate" element={<RatePlan />} />
              <Route path="/space" element={<SpaceAll />} />
              <Route path="/projectlist" element={<ProjectList />} />
              <Route path="/oauth" element={<OAuthCallback />} />
              <Route path="/team" element={<TeamMa />} />
              <Route path="/activesprint" element={<ActiveSprint />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/backlog" element={<Backlog />} />
              <Route path="/issuelist" element={<IssueList />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/spacemanagement" element={<SpaceManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/issue/:id" element={<IssueDetail />} />
              <Route path="/plan" element={<Plan />} />
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </>
  );
};

export default App;
