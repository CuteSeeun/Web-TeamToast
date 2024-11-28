import React from 'react';
import { useDrag } from 'react-dnd';

interface Issue {
    id: number;
    isid: number; 
    title: string;
    type: string;
    priority: string;
    manager: string;
    status: string;
}

interface DragItemProps {
    issue: Issue;
}

const DragItem: React.FC<DragItemProps> = ({ issue }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: issue, 
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
