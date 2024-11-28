// BBoard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue, useRecoilState } from 'recoil';
import { AddSprint, BoardContainer, BoardHeader, BoardTitle, Breadcrumb, Filters, Div, StyledSprintBox, SprintHeader, SprintName, IssueTable } from './backlogstyle';
import SprintBox from './SprintBox';
import { sprintState, sortedSprintsState, filterState } from '../../recoil/atoms/sprintAtoms';
import DragItem from './DragItem';
import { useDrop } from 'react-dnd';

interface Issue {
    id: number;
    isid: number; // isid 속성 추가
    title: string;
    type: string;
    priority: string;
    manager: string;
    status: string;
    sprint_id?: number | null; // Optional 속성으로 추가합니다.
    project_id?: number;
    created_by?: string;
    detail?: string;
    file?: string;
}


interface Manager {
    manager: string;
}

const BBoard: React.FC = () => {
    const [sprints, setSprints] = useRecoilState(sprintState);
    const sortedSprints = useRecoilValue(sortedSprintsState);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [filter, setFilter] = useRecoilState(filterState);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectId = 1;

                const sprintResponse = await axios.get(`http://localhost:3001/sprint/${projectId}`);
                setSprints(sprintResponse.data);

                const issueResponse = await axios.get(`http://localhost:3001/issue/backlog/${projectId}`);
                setIssues(issueResponse.data);

                const managerResponse = await axios.get(`http://localhost:3001/user/project/${projectId}/managers`);
                setManagers(managerResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [setSprints]);

    const filteredIssues = issues.filter(issue =>
        (!filter.manager || issue.manager === filter.manager) &&
        (!filter.status || issue.status === filter.status) &&
        (!filter.priority || issue.priority === filter.priority)
    );

    const onDrop = async (issue: Issue, newSprintId: number | null) => {
        try {
            console.log('Sending request to update issue sprint_id to', newSprintId);
            await axios.put(`/issue/${issue.isid}`, { sprint_id: newSprintId }); // 서버 요청
            console.log(`Issue ${issue.isid} sprint_id updated to ${newSprintId} in database`);
    
            const updatedIssues = issues.map(existingIssue => {
                if (existingIssue.isid === issue.isid) {
                    console.log(`Issue ${issue.isid} dropped into sprint ${newSprintId}`);
                    return { ...existingIssue, sprint_id: newSprintId }; // 서버 응답 후 상태 업데이트
                }
                return existingIssue;
            });
            setIssues(updatedIssues); // 상태 업데이트
        } catch (error) {
            console.error(`Error updating issue ${issue.isid} sprint_id:`, error);
        }
    };
    
    const [{ isOver }, drop] = useDrop({
        accept: 'ITEM',
        drop: (item: Issue) => onDrop(item, null), // 백로그로 드롭 시 스프린트 ID를 null로 설정
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    

    return (
        <BoardContainer>
            <BoardHeader>
                <BoardTitle>백로그</BoardTitle>
                <Breadcrumb>프로젝트 &gt; 중고차 직거래 &gt; 백로그</Breadcrumb>
                <Filters>
                    <label>
                        <select
                            value={filter.manager}
                            onChange={e => setFilter({ ...filter, manager: e.target.value })}
                        >
                            <option value="">담당자</option>
                            {managers.map(manager => (
                                <option key={manager.manager} value={manager.manager}>{manager.manager}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <select
                            value={filter.status}
                            onChange={e => setFilter({ ...filter, status: e.target.value })}
                        >
                            <option value="">상태</option>
                            <option value="백로그">백로그</option>
                            <option value="작업중">작업중</option>
                            <option value="개발완료">개발완료</option>
                            <option value="QA완료">QA완료</option>
                        </select>
                    </label>
                    <label>
                        <select
                            value={filter.priority}
                            onChange={e => setFilter({ ...filter, priority: e.target.value })}
                        >
                            <option value="">우선순위</option>
                            <option value="높음">높음</option>
                            <option value="보통">보통</option>
                            <option value="낮음">낮음</option>
                        </select>
                    </label>
                </Filters>
            </BoardHeader>

            {sortedSprints.filter(sprint => sprint.status !== 'end').map(sprint => (
                <SprintBox key={sprint.spid} sprint={sprint} onDrop={onDrop} />
            ))}

            <Div>
                <div style={{ marginTop: '20px', marginLeft: '1150px' }}>
                    <AddSprint>스프린트 생성</AddSprint>
                </div>
            </Div>
            <StyledSprintBox ref={drop} style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}>
                <SprintHeader>
                    <div>
                        <SprintName>백로그</SprintName>
                    </div>
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
                                    이슈를 이 영역으로 끌어와 백로그를 채우세요.
                                </td>
                            </tr>
                        ) : (
                            filteredIssues.map(issue => (
                                <DragItem key={issue.id} issue={issue} />
                            ))
                        )}
                    </tbody>
                </IssueTable>
            </StyledSprintBox>
        </BoardContainer>
    );
};

export default BBoard;
