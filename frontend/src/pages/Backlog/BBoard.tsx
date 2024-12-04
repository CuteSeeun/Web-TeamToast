// BBoard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AddSprint, BoardContainer, BoardHeader, BoardTitle, Breadcrumb, Filters, Div, StyledSprintBox, SprintHeader, SprintName, IssueTable } from './backlogstyle';
import SprintBox from './SprintBox';
import { sprintState, sortedSprintsState, filterState } from '../../recoil/atoms/sprintAtoms';
import { issueListState, backlogState, Issue, Type } from '../../recoil/atoms/issueAtoms';
import { useDrop } from 'react-dnd';
import DragItem from './DragItem';
import SprintCreate from './sprintModal/SprintCreate';
import { ModalOverlay, ModalContent } from './sprintModal/ModalStyle';

const BBoard: React.FC = () => {
    const [sprints, setSprints] = useRecoilState(sprintState);
    const sortedSprints = useRecoilValue(sortedSprintsState);
    const [, setIssues] = useRecoilState(issueListState);
    const [backlog, setBacklog] = useRecoilState<Issue[]>(backlogState);
    const [managers, setManagers] = useState<string[]>([]);
    const [filter, setFilter] = useRecoilState(filterState);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const projectId = 1;

            const [sprintResponse, issueResponse, managerResponse] = await Promise.all([
                axios.get(`/sprint/${projectId}`),
                axios.get(`/issue/backlog/${projectId}`),
                axios.get(`/user/project/${projectId}/managers`)
            ]);

            setSprints(sprintResponse.data);

            const issuesData = issueResponse.data.map((issue: any) => {
                const manager = typeof issue.manager === 'object' && issue.manager !== null ? issue.manager.manager : (issue.manager || '담당자 없음');
                return {
                    ...issue,
                    type: Type[issue.type as keyof typeof Type] || '작업',
                    manager: manager
                };
            });

            const backlogData: Issue[] = issuesData.filter((issue: Issue) => issue.sprint_id === undefined);
            setBacklog(backlogData);
            setIssues(issuesData);

            const managersData = managerResponse.data.map((manager: any) => {
                const managerStr = typeof manager === 'object' && manager !== null ? manager.manager : manager;
                return managerStr;
            });
            setManagers(managersData);
        } catch (error) {
            console.error('데이터 가져오기 오류:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [setSprints, setIssues, setBacklog, setManagers]); // 의존성 배열

    const onDrop = async (issue: Issue, newSprintId: number | null) => {
        try {
            await axios.put(`/issue/${issue.isid}`, { sprint_id: newSprintId });

            setIssues(prevIssues => {
                const updatedIssues = { ...prevIssues };
                if (issue.sprint_id) {
                    updatedIssues[issue.sprint_id] = updatedIssues[issue.sprint_id].filter(i => i.isid !== issue.isid);
                }
                return updatedIssues;
            });

            setBacklog(prevBacklog => prevBacklog.filter(i => i.isid !== issue.isid));

            if (newSprintId === null) {
                setBacklog(prevBacklog => [...prevBacklog, { ...issue, sprint_id: null }]);
            } else {
                setIssues(prevIssues => {
                    const updatedIssues = { ...prevIssues };
                    updatedIssues[newSprintId] = [...(updatedIssues[newSprintId] || []), { ...issue, sprint_id: newSprintId }];
                    return updatedIssues;
                });
            }
        } catch (error) {
            console.error(`이슈 업데이트 오류: ${issue.isid} sprint_id:`, error);
        }
    };

    const [{ isOver }, drop] = useDrop({
        accept: 'ITEM',
        drop: (item: Issue) => onDrop(item, null),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    const filteredBacklogIssues = backlog.filter((issue: Issue) => {
        const matchesManager = !filter.manager || issue.manager === filter.manager;
        const matchesStatus = !filter.status || issue.status === filter.status;
        const matchesPriority = !filter.priority || issue.priority === filter.priority;
        return matchesManager && matchesStatus && matchesPriority;
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
                <AddSprint onClick={() => setModalOpen(true)}>스프린트 생성</AddSprint>
                {modalOpen && (
                    <ModalOverlay>
                        <ModalContent>
                            <SprintCreate onClose={() => {
                                setModalOpen(false);
                                fetchData(); // 모달 닫힐 때 데이터 다시 불러오기
                            }} />
                        </ModalContent>
                    </ModalOverlay>
                )}
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
