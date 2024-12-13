import React from 'react';
import BBoard from './BBoard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRecoilValue } from 'recoil';
import { loadingAtoms } from '../../recoil/atoms/loadingAtoms';

const Backlog: React.FC = () => {

  const isLoading = useRecoilValue(loadingAtoms);
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BBoard />
    </DndProvider>
  );
};

export default Backlog;
