// 2024-12-05 한채경
// useProjectId.ts

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentProjectState } from '../recoil/atoms/projectAtoms';
import AccessToken from '../pages/Login/AccessToken';
import { Project } from '../types/projectTypes';

// projectId를 params에서 받아 유지하는 hook
const useCurrentProject = () => {
  const { pid } = useParams<{ pid: string }>();
  const [currentProject, setCurrentProject] = useRecoilState(currentProjectState);
  const [isLoading, setIsLoading] = useState(true);

  // Helper 함수: PID로 SID 가져오기
  const fetchSidByPid = async (pid: number): Promise<number | null> => {
    try {
      const { data } = await AccessToken.get(`http://localhost:3001/projects/find/one/${pid}`);
      if (data && data.length > 0) {
        console.log('Fetched SID:', data[0].space_id);
        return data[0].space_id;
      } else {
        console.error('SID를 찾을 수 없습니다.');
        return null;
      }
    } catch (err) {
      console.error('SID 요청 중 오류 발생:', err);
      return null;
    }
  };

  // Helper 함수: SID와 PID로 프로젝트 가져오기
  const fetchProjectBySidAndPid = async (sid: number, pid: number) => {
    try {
      const { data } = await AccessToken.get(`http://localhost:3001/projects/${sid}/${pid}`);
      console.log('Fetched Project:', data[0]);
      return data[0];
    } catch (err) {
      console.error('프로젝트 요청 중 오류 발생:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!pid) {
        console.error('PID가 제공되지 않았습니다.');
        setIsLoading(false);
        return;
      }

      try {
        const pidNumber = Number(pid);
        if (isNaN(pidNumber)) {
          console.error('PID가 유효하지 않습니다.');
          setIsLoading(false);
          return;
        }

        // Step 1: Get SID by PID
        const sid = await fetchSidByPid(pidNumber);
    
        if (!sid) {
          setIsLoading(false);
          return;
        }

        // Step 2: Get Project by SID and PID
        const data:Project = await fetchProjectBySidAndPid(sid, pidNumber);
        if (data) {
          setCurrentProject(data);
        }
      } catch (err) {
        console.error('프로젝트 데이터를 가져오는 중 오류 발생:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [pid, setCurrentProject]);

  return { currentProject, isLoading };
};

export default useCurrentProject;