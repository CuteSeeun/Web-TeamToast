import React from 'react';
import BBoard from './BBoard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Backlog: React.FC = () => {

  return (
    <DndProvider backend={HTML5Backend}>
      <BBoard />
    </DndProvider>
  );
};

export default Backlog;
