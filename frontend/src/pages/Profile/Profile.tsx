import React, { useEffect, useState } from 'react';
import { ProfileWrap } from './profileStyle';
import PasswordModal from './PasswordModal';
import {useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import axios from 'axios';
import AccessToken from '../Login/AccessToken';

interface FormData {
    uname : string;
    email : string;
}

const Profile:React.FC = () => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
    const user = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const [formData , setFormData] = useState<FormData>({
        uname: '',
        email: ''        
    });
    

    // user 정보가 업데이트 될때마다 input에 값 입력
    useEffect(()=>{
            if(user){
                setFormData({
                    uname: user?.uname || '',
                    email: user?.email || ''
                });
            }
    },[user]);
    
    // 값 변경 후 state에 저장
    const valueChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {name , value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    //프로필 정보 변경
    const editInfo = async()=>{
        const token = localStorage.getItem('token');

        try {
            const response = await AccessToken.post("http://localhost:3001/editUser/user/profile",{
                uname:formData.uname,
                email:formData.email
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            if(response.data && response.data.success){
                //recoil 상태 업데이트
                setUser({
                    uid: response.data.user.uid,  
                    uname: response.data.user.uname,
                    email: response.data.user.email,
                    isLoggedIn: true,  
                    // token: token || '',  
                    // role: user?.role || 'member'  
                });

                alert('수정 완료');
            }
            window.location.reload();

        } catch (error) {
            console.log('에러 발생',error);
            alert('수정 실패');
        }
    }

    return (
        <ProfileWrap>
              <h1>프로필</h1>
            
            <div className="profile-container">
                <div className="info-section">
                    <h2>회원정보</h2>
                    
                    <div className="form-row">
                        <label>이름</label>
                        <input type="text" name='uname' value={formData.uname} onChange={valueChange}  />
                    </div>

                    <div className="form-row">
                        <label>이메일</label>
                        <input type="email" name='email' value={formData.email} onChange={valueChange}  />
                    </div>

                    <div className="form-row">
                        <label>비밀번호</label>
                        <div className="password-group">
                            <button className="change-pwd-btn" 
                             onClick={() => setIsPasswordModalOpen(true)}>비밀번호 변경하기</button>
                            <button className="save-btn" onClick={editInfo}>수정</button>
                        </div>
                    </div>
                </div>
                    
                </div>


            <PasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </ProfileWrap>
    );
};

export default Profile;