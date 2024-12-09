import axios from "axios";
import React, { useState } from "react";
import { FormRow, FormGroup, Label, Input, Head, ButtonGroup } from './ModalStyle';

interface ModalProps {
    onClose: () => void;
    onSprintCreated: () => void;
}

const SprintCreate: React.FC<ModalProps> = ({ onClose, onSprintCreated }) => {
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
        project_id: 1, // project_id를 1로 지정
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

        try {
            const response = await axios.post('/sprint/createSprint', {
                ...Sprint,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                project_id: Sprint.project_id, // project_id를 포함하여 서버로 전송
            });
            if (response.data.success) {
                alert('스프린트가 생성되었습니다');
                onSprintCreated(); // 스프린트 생성 후 상태 업데이트 콜백 호출
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
