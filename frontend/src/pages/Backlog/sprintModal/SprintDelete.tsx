import React from "react";
import { ButtonGroup, Head } from "./ModalStyle";
import { Sprint, sprintState } from "../../../recoil/atoms/sprintAtoms";
import { useRecoilState } from "recoil";
import axios from "axios";

interface ModalProps {
    onClose: () => void;
    sprint: Sprint | null;
}

const SprintDelete: React.FC<ModalProps> = ({ onClose, sprint }) => {
    const [sprints, setSprints] = useRecoilState(sprintState);

    const handleSubmit = async () => {
        if (!sprint) return;

        try {
            const response = await axios.delete(`/sprint/deleteSprint/${sprint.spid}`);
            if (response.data.success) {
                alert('스프린트가 삭제되었습니다.');
                setSprints(prevSprints => prevSprints.filter(s => s.spid !== sprint.spid));
                onClose();
            } else {
                alert(`${response.data.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('스프린트를 삭제하는 중 오류가 발생하였습니다.');
        }
    };

    return (
        <div>
            <Head>스프린트 삭제</Head>
            <div>
                {sprint ? (
                    <label>{sprint.spname}을(를) 삭제하시겠습니까?</label>
                ) : (
                    <label>스프린트를 삭제하시겠습니까?</label>
                )}
            </div>
            <ButtonGroup>
                <button onClick={onClose}>취소</button>
                <button onClick={handleSubmit}>확인</button>
            </ButtonGroup>
        </div>
    );
};

export default SprintDelete;
