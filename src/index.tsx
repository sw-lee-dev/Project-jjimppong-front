import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>  {/* 쿠키 관리 제공 */}
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);

