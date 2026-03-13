import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './context/LayoutContext';
import HomeView from './views/HomeView';
import DashboardView from './views/DashboardView';

import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={
            <ErrorBoundary>
              <DashboardView />
            </ErrorBoundary>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
