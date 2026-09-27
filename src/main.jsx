import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { PetProvider } from './context/PetContext';
import ErrorBoundary from './components/common/ErrorBoundary';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Bắt mọi lỗi runtime unhandled ngoài vòng đời React và gửi tự động sang Discord
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    try {
      fetch(`${API_BASE}/errors/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message: event.message || 'Window Uncaught Error',
          stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(() => {});
    } catch {
      // Ignored
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      fetch(`${API_BASE}/errors/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message: `Unhandled Promise Rejection: ${reason?.message || reason}`,
          stack: reason?.stack || 'No stack trace',
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(() => {});
    } catch {
      // Ignored
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <PetProvider>
            <App />
          </PetProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
