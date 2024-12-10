import axios from 'axios';
import { SetterOrUpdater } from 'recoil';

export interface UserState {
    uid: number | null;
    uname: string | null;
    email: string | null;
    isLoggedIn: boolean;
  }

export const fetchUserData = async (setUser: SetterOrUpdater<UserState | null>) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    try {
      const response = await axios.get('http://localhost:3001/editUser/me',{
        headers: { Authorization: `Bearer ${accessToken}` }, 
      });
      if (response.data?.user) {
        setUser({
          uid: response.data.user.uid,
          uname: response.data.user.uname,
          email: response.data.user.email,
          isLoggedIn: true,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('에러 발생:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  } else {
    setUser(null);
  }
};