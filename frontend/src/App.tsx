import React from 'react';
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


const App: React.FC = () => {
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
            <Route path="/plan" element={<Plan/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
