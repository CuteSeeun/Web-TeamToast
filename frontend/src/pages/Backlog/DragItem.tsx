// Dragitem.tsx
import React from 'react';
import { useDrag } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import { Issue } from '../../recoil/atoms/issueAtoms'; // 올바른 Issue 인터페이스를 가져옵니다.

interface DragItemProps {
  issue: Issue;
}

const DragItem: React.FC<DragItemProps> = ({ issue }) => {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: issue, // 이슈 객체 전체를 설정합니다.
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    navigate(`/issue/${issue.isid}`);
  };

  return (
    <tr ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td onClick={handleClick} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
        {issue.title}
      </td>
      <td>{issue.status}</td>
      <td>{issue.priority}</td>
      <td>{issue.manager}</td>
    </tr>
  );
};

export default DragItem;
