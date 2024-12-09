import { useCallback } from "react";
import AccessToken from "../pages/Login/AccessToken";


export const useCurrentSpace = () => {
  
  // 새로고침 시 저장된 스페이스 복구
  const loadCurrentSpace = useCallback(async () => {
    try {
        const response = await AccessToken.get("/space/current-space");
            // setCurrentSpaceId(response.data.spaceId);
            localStorage.setItem('currentSpaceUuid', response.data.uuid);
    } catch (error) {
        console.error("현재 스페이스 복구 실패:", error);
    }
}, []);
// }, [setCurrentSpaceId]);

  
  // 스페이스 선택 로직
  const selectSpace = useCallback(async (uuid: string) => {
    try {
        await AccessToken.post("/space/select-space", { uuid });
        localStorage.setItem('currentSpaceUuid', uuid); // 선택한 UUID 저장
    } catch (error) {
        console.error("스페이스 선택 실패:", error);
    }
}, []);

  return { selectSpace,loadCurrentSpace};

};
