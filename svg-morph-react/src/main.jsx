import React from 'react';
import { createRoot } from 'react-dom/client';
import MorphStudio from './MorphStudio.jsx';
import './style.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><MorphStudio /></React.StrictMode>
);
