import React, { useEffect } from 'react';
import SBoard from './SBoard';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { allIssuesState } from '../../recoil/atoms/issueAtoms';
import { sprintState } from '../../recoil/atoms/sprintAtoms';
import { useParams } from 'react-router-dom';

const ActiveSprint: React.FC = () => {
  // // // 이슈와 스프린트 데이터 DB에서 불러오기
  // const [allIssues, setAllIssues] = useRecoilState(allIssuesState);
  // const [allSprint, setSprints] = useRecoilState(sprintState);
  // // url에서 pid 가져오기
  // const { pid } = useParams<{ pid: string }>(); // URL에서 `pid` 가져오기

  // useEffect(() => {
  //   const fetchAllData = async () => {
  //     try {
  //       if (!pid) {
  //         console.error('URL에서 pid를 가져오지 못했습니다.');
  //         return;
  //       }
  //       const projectId = parseInt(pid); // `pid`를 정수로 변환

  //       // 프로젝트 ID가 1인 전체 이슈 정보 가져오기
  //       const issuesResponse = await axios.get(`/sissue/project/${projectId}`);
  //       setAllIssues(issuesResponse.data);
  //       console.log('Fetched Issues:', issuesResponse.data); // 추가한 로그

  //       // 프로젝트 ID가 1인 전체 스프린트 정보 가져오기
  //       const sprintsResponse = await axios.get(`/sprint/project/${projectId}`);
  //       setSprints(sprintsResponse.data);
  //       console.log('Fetched Sprints:', sprintsResponse.data); // 추가한 로그
  //     } catch (error) {
  //       console.error('Error fetching all data:', error);
  //     }
  //   };
  //   fetchAllData();
  // }, [pid, allIssues, setAllIssues, allSprint, setSprints]);

  return (
    <SBoard />
  );
};

export default ActiveSprint;
