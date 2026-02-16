import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { useAuthStore } from './store/useAuthStore';

// Check if user is already logged in via cookie before rendering
useAuthStore.getState().checkAuth().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});