import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React 18 이상에서 사용하는 방식
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

