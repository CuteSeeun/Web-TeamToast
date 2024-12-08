import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL에서 값을 가져오기 위해 import
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AddSprint, BoardContainer, BoardHeader, BoardTitle, Breadcrumb, Filters, Div, StyledSprintBox, SprintHeader, SprintName, IssueTable } from './backlogstyle';
import SprintBox from './SprintBox';
import { sprintState, sortedSprintsState, filterState } from '../../recoil/atoms/sprintAtoms';
import { allIssuesState, backlogState, Issue } from '../../recoil/atoms/issueAtoms';
import { useDrop } from 'react-dnd';
import DragItem from './DragItem';
import SprintCreate from './sprintModal/SprintCreate';
import { ModalOverlay, ModalContent } from './sprintModal/ModalStyle';
import LoadingSpinner from './sprintModal/Loading';
import axios from 'axios';

const BBoard: React.FC = () => {
    const allIssues = useRecoilValue(allIssuesState);
    const sortedSprints = useRecoilValue(sortedSprintsState);
    const setSprints = useSetRecoilState(sprintState);
    const [backlog, setBacklog] = useRecoilState<Issue[]>(backlogState);
    const setIssues = useSetRecoilState(allIssuesState); // 이슈 업데이트를 위한 세터 함수
    const [filter, setFilter] = useRecoilState(filterState);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    //url에서 pid 가져오기
    const { pid } = useParams<{ pid: string }>(); // URL에서 `pid` 가져오기

    // 초기 백로그 설정
    useEffect(() => {
        if (!pid) {
            console.error('URL에서 pid를 가져오지 못했습니다.');
            return;
        }
        const projectId = parseInt(pid); // `pid`를 정수로 변환
        const projectIssues = allIssues.filter(i => i.project_id === projectId && i.sprint_id === null);
        setBacklog(projectIssues);
    }, [pid, allIssues, setBacklog]);

    const fetchSprints = async () => {
        if (!pid) console.log('pid없는데?');
        try {
            const response = await axios.get(`/sprint/project/${pid}`);
            setSprints(response.data);
        } catch (error) {
            console.error('Error fetching sprints:', error);
        }
    };

    // 드롭 핸들러 함수
    const onDrop = async (issue: Issue, newSprintId: number | null) => {
        if (!pid) {
            console.error('pid가 undefined입니다.');
            return;
        }
        try {
            const projectId = parseInt(pid); // 여기서 undefined를 처리
            await axios.put(`/issue/${issue.isid}`, { sprint_id: newSprintId });

            const updatedIssues = allIssues.map((i) => {
                if (i.isid === issue.isid) {
                    return { ...i, sprint_id: newSprintId };
                }
                return i;
            });

            setIssues(updatedIssues); // 업데이트된 이슈로 전체 상태를 업데이트
            setBacklog(updatedIssues.filter(i => i.project_id === projectId && i.sprint_id === null)); // 백로그 상태 업데이트
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
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
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
                                    {Array.from(new Set(allIssues.filter(i => i.project_id === parseInt(pid || '0')).map(i => i.manager))).map((manager, index) => (
                                        <option key={index} value={manager || ''}>{manager}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <select
                                    value={filter.status}
                                    onChange={e => setFilter({ ...filter, status: e.target.value })}
                                >
                                    <option value="">상태</option>
                                    {Array.from(new Set(allIssues.filter(i => i.project_id === parseInt(pid || '0')).map(i => i.status))).map((status, index) => (
                                        <option key={index} value={status || ''}>{status}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <select
                                    value={filter.priority}
                                    onChange={e => setFilter({ ...filter, priority: e.target.value })}
                                >
                                    <option value="">우선순위</option>
                                    {Array.from(new Set(allIssues.filter(i => i.project_id === parseInt(pid || '0')).map(i => i.priority))).map((priority, index) => (
                                        <option key={index} value={priority || ''}>{priority}</option>
                                    ))}
                                </select>
                            </label>
                        </Filters>
                    </BoardHeader>

                    {sortedSprints.filter(sprint => sprint.project_id === parseInt(pid || '0') && sprint.status !== 'end').map(sprint => (
                        <SprintBox key={sprint.spid} sprint={sprint} onDrop={onDrop} />
                    ))}

                    <Div>
                        <AddSprint onClick={() => setModalOpen(true)}>스프린트 생성</AddSprint>
                        {modalOpen && (
                            <ModalOverlay>
                                <ModalContent>
                                    <SprintCreate onClose={() => setModalOpen(false)} onSprintCreated={fetchSprints} />
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
                </>
            )}
        </BoardContainer>
    );
};

export default BBoard;
