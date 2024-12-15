// pages/ActiveSprint.tsx
import React, { useEffect } from 'react';
import SBoard from './SBoard';
import { useRecoilValue } from 'recoil';
import {sprintState} from '../../recoil/atoms/sprintAtoms';
import {allIssuesState} from '../../recoil/atoms/issueAtoms';

const ActiveSprint: React.FC = () => {
  // Recoil 상태 가져오기
  const sprints = useRecoilValue(sprintState);//Sidebar가 가져온 스프린트 데이터
  const allIssues = useRecoilValue(allIssuesState);//Sidebar가 가져온 이슈 데이터

  // 상태 값 콘솔 출력
  useEffect(() => {
    console.log('이슈 아톰 값:', allIssues);
    console.log('스프린트 아톰 값:', sprints);
  }, [allIssues, sprints]);

  return (
      <div style={{background:'#999',height:'100%' , overflow:'hidden'}}>
        <SBoard />
      </div>
  );
};

export default ActiveSprint;
