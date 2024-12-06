import Payment from "./pages/Payment/Payment";
import Success from "./pages/Payment/Success";
import Fail from "./pages/Payment/Fail";
import CardChangeSuccess from "./pages/Payment/CardChangeSuccess";
import CardChangeFail from "./pages/Payment/CardChangeFail";



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
import TeamManagement from "./pages/TeamList/TeamManagement";
import SpaceManagement from './pages/SpaceManagement/SpaceManagement';
import Profile from './pages/Profile/Profile';
import Plan from './pages/Plan/Plan';
import { useAuth } from './hooks/useAuth';


const App: React.FC = () => {
  useAuth(); // 로그인 상태 관리 

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
            <Route path="/projectlist/:sid" element={<ProjectList/>}/>
            <Route path="/oauth" element={<OAuthCallback/>}/>
            <Route path="/team" element={<TeamManagement />} /> 
            <Route path="/activesprint/:pid" element={<ActiveSprint/>}/>
            <Route path="/dashboard/:pid" element={<Dashboard/>}/>
            <Route path="/backlog/:pid" element={<Backlog/>}/>
            <Route path="/issuelist/:pid" element={<IssueList/>}/>
            <Route path="/chat" element={<Chat/>}/>
            <Route path="/payment" element={<Payment/>}/>
            <Route path="/spacemanagement" element={<SpaceManagement/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/issue/:id" element={<IssueDetail/>}/>
            <Route path="/plan" element={<Plan/>}/>
            {/* <Route path="/payment" element={<Payment />} /> */}
            <Route path="/card-change-success" element={<CardChangeSuccess />} />
            <Route path="/card-change-fail" element={<CardChangeFail />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fail" element={<Fail />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
