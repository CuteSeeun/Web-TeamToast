import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    uid: number;
}


// 리프레시용 별도 인스턴스
const refreshAxios = axios.create({
    baseURL: 'http://localhost:3001',
});

const AccessToken = axios.create({ // axios 이스턴스 생성
    baseURL: 'http://localhost:3001', // baseURL = api요청의 기본 경로 설정
});

// 토큰 리프레시 진행 중인지 확인하는 플래그
let isRefreshing = false;


AccessToken.interceptors.request.use(
    async(config)=>{
        let accessToken = localStorage.getItem('accessToken');

        //accessToken이 필요하면 요청 헤더 추가
        if (accessToken) {

             // Authorization 헤더 추가
                config.headers.Authorization = `Bearer ${accessToken}`;

            const { exp,uid } = jwtDecode<JwtPayload>(accessToken);
            const now = Date.now() / 1000;

            // console.log('토큰 만료까지 남은 시간:', exp - now, '초');

            // 토큰 만료 90초전에 갱신
            if (exp - now <= 90 && !isRefreshing) {
                isRefreshing = true;

                console.log("Attempting to refresh token...");
                try {
                    const response = await refreshAxios.post("/editUser/refresh/token",{uid}
                      
                    );
                    console.log("Token refresh response:", response.data);
                    // 새로운 Access Token 저장
                    const { accessToken: newAccessToken } = response.data;

                    if (newAccessToken) {
                        localStorage.setItem("accessToken", newAccessToken);
                        config.headers.Authorization = `Bearer ${newAccessToken}`;
                        accessToken = newAccessToken;
                    }

                } catch (error) {
                    console.error("Access Token 재발급 실패:", error);
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                    throw error;
                }finally{
                    isRefreshing = false;
                }
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response 인터셉터 추가
AccessToken.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 재시도하지 않은 요청일 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) throw new Error('No access token');

                const { uid } = jwtDecode<JwtPayload>(accessToken);
                const refreshResponse = await refreshAxios.post("/editUser/refresh/token", { uid });
                
                const { accessToken: newAccessToken } = refreshResponse.data;
                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    AccessToken.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return AccessToken(originalRequest);  // 원래 요청 재시도
                }
            } catch (refreshError) {
                console.error("토큰 갱신 실패:", refreshError);
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default AccessToken;