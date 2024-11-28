// SprintBox.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BsThreeDots } from "react-icons/bs";
import { AddIssueLink, IssueTable, SprintControls, SprintHeader, SprintName, SprintPeriod, StyledSprintBox } from "./backlogstyle";
import { sprintState, sortedSprintsState, filterState } from '../../recoil/atoms/sprintAtoms';
import DragItem from './DragItem';
import { useDrop } from 'react-dnd';

interface Issue {
    id: number;
    isid: number;
    title: string;
    type: string;
    priority: string;
    manager: string;
    status: string;
    sprint_id?: number | null;
    project_id?: number;
    created_by?: string;
    detail?: string;
    file?: string;
}


interface SprintProps {
    sprint: Sprint;
    onDrop: (issue: Issue, newSprintId: number | null) => void; // newSprintId 타입으로 수정
}

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

const SprintBox: React.FC<SprintProps> = ({ sprint, onDrop }) => {
    const setSprints = useSetRecoilState(sprintState);
    const sortedSprints = useRecoilValue(sortedSprintsState);
    const filter = useRecoilValue(filterState);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const projectId = sprint.project_id;
                const response = await axios.get<Issue[]>(`/issue/${projectId}/${sprint.spid}`);
                setIssues(response.data);
            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };
        fetchIssues();
    }, [sprint]);

    useEffect(() => {
        const active = sortedSprints.find(s => s.status === 'enabled');
        setActiveSprint(active || null);
    }, [sortedSprints]);

    const toggleStatus = async () => {
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
                s.spid === sprint.spid ? updatedSprint : s
            )
        );

        try {
            await axios.put(`/sprint/${sprint.spid}/status`, { status: updatedSprint.status });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const shouldHideButton = activeSprint !== null && activeSprint.spid !== sprint.spid;

    const filteredIssues = issues.filter(issue =>
        (!filter.manager || issue.manager === filter.manager) &&
        (!filter.status || issue.status === filter.status) &&
        (!filter.priority || issue.priority === filter.priority)
    );


    const [{ isOver }, drop] = useDrop({
        accept: 'ITEM',
        drop: (item: Issue) => onDrop(item, sprint.spid), // 스프린트의 ID를 전달합니다.
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <StyledSprintBox ref={drop} style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}>
            <SprintHeader>
                <div>
                    <SprintName>{sprint.spname}</SprintName>
                    <SprintPeriod>스프린트 기간 ({sprint.startdate} ~ {sprint.enddate})</SprintPeriod>
                </div>
                <SprintControls>
                    {!shouldHideButton && (
                        <button onClick={toggleStatus}>
                            {sprint.status === 'disabled' ? '스프린트 활성' : sprint.status === 'enabled' ? '스프린트 완료' : '스프린트 종료됨'}
                        </button>
                    )}
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
                    {filteredIssues.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#6c757d', userSelect: 'none' }}>
                                이슈를 이 영역으로 끌어와 스프린트를 채우세요.
                            </td>
                        </tr>
                    ) : (
                        filteredIssues.map(issue => (
                            <DragItem key={issue.id} issue={issue} />
                        ))
                    )}
                </tbody>
            </IssueTable>
            <AddIssueLink>+ 이슈 추가하기</AddIssueLink>
        </StyledSprintBox>
    );
};



export default SprintBox;
