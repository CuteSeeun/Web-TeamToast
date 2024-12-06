import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BsThreeDots } from "react-icons/bs";
import { AddIssueLink, IssueTable, SprintControls, SprintHeader, SprintName, SprintPeriod, StyledSprintBox, DropdownMenu, MenuItem } from "./backlogstyle"; // 스타일 컴포넌트 임포트
import { sprintState, sortedSprintsState, filterState, Sprint, SprintStatus } from '../../recoil/atoms/sprintAtoms';
import { allIssuesState, Issue } from '../../recoil/atoms/issueAtoms';
import DragItem from './DragItem';
import { useDrop } from 'react-dnd';
import { ModalContent, ModalOverlay } from './sprintModal/ModalStyle';
import SprintModify from './sprintModal/SprintModifiy';
import SprintDelete from './sprintModal/SprintDelete'; // SprintDelete 컴포넌트 임포트
import axios from 'axios';

interface SprintProps {
    sprint: Sprint;
    onDrop: (issue: Issue, newSprintId: number | null) => void;
}

const SprintBox: React.FC<SprintProps> = ({ sprint, onDrop }) => {
    const setSprints = useSetRecoilState(sprintState);
    const allIssues = useRecoilValue(allIssuesState);
    const sortedSprints = useRecoilValue(sortedSprintsState);
    const filter = useRecoilValue(filterState);
    const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [modifyModalOpen, setModifyModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null); // 수정: 현재 스프린트 상태 추가
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

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
            console.log('Sprint status updated:', updatedSprint); // 상태 업데이트 확인
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const shouldHideButton = activeSprint !== null && activeSprint.spid !== sprint.spid;

    const filteredIssues = allIssues.filter(issue =>
        issue.sprint_id === sprint.spid &&
        (!filter.manager || issue.manager === filter.manager) &&
        (!filter.status || issue.status === filter.status) &&
        (!filter.priority || issue.priority === filter.priority)
    );

    const [{ isOver }, drop] = useDrop({
        accept: 'ITEM',
        drop: (item: Issue) => onDrop(item, sprint.spid),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };

    const openModifyModal = () => {
        setCurrentSprint(sprint); // 현재 스프린트를 설정
        setModifyModalOpen(true);
        setShowMenu(false);
    };

    const openDeleteModal = () => {
        setCurrentSprint(sprint); // 현재 스프린트를 설정
        setDeleteModalOpen(true);
        setShowMenu(false);
    };

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
                    <BsThreeDots className="menu-icon" onClick={toggleMenu} />
                    <DropdownMenu show={showMenu}>
                        <MenuItem onClick={openModifyModal}>스프린트 수정</MenuItem>
                        <MenuItem onClick={openDeleteModal}>스프린트 삭제</MenuItem>
                    </DropdownMenu>
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
                    {loading ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', color: '#6c757d' }}>
                                로딩 중...
                            </td>
                        </tr>
                    ) : (
                        filteredIssues.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: '#6c757d', userSelect: 'none' }}>
                                    이슈를 이 영역으로 끌어와 스프린트를 채우세요.
                                </td>
                            </tr>
                        ) : (
                            filteredIssues.map(issue => (
                                <DragItem key={issue.isid} issue={issue} />
                            ))
                        )
                    )}
                </tbody>
            </IssueTable>

            <AddIssueLink>+ 이슈 추가하기</AddIssueLink>

            {modifyModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <SprintModify onClose={() => setModifyModalOpen(false)} sprint={currentSprint} />
                    </ModalContent>
                </ModalOverlay>
            )}

            {deleteModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <SprintDelete onClose={() => setDeleteModalOpen(false)} sprint={currentSprint} />
                    </ModalContent>
                </ModalOverlay>
            )}
        </StyledSprintBox>
    );
};

export default SprintBox;
