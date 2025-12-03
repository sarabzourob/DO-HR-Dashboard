
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Positions from './pages/Positions';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import HRRequests from './pages/HRRequests';
import Separation from './pages/Separation';
import Onboarding from './pages/Onboarding';
import Performance from './pages/Performance';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/requests" element={<HRRequests />} />
          <Route path="/separation" element={<Separation />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;