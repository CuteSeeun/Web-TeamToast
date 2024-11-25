import React, { useEffect } from 'react';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BsThreeDots } from "react-icons/bs";
import { AddIssueLink, IssueTable, SprintBox, SprintControls, SprintHeader, SprintName, SprintPeriod } from "./backlogstyle";
import { sprintState } from '../../recoil/atoms/sprintAtoms';

// 인터페이스 정의
interface Issue {
    id: number;
    title: string;
    status: string;
    priority: string;
    assignee: string;
}

interface SprintProps {
    spid: number;
}

// 스프린트 상태 ENUM 타입 정의
type SprintStatus = 'disabled' | 'enabled' | 'end';

interface Sprint {
    spid: number;
    spname: string;
    status: SprintStatus;
    goal: string;
    enddate: string;
    startdate: string;
    project_id: number;
}

const Sprint: React.FC<SprintProps> = ({ spid }) => {
    const sprints = useRecoilValue(sprintState);
    const setSprints = useSetRecoilState(sprintState);
    const sprint = sprints.find(s => s.spid === spid);

    useEffect(() => {
        console.log(sprint); // Sprint 데이터 확인
    }, [sprint]);

    const [issues, setIssues] = React.useState<Issue[]>([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await axios.get<Issue[]>('/api/sprint/' + spid + '/issues');
                setIssues(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchIssues();
    }, [spid]);

    const toggleStatus = () => {
        if (sprint) {
            let updatedStatus: SprintStatus;
            if (sprint.status === 'disabled') {
                updatedStatus = 'enabled';
            } else if (sprint.status === 'enabled') {
                updatedStatus = 'end';
            } else {
                updatedStatus = 'disabled';
            }

            const updatedSprint = { ...sprint, status: updatedStatus };
            setSprints(prevSprints =>
                prevSprints.map(s =>
                    s.spid === spid ? updatedSprint : s
                )
            );

            // 서버에 상태 변경 요청 (옵션)
            axios.put('/api/sprint/' + spid + '/status', { status: updatedSprint.status })
                .catch(error => console.error('Error updating status:', error));
        }
    };

    if (!sprint) {
        return null;
    }

    return (
        <SprintBox>
            <SprintHeader>
                <div>
                    <SprintName>{sprint.spname}</SprintName>
                    <SprintPeriod>스프린트 기간 ({sprint.startdate} ~ {sprint.enddate})</SprintPeriod>
                </div>
                <SprintControls>
                    <button onClick={toggleStatus}>
                        {sprint.status === 'disabled' ? '스프린트 활성' : sprint.status === 'enabled' ? '스프린트 완료' : '스프린트 종료됨'}
                    </button>
                    <BsThreeDots className="menu-icon" />
                </SprintControls>
            </SprintHeader>
            <IssueTable>
                <thead>
                    <tr>
                        <th>이슈</th>
                        <th>작업 상태</th>
                        <th>우선순위</th>
                        <th>담당자</th>
                    </tr>
                </thead>
                <tbody>
                    {issues.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#6c757d', userSelect: 'none' }}>
                                이슈를 이 영역으로 끌어와 스프린트를 채우세요.
                            </td>
                        </tr>
                    ) : (
                        issues.map(issue => (
                            <tr key={issue.id}>
                                <td>{issue.title}</td>
                                <td>{issue.status}</td>
                                <td>{issue.priority}</td>
                                <td>{issue.assignee}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </IssueTable>
            <AddIssueLink>+ 이슈 추가하기</AddIssueLink>
        </SprintBox>
    );
};

export default Sprint;
