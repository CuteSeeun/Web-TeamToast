import React, { useState } from 'react';  // useEffect 추가
import { JoinWrap } from '../../components/NavStyle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

interface dataType {
    name:string,
    email:string,
    tel:string,
    userpw:string,
    userpwConfirm:string,
}

const Join: React.FC = () => {
    const [data, setData] = useState<dataType>({
        name: '',
        email: '',
        tel: '',
        userpw: '',
        userpwConfirm: '',
    });

    const [verificationCode,setVerificationCode] = useState<string>('');
    const [isCodeSent,setIsCodeSent] = useState<boolean>(false);
    const [isPhoneVerified,setIsPhoneVerified]=useState<boolean>(false);
    const [emailMessage, setEmailMessage] = useState<string>('');  // 이메일 관련 메시지
const [phoneMessage, setPhoneMessage] = useState<string>('');  // 휴대폰 관련 메시지
    const [eloading,setEloading]=useState<boolean>(false);
    const [ploading,setPloading]=useState<boolean>(false);
    const [passOk , setPassOk] = useState<boolean>(true);
    const [isEmailCheck , setIsEmailCheck] = useState<boolean>(false);
    const [isPhoneCheck , setIsPhoneCheck] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
      
        setData(prevData => {
            const newData = {
                ...prevData ,
                [name]:value
            };

            if(name === 'email'){
                setIsEmailCheck(false);
            }


            if(name === 'userpw' || name === 'userpwConfirm'){
                setPassOk(
                    name === 'userpw' ? value === newData.userpwConfirm : 
                    newData.userpw === value
                );
            }
            return newData;
        })
        

    };
    
    const vailPhoneNumber = (number:string)=>{
        return /^01[0-9]{8,9}$/.test(number.replace(/-/g, ''));
    };

    const checkPhone = async() =>{
        if(!vailPhoneNumber(data.tel)){
            setPhoneMessage('유효한 휴대폰 번호를 입력해주세요.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/phone/checkPhone',{
                tel:data.tel
            })
            if(response.data.isAvailable){
                setPhoneMessage('사용 가능한 휴대폰 번호입니다.');
                setIsPhoneCheck(true);
                await sendCode();
            }else{
                setPhoneMessage('이미 사용중인 휴대폰 번호입니다.');
            setIsPhoneCheck(false);
            setData(prev => ({...prev, tel: ''}));
            }
        } catch (error) {
            setPhoneMessage('휴대폰 번호 중복 확인 중 오류가 발생했습니다.');
        setIsPhoneCheck(false);
        }finally {
            setPloading(false);
        }

    }


    const sendCode = async()=>{

        try {
            setPloading(true);
            const response = await axios.post('http://localhost:3001/phone/auth/sendverification',{
                phoneNumber : data.tel
            })
            setPhoneMessage(response.data.message);
            setIsCodeSent(true);
        } catch (error) {
            setPhoneMessage('인증번호 발송에 실패했습니다.')
        }finally{
            setPloading(false);
        }
    };

    const VerifyCode = async()=>{
        try {
            setPloading(true);
            const response = await axios.post('http://localhost:3001/phone/auth/verifyPhone',{
                phoneNumber : data.tel,
                code : verificationCode
            });
            setPhoneMessage(response.data.message);
            setIsPhoneVerified(true);
        } catch (error) {
            setPhoneMessage('인증번호가 틀립니다.');
        }finally{
            setPloading(false);
        }
    };

    const checkEmail = async() =>{
        if(!data.email){
            alert('이메일을 입력해주세요');
            return;
        }
        try {
            setEloading(true);
            const response = await axios.post('http://localhost:3001/editUser/checkEmail',{
                email : data.email
            });
            if(response.data.isAvailable){
                setEmailMessage('사용 가능한 이메일입니다.');
                setIsEmailCheck(true);
            }else{
                setEmailMessage('이미 사용중인 이메일입니다.');
                setIsEmailCheck(false);
                setData(prev => ({...prev,email:''}));
            }
        } catch (error) {
            alert('이메일 중복 확인 중 오류가 발생했습니다.');
        }finally{
            setEloading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!isEmailCheck){
            alert('이메일 중복 확인을 해주세요.');
            return;
        }

        if(!isPhoneCheck) {
            alert('휴대폰 번호 중복 확인을 해주세요.');
            return;
        }

        if (data.userpw !== data.userpwConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!isPhoneVerified) {
            alert('휴대폰 인증을 완료해야 회원가입이 가능합니다.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/editUser/saveUser', {
                name: data.name,
                email: data.email,
                tel: data.tel,
                userpw: data.userpw,
            });
            console.log('회원가입 성공', response);
            alert('회원가입이 완료되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입 중 문제가 발생했습니다.');
        }
    };

    const kakaoLogin = async()=>{
        try {
            const response = await axios.get('http://localhost:3001/editUser/kakao-login');
            window.location.href = response.data.redirectUrl;
        } catch (error) {
            console.error('카카오 로그인 연결 실패 : ',error);
            alert('카카오 로그인 연결에 실패했습니다.');
        }
    }

    return (
        <JoinWrap>
            <div className="inner">
                <h2>회원가입</h2>
                <form onSubmit={handleSubmit}>

                    <div className="inputBox">
                        <span>이름</span>
                        <input
                            type="text"
                            name="name"
                            placeholder="이름을 입력해주세요"
                            value={data.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="inputBox">
                        <span>이메일</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일을 입력해 주세요"
                            value={data.email}
                            onChange={handleChange}
                            required
                        />
                        <button type="button"
                        onClick={checkEmail}
                        disabled={eloading}
                        >{eloading ? '확인중...':'중복확인'}</button>

                        {emailMessage && (
                            <span style={{
                                color: isEmailCheck ? 'green' : 'red', 
                                fontSize: '12px',
                                marginTop:'5px'
                            }}>
                                {emailMessage}
                            </span>
                        )}

                    </div>

                    <div className="inputBox">
                        <span>휴대폰번호</span>
                        <input
                            type="tel"
                            name="tel"
                            placeholder="휴대폰번호를 입력해 주세요 (-없이 숫자만)"
                            value={data.tel}
                            onChange={handleChange}
                            required
                        />
                        <button 
                            type="button"
                            onClick={checkPhone}
                            disabled={isPhoneVerified || ploading}
                        >
                            {ploading ? '처리중.....' : isPhoneVerified ? '인증완료' : '인증하기'}
                        </button>
                    </div>

                    {isCodeSent && !isPhoneVerified && (
                        <div className='inputbox'>
                            <span>인증번호 입력</span>
                            <input type="text" value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                            placeholder='인증번호를 입력해주세요'
                            maxLength={6}
                            />
                            <button type='button' onClick={VerifyCode} disabled={ploading}>
                                {ploading ? '확인 중...':'확인'}
                            </button>
                        </div>
                    )}
                    {phoneMessage && (
                        <div className='message'>
                            {phoneMessage}
                        </div>
                    )}

                    <div className="inputBox">
                        <span>비밀번호</span>
                        <input
                            type="password"
                            name="userpw"
                            placeholder="비밀번호를 입력해 주세요"
                            value={data.userpw}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="inputBox">
                        <span>비밀번호 확인</span>
                        <input
                            type="password"
                            name="userpwConfirm"
                            placeholder="비밀번호를 한 번 더 입력해 주세요"
                            value={data.userpwConfirm}
                            onChange={handleChange}
                            required
                        />
                        
                         {data.userpwConfirm &&(
                            <span style={{color: passOk ? 'green':'red' , fontSize:'12px' , marginTop:'5px'}}>
                                    {passOk ? '비밀번호가 일치합니다.':'비밀번호가 일치하지 않습니다.'}
                            </span>
                        )}
                    </div>

                    <button type="submit" className="submitBtn">회원가입</button>
                </form>

                <div className="social-section">
                    <div className="line-wrapper">
                        <div className="line"></div>
                        <span className='social-text'>또는</span>
                        <div className="line"></div>
                    </div>
                </div>

                <div className='social-media'>
                    <button type="button" className='kakaoBtn'
                    onClick={kakaoLogin}>
                        <i><RiKakaoTalkFill /></i>
                        <span>카카오 로그인/회원가입</span>
                    </button>
                    <button type="button" className='googleBtn'>
                        <i><FcGoogle /></i>
                        <span>구글 로그인/회원가입</span>
                    </button>
                </div>

                <div className='Join-pass'>
                    <p onClick={()=>navigate('/login')}>로그인</p>
                    <p onClick={()=>navigate('/pass')}>비밀번호 찾기</p>
                </div>

            </div>
        </JoinWrap>
    );
};

export default Join;