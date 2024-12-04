import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormRow, FormGroup, Label, Input, Head, ButtonGroup } from './ModalStyle';
import { useRecoilState } from "recoil";
import { sprintState, Sprint } from "../../../recoil/atoms/sprintAtoms";

interface ModalProps {
    onClose: () => void;
    sprint: Sprint | null; // sprint를 prop으로 받음
}

const SprintModify: React.FC<ModalProps> = ({ onClose, sprint }) => {
    const [sprints, setSprints] = useRecoilState(sprintState);
    const [sprintDate, setSprintDate] = useState({
        startYear: '',
        startMonth: '',
        startDay: '',
        endYear: '',
        endMonth: '',
        endDay: '',
    });
    const [sprintName, setSprintName] = useState('');
    const [sprintGoal, setSprintGoal] = useState('');
    const [Error, setError] = useState('');

    useEffect(() => {
        if (sprint) {
            const startDate = new Date(sprint.startdate);
            const endDate = new Date(sprint.enddate);

            setSprintDate({
                startYear: String(startDate.getFullYear()),
                startMonth: String(startDate.getMonth() + 1).padStart(2, '0'), // 월을 0부터 시작하므로 +1
                startDay: String(startDate.getDate()).padStart(2, '0'),
                endYear: String(endDate.getFullYear()),
                endMonth: String(endDate.getMonth() + 1).padStart(2, '0'),
                endDay: String(endDate.getDate()).padStart(2, '0'),
            });

            setSprintName(sprint.spname); // 스프린트 이름 설정
            setSprintGoal(sprint.goal);   // 스프린트 목표 설정
        }
    }, [sprint]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'spname') {
            setSprintName(value);
        } else if (name === 'goal') {
            setSprintGoal(value);
        } else {
            setSprintDate(prevDate => ({
                ...prevDate,
                [name]: value,
            }));
        }
    };

    const formatDate = (year: string, month: string, day: string, time: string) => {
        return `${year}-${month}-${day} ${time}`;
    };

    const handleSubmit = async () => {
        if (!sprint || sprintName === '') {
            setError('스프린트 이름을 입력해 주세요');
            return;
        }
        if (sprintDate.startYear === '' || sprintDate.startMonth === '' || sprintDate.startDay === '') {
            setError('시작 날짜를 모두 입력해 주세요');
            return;
        }
        if (sprintDate.endYear === '' || sprintDate.endMonth === '' || sprintDate.endDay === '') {
            setError('종료 날짜를 모두 입력해 주세요');
            return;
        }

        const formattedStartDate = formatDate(sprintDate.startYear, sprintDate.startMonth, sprintDate.startDay, "00:00:00");
        const formattedEndDate = formatDate(sprintDate.endYear, sprintDate.endMonth, sprintDate.endDay, "23:59:59");

        const updatedSprint = {
            ...sprint,
            spname: sprintName, // 수정된 스프린트 이름 설정
            goal: sprintGoal,   // 수정된 스프린트 목표 설정
            startdate: formattedStartDate,
            enddate: formattedEndDate,
        };

        try {
            const response = await axios.put('/sprint/modifiySprint', updatedSprint);
            if (response.data.success) {
                alert('스프린트가 수정되었습니다');
                setSprints(prevSprints =>
                    prevSprints.map(s => s.spid === updatedSprint.spid ? updatedSprint : s)
                );
                onClose(); // 모달 닫기
            } else {
                alert(`${response.data.message}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Head>스프린트 수정</Head>
            <FormGroup>
                <Label>스프린트 이름</Label>
                <Input
                    type="text"
                    name="spname"
                    value={sprintName}
                    onChange={handleChange}
                    placeholder="스프린트 이름을 입력해 주세요"
                />
            </FormGroup>
            <FormRow>
                <div>
                    <Label>시작 날짜</Label>
                    <FormRow>
                        <Input
                            type="text"
                            name="startYear"
                            value={sprintDate.startYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            style={{ width: '33%' }}
                        />
                        <Input
                            type="text"
                            name="startMonth"
                            value={sprintDate.startMonth}
                            onChange={handleChange}
                            placeholder="MM"
                            style={{ width: '33%' }}
                        />
                        <Input
                            type="text"
                            name="startDay"
                            value={sprintDate.startDay}
                            onChange={handleChange}
                            placeholder="DD"
                            style={{ width: '33%' }}
                        />
                    </FormRow>
                </div>
                <div>
                    <Label>종료 날짜</Label>
                    <FormRow>
                        <Input
                            type="text"
                            name="endYear"
                            value={sprintDate.endYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            style={{ width: '33%' }}
                        />
                        <Input
                            type="text"
                            name="endMonth"
                            value={sprintDate.endMonth}
                            onChange={handleChange}
                            placeholder="MM"
                            style={{ width: '33%' }}
                        />
                        <Input
                            type="text"
                            name="endDay"
                            value={sprintDate.endDay}
                            onChange={handleChange}
                            placeholder="DD"
                            style={{ width: '33%' }}
                        />
                    </FormRow>
                </div>
            </FormRow>
            <FormGroup>
                <Label>스프린트 목표</Label>
                <Input
                    type="text"
                    name="goal"
                    value={sprintGoal}
                    onChange={handleChange}
                    placeholder="스프린트 목표를 입력해 주세요"
                />
            </FormGroup>

            {Error && <div>{Error}</div>}

            <ButtonGroup>
                <button onClick={onClose}>취소</button>
                <button onClick={handleSubmit}>확인</button>
            </ButtonGroup>
        </div>
    );
};

export default SprintModify;
