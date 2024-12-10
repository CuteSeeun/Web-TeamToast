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
    console.log('DB에서 가져온 이슈, 활성스프린트에서 로딩:', allIssues);
    console.log('DB에서 가져온 스프린트, 활성스프린트에서 로딩:', sprints);
  }, [allIssues, sprints]);

  return (
        <SBoard />
  );
};

export default ActiveSprint;
