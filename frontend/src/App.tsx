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
import PassFind from './pages/Login/PassFind';
import { userState } from './recoil/atoms/userAtoms';
import { useSetRecoilState } from 'recoil';
import axios from 'axios';


const App: React.FC = () => {

  const setUser = useSetRecoilState(userState);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('token');
      console.log('Token in App:', token); // 토큰 확인
      if (token) {
        try {
          const response = await axios.get('http://localhost:3001/editUser/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          console.log('API Response:', response.data);
          
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
      <GlobalStyles />
      {/* <ActiveSprint /> */}
      <Router>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Intro/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/join" element={<Join/>}/>
            <Route path="/rate" element={<RatePlan/>}/>
            <Route path="/space" element={<SpaceAll/>}/>
            <Route path="/projectlist" element={<ProjectList/>}/>
            <Route path="/oauth" element={<OAuthCallback/>}/>
            <Route path="/team" element={<TeamMa/>}/>
            <Route path="/activesprint" element={<ActiveSprint/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/backlog" element={<Backlog/>}/>
            <Route path="/issuelist" element={<IssueList/>}/>
            <Route path="/chat" element={<Chat/>}/>
            <Route path="/payment" element={<Payment/>}/>
            <Route path="/spacemanagement" element={<SpaceManagement/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/issue/:id" element={<IssueDetail/>}/>
            <Route path="/plan" element={<Plan/>}/>
            <Route path="/pass" element={<PassFind/>}/>
            
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
