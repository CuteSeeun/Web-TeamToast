// DropZone.tsx
import React from 'react';
import { useDrop } from 'react-dnd';

interface DropZoneProps {
    onDrop: (issueId: number) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'ITEM',
        drop: (item: { id: number }) => onDrop(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} style={{ padding: '16px', backgroundColor: isOver ? 'lightgreen' : 'lightyellow', height: '100px', width: '100px' }}>
            Drop here
        </div>
    );
};

export default DropZone;
