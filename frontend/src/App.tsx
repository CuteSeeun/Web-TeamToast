import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import ActiveSprint from './pages/ActiveSprint/ActiveSprint';
import Backlog from './pages/Backlog/Backlog';
// import Chat from './pages/Chat/Chat';
import Dashboard from './pages/Dashboard/Dashboard';
// import IssueDetail from './pages/IssueDetail/IssueDetail';
import IssueList from './pages/IssueList/IssueList';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      {/* <ActiveSprint /> */}
      <Router>
        <Routes>
          <Route path="/" element={<ActiveSprint />} /> {/* 활성스프린트 경로 */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* 대시보드 경로 */}
          <Route path="/backlog" element={<Backlog />} /> {/* 백로그 경로 추가 */}
          <Route path="/issuelist" element={<IssueList />} /> {/* 이슈 목록 경로 추가 */}

          {/* <Route path="/issuedetail" element={<IssueDetail />} />  */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
