// pages/ActiveSprint.tsx
import React, { useEffect } from 'react';
import SBoard from './SBoard';
import { useRecoilValue } from 'recoil';
import {sprintState} from '../../recoil/atoms/sprintAtoms';
import {allIssuesState} from '../../recoil/atoms/issueAtoms';

const ActiveSprint: React.FC = () => {
  // Recoil 상태 가져오기
  const sprints = useRecoilValue(sprintState);
  const allIssues = useRecoilValue(allIssuesState);

  // 상태 값 콘솔 출력
  useEffect(() => {
    console.log('불러온 이슈 데이터:', allIssues);
    console.log('불러온 스프린트 데이터:', sprints);
  }, [allIssues, sprints]);

  return (
        <SBoard />
  );
};

export default ActiveSprint;
