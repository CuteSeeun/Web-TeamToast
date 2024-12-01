import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PassFindModal from './PassFindModal';
import { PassFindWrap } from '../../components/NavStyle';
import axios from 'axios';

const PassFind = () => {

    const [username, setUsername] = useState('');
   const [useremail, setUseremail] = useState('');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const navi = useNavigate();


   // 비밀번호 찾기 처리
   // 입력된 이름과 이메일로 사용자 있는지 확인
   // 사용자가 존재하면 비밀번호 변경 모달 열림
   const handleFindPassword = async() => {
    if(username === '' && useremail === ''){
        alert('이름과 이메일을 입력해주세요');
        return;
    }else if(username === ''){
        alert('이름을 입력해주세요');
        return;
    }else if(useremail === ''){
        alert('이메일을 입력해주세요');
        return;
    }

    try {
        // 서버로 유효성 검사 요청
        const response = await axios.post('http://localhost:3001/editUser/vaildaeUser', {
            uname :username,
            email :useremail,
        });

        if (response.data.valid) {
            setIsModalOpen(true);
        } else {
            alert('입력한 정보와 일치하는 사용자가 없습니다.');
        }
    } catch (error) {
        console.error('Error during user validation:', error);
        alert('입력한 정보와 일치하는 사용자가 없습니다.');
    }
};

// 새 비밀번호 변경 처리
// 모달에서 입력받은 새 비밀번호로 업데이트함
const handlePasswordChange = async (newPassword: string) => {
    try {

        const formData = new FormData();
        formData.append('username', username);
        formData.append('useremail', useremail);
        formData.append('newPassword', newPassword);

        // API 호출하여 비밀번호 변경
        const response = await axios.post('http://localhost:3001/editUser/findPass', {
            uname: username,  // 키 이름 변경
            email: useremail, // 키 이름 변경
            newpw: newPassword 
        });
        
        if (response.status === 200) {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navi('/login');
        }
    } catch (error) {
        console.error('비밀번호 변경 중 오류 발생:', error);
        alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
};


    return (
        <PassFindWrap>
            <div className="inner">
               <h2>비밀번호 찾기</h2>
               <div className="inputBox">
                   <input 
                       type="text" 
                       value={username} 
                       onChange={e => setUsername(e.target.value)}
                       placeholder='이름' 
                   />
               </div>
               <div className="inputBox">
                   <input 
                       type="email" 
                       value={useremail} 
                       onChange={e => setUseremail(e.target.value)}
                       placeholder='이메일' 
                   />
               </div>
               <div>
                   <button type='submit' className='find-btn' onClick={handleFindPassword}>비밀번호 찾기</button>
               </div>
                <div className="link-group">
                    <span onClick={() => navi('/login')}>로그인</span>
                    <span onClick={() => navi('/join')}>회원가입</span>
                </div>
           </div>

           <PassFindModal 
               isOpen={isModalOpen}
               onClose={() => setIsModalOpen(false)}
               onSubmit={handlePasswordChange}
           />
        </PassFindWrap>
    );
};

export default PassFind;