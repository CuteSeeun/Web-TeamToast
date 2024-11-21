import React from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/userAtoms';
import { Link } from 'react-router-dom';

const Intro = () => {

    const user = useRecoilValue(userState);

    const loginGo = () =>{
        alert('로그인 후 사용해주세요.');
    }

    return (
        <div>
            {user ? (
                <>
                <Link to='/space'>
                <button>{user.name}님 반갑습니다 !  스페이스로 이동</button>
                </Link>
                </>
            ):(
                <>
                <button onClick={loginGo}>TeamToast 시작하기</button>
                </>
            )
        }

        </div>
    );
};

export default Intro;