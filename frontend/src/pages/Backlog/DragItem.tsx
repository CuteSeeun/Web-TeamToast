import React from 'react';
import { useDrag } from 'react-dnd';
import { Issue } from '../../recoil/atoms/issueAtoms'; // 올바른 Issue 인터페이스를 가져옵니다.

interface DragItemProps {
  issue: Issue;
}

const DragItem: React.FC<DragItemProps> = ({ issue }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: issue, // 이슈 객체 전체를 설정합니다.
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <tr ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td>{issue.title}</td>
      <td>{issue.status}</td>
      <td>{issue.priority}</td>
      <td>{issue.manager}</td>
    </tr>
  );
};

export default DragItem;
