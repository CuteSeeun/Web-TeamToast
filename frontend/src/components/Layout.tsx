// components/Layout.tsx
//세은
import React from 'react';
import Header from './MainHeader';
import Sidebar from './Sidebar';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

// const LayoutContainer = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// const MainContent = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   overflow: auto;
// `;

// interface LayoutProps {
//     children: React.ReactNode;
// }

const Layout= () => {
    return (
        <div>
            <Header/>
            <Outlet/>
            {/* 푸터 */}
        </div>
    );
};

export default Layout;
