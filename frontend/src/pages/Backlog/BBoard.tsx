import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AddSprint, BoardContainer, BoardHeader, BoardTitle, Breadcrumb, Filters, Div, StyledSprintBox, SprintHeader, SprintName, IssueTable } from './backlogstyle';
import SprintBox from './SprintBox';
import { sprintState, sortedSprintsState, filterState, Sprint } from '../../recoil/atoms/sprintAtoms';
import { issueListState, backlogState, Issue, Type } from '../../recoil/atoms/issueAtoms';
import { useDrop } from 'react-dnd';
import DragItem from './DragItem';

const BBoard: React.FC = () => {
    const [sprints, setSprints] = useRecoilState(sprintState);
    const sortedSprints = useRecoilValue(sortedSprintsState);
    const [issues, setIssues] = useRecoilState(issueListState);
    const [backlog, setBacklog] = useRecoilState<Issue[]>(backlogState);
    const [managers, setManagers] = useState<string[]>([]);
    const [filter, setFilter] = useRecoilState(filterState);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectId = 1;

                const sprintResponse = await axios.get(`http://localhost:3001/sprint/${projectId}`);
                setSprints(sprintResponse.data);

                const issueResponse = await axios.get(`http://localhost:3001/issue/backlog/${projectId}`);
                const issuesData = issueResponse.data.map((issue: any) => {
                    const manager = typeof issue.manager === 'object' && issue.manager !== null ? issue.manager.manager : (issue.manager || '담당자 없음');
                    return {
                        ...issue,
                        type: Type[issue.type as keyof typeof Type] || '작업',
                        manager: manager
                    };
                });

                const issuesBySprint: { [key: number]: Issue[] } = {};
                const backlogData: Issue[] = [];
                issuesData.forEach((issue: Issue) => {
                    if (issue.sprint_id === null) {
                        backlogData.push(issue);
                    } else {
                        if (!issuesBySprint[issue.sprint_id]) {
                            issuesBySprint[issue.sprint_id] = [];
                        }
                        issuesBySprint[issue.sprint_id].push(issue);
                    }
                });

                setIssues(issuesBySprint);
                setBacklog(backlogData);

                const managerResponse = await axios.get(`http://localhost:3001/user/project/${projectId}/managers`);
                const managersData = managerResponse.data.map((manager: any) => {
                    const managerStr = typeof manager === 'object' && manager !== null ? manager.manager : manager;
                    return managerStr;
                });
                setManagers(managersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [setSprints, setIssues, setBacklog, setManagers]);

    const onDrop = async (issue: Issue, newSprintId: number | null) => {
        try {
            await axios.put(`/issue/${issue.isid}`, { sprint_id: newSprintId });

            // 기존 스프린트에서 제거
            setIssues(prevIssues => {
                const updatedIssues = { ...prevIssues };
                if (issue.sprint_id) {
                    updatedIssues[issue.sprint_id] = updatedIssues[issue.sprint_id].filter(i => i.isid !== issue.isid);
                }
                return updatedIssues;
            });

            // 백로그에서 제거
            setBacklog(prevBacklog => prevBacklog.filter(i => i.isid !== issue.isid));

            if (newSprintId === null) {
                // 백로그로 추가
                setBacklog(prevBacklog => [...prevBacklog, { ...issue, sprint_id: null }]);
            } else {
                // 새 스프린트로 추가
                setIssues(prevIssues => {
                    const updatedIssues = { ...prevIssues };
                    updatedIssues[newSprintId] = [...(updatedIssues[newSprintId] || []), { ...issue, sprint_id: newSprintId }];
                    return updatedIssues;
                });
            }

            console.log(`Issue ${issue.isid} successfully moved to sprint ${newSprintId}`);
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

    const filteredBacklogIssues = backlog.filter((issue: Issue) => 
        (!filter.manager || issue.manager === filter.manager) &&
        (!filter.status || issue.status === filter.status) &&
        (!filter.priority || issue.priority === filter.priority)
    );

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
                            {managers.map((manager, index) => (
                                <option key={index} value={manager}>{manager}</option>
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
                        {filteredBacklogIssues.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: '#6c757d', userSelect: 'none' }}>
                                    이슈를 이 영역으로 끌어와 백로그를 채우세요.
                                </td>
                            </tr>
                        ) : (
                            filteredBacklogIssues.map((issue: Issue) => (
                                <DragItem key={issue.isid} issue={issue} />
                            ))
                        )}
                    </tbody>
                </IssueTable>
            </StyledSprintBox>
        </BoardContainer>
    );
};

export default BBoard;
