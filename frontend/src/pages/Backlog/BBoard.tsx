import React, { useEffect } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { FaChevronDown } from 'react-icons/fa';
import { AddSprint, BoardContainer, BoardHeader, BoardTitle, Breadcrumb, Filters, Div } from './backlogstyle';
import Sprint from './SprintBox';
import { sprintState } from '../../recoil/atoms/sprintAtoms';
import { AxiosError } from 'axios';

const BBoard: React.FC = () => {
    const [sprints, setSprints] = useRecoilState(sprintState);

    useEffect(() => {
        const fetchSprints = async () => {
            try {
                const projectId = 1; // 실제 프로젝트 ID를 동적으로 할당해야 합니다.
                const url = '/sprint/' + projectId; // 상대 경로 사용
                console.log('Request URL:', url); // 요청 경로 로그 출력
                const response = await axios.get(url);
                console.log('API response:', response.data); // API 응답 로그 출력
                setSprints(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error:', error.message); // Error 객체의 경우
                } else {
                    console.error('An unknown error occurred:', error); // 알 수 없는 오류의 경우
                }
            }
        };
        fetchSprints();
    }, [setSprints]);

    return (
        <BoardContainer>
            <BoardHeader>
                <BoardTitle>백로그</BoardTitle>
                <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 백로그</Breadcrumb>
                <Filters>
                    <label>담당자 <FaChevronDown /></label>
                    <label>유형 <FaChevronDown /></label>
                    <label>상태 <FaChevronDown /></label>
                    <label>우선순위 <FaChevronDown /></label>
                </Filters>
            </BoardHeader>

            {sprints.filter(sprint => sprint.status !== 'end').map(sprint => ( // 필터링 추가
                <Sprint key={sprint.spid} spid={sprint.spid} />
            ))}

            <Div>
                <div style={{ marginTop: '20px', marginLeft: '1150px' }}>
                    <AddSprint>스프린트 생성</AddSprint>
                </div>
            </Div>
        </BoardContainer>
    );
};

export default BBoard;
