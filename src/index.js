import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import './task-list.css';
import './footer.css';
import { App } from './components/App';

const root = ReactDOM.createRoot(document.querySelector('section.todoapp'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
