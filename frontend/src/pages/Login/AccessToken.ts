import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    uid: number;
}

const AccessToken = axios.create({ // axios 이스턴스 생성
    baseURL: 'http://localhost:3001', // baseURL = api요청의 기본 경로 설정
});


AccessToken.interceptors.request.use(
    async(config)=>{
        let accessToken = localStorage.getItem('accessToken');

        //accessToken이 필요하면 요청 헤더 추가
        if (accessToken) {
            const { exp,uid } = jwtDecode<JwtPayload>(accessToken);
            const now = Date.now() / 1000;

            console.log('토큰 만료까지 남은 시간:', exp - now, '초');

            // 토큰 만료 30초전에 갱신
            if (exp - now <= 30) {
                
                try {
                    const response = await axios.post("http://localhost:3001/editUser/refresh/token",{
                        uid},
                        {
                            headers:{
                                Authorization: `Bearer ${accessToken}`
                            }
                        }
                    );
                    
                    // 새로운 Access Token 저장
                    const newAccessToken = response.data.accessToken;

                    if (newAccessToken) {
                        localStorage.setItem("accessToken", newAccessToken);
                        accessToken = newAccessToken;
                    }

                } catch (error) {
                    console.error("Access Token 재발급 실패:", error);
                    localStorage.removeItem("accessToken");
                    accessToken = null;
                }
            }

            // Authorization 헤더 추가
                config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default AccessToken;