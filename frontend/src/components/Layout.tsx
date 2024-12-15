// components/Layout.tsx
//세은
import Header from './MainHeader';
import { Outlet } from 'react-router-dom';

const Layout= () => {
    return (
        <>
            <Header/>
            <Outlet/>
            {/* 푸터 */}
        </>
    );
};

export default Layout;
