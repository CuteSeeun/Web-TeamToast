import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from 'recoil';
import { sprintState, Sprint } from '../../../recoil/atoms/sprintAtoms';
import { FormRow, FormGroup, Label, Input, Head, ButtonGroup } from './ModalStyle';

interface ModalProps {
    onClose: () => void;
    onSprintCreated: () => void;
}

const SprintCreate: React.FC<ModalProps> = ({ onClose, onSprintCreated }) => {
    const { pid } = useParams<{ pid: string }>(); // URL에서 pid 추출
    const projectID = pid ?? '1'; // pid가 undefined일 경우 기본 값 '1'을 사용
    const setSprints = useSetRecoilState(sprintState); // Recoil 스프린트 상태 설정

    const [Sprint, setSprint] = useState({
        spname: '',
        startDate: '',
        startYear: '',
        startMonth: '',
        startDay: '',
        endDate: '',
        endYear: '',
        endMonth: '',
        endDay: '',
        goal: '',
        project_id: parseInt(projectID, 10), // projectID를 정수로 변환하여 사용
    });

    const [Error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSprint(prevSprint => ({
            ...prevSprint,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (Sprint.spname === '') {
            setError('스프린트 이름을 입력해 주세요');
            return;
        }
        if (Sprint.startYear === '' || Sprint.startMonth === '' || Sprint.startDay === '') {
            setError('시작 날짜를 모두 입력해 주세요');
            return;
        }
        if (Sprint.endYear === '' || Sprint.endMonth === '' || Sprint.endDay === '') {
            setError('종료 날짜를 모두 입력해 주세요');
            return;
        }

        const formattedStartDate = `${Sprint.startYear}-${Sprint.startMonth}-${Sprint.startDay} 00:00:00`;
        const formattedEndDate = `${Sprint.endYear}-${Sprint.endMonth}-${Sprint.endDay} 23:59:59`;

        const requestData = {
            ...Sprint,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            project_id: Sprint.project_id,
        };

        console.log('Request Data:', requestData); // 요청 데이터를 콘솔에 출력

        try {
            const response = await axios.post(`/sprint/createSprint/${projectID}`, requestData);
            if (response.data.success) {
                alert('스프린트가 생성되었습니다');
                const newSprint: Sprint = {
                    spid: response.data.spid, // 서버에서 생성된 spid를 사용
                    spname: Sprint.spname,
                    status: 'disabled', // 기본 상태 설정
                    goal: Sprint.goal,
                    enddate: formattedEndDate,
                    startdate: formattedStartDate,
                    project_id: Sprint.project_id
                };
                setSprints(prevSprints => [...prevSprints, newSprint]); // 새로운 스프린트를 리스트의 마지막에 추가
                onClose(); // 모달 닫기
            } else {
                alert(`${response.data.message}`);
            }
        } catch (error) {
            console.error('Axios error:', error);
        }
    };

    return (
        <div>
            <Head>스프린트 생성</Head>
            <FormGroup>
                <Label>스프린트 이름</Label>
                <Input
                    type="text"
                    name="spname"
                    value={Sprint.spname}
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
                            value={Sprint.startYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            style={{ width: '33%' }}
                        />
                        <Input
                            type="text"
                            name="startMonth"
                            value={Sprint.startMonth}
                            onChange={handleChange}
                            placeholder="MM"
                            style={{ width: '33%' }}
                        />
                        <Input
                            type="text"
                            name="startDay"
                            value={Sprint.startDay}
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
                            value={Sprint.endYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            style={{ width: '33%' }}
                        />
                        <Input
                            type="text"
                            name="endMonth"
                            value={Sprint.endMonth}
                            onChange={handleChange}
                            placeholder="MM"
                            style={{ width: '33%' }}
                        />
                        <Input
                            type="text"
                            name="endDay"
                            value={Sprint.endDay}
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
                    value={Sprint.goal}
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

export default SprintCreate;
