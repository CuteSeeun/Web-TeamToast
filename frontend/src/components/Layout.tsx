// components/Layout.tsx
//세은
import Header from './MainHeader';
import { Outlet } from 'react-router-dom';

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
