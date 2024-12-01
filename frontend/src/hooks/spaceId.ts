import { useSetRecoilState } from "recoil";
import { spaceIdState } from "../recoil/atoms/spaceAtoms";
import { useEffect } from "react";
import axios from "axios";


export const useCurrentSpace = () => {
    const setCurrentSpaceId = useSetRecoilState(spaceIdState);
    
    
  useEffect(()=>{
    const CurrentSpace = async()=>{

      const storedSpaceId = localStorage.getItem("currentSpaceId");
      if (storedSpaceId) {
        setCurrentSpaceId(Number(storedSpaceId)); // 로컬 저장소 값으로 초기화
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/space/current",{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`,
          }
        });
        if(response.data.spaceId){
          setCurrentSpaceId(response.data.spaceId);
          localStorage.setItem("currentSpaceId", response.data.spaceId.toString()); 
          // 로컬 저장소에 저장
        }
      } catch (error) {
        console.error("현재 스페이스 아이디 에러 :",error);
      }
    };

    CurrentSpace();
  },[setCurrentSpaceId]);

  const selectSpace =async(spaceId:number)=>{
    try {
      await axios.post(
        "http://localhost:3001/space/select",
        {spaceId},
        {
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      setCurrentSpaceId(spaceId);
      localStorage.setItem("currentSpaceId", spaceId.toString()); // 로컬 저장소에 저장
    } catch (error) {
      console.error("Failed to select space ID:", error);
    }
  }
  return { selectSpace };
};
