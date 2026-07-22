import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { OperationsPage } from './pages/admin/OperationsPage';
import { CreateOrderPage } from './pages/admin/CreateOrderPage';
import { SmartOrderPage } from './pages/admin/SmartOrderPage';
import { RouteDispatchPage } from './pages/driver/RouteDispatchPage';
import { DailyRoutePage } from './pages/driver/DailyRoutePage';
import { TrackingPage } from './pages/public/TrackingPage';
import type { UserRole } from './types';

export const App: React.FC = () => {
  const [currentRole, setRole] = useState<UserRole>(
    (localStorage.getItem('flowex_user_role') as UserRole) || 'admin'
  );
  const [, setUserEmail] = useState<string>(
    localStorage.getItem('flowex_user_email') || 'admin@flowex.cl'
  );

  return (
    <BrowserRouter>
      <Layout currentRole={currentRole} setRole={setRole}>
        <Routes>
          <Route path="/" element={<LoginPage setRole={setRole} setUserEmail={setUserEmail} />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/operations" element={<OperationsPage />} />
          <Route path="/admin/create-order" element={<CreateOrderPage />} />
          <Route path="/admin/smart-order" element={<SmartOrderPage />} />

          {/* Customer Route */}
          <Route path="/customer/create" element={<CreateOrderPage />} />

          {/* Driver Routes */}
          <Route path="/driver/route" element={<RouteDispatchPage />} />
          <Route path="/driver/daily" element={<DailyRoutePage />} />

          {/* Public Customer Tracking */}
          <Route path="/tracking" element={<TrackingPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
