import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { OperationsPage } from './pages/admin/OperationsPage';
import { CreateOrderPage } from './pages/admin/CreateOrderPage';
import { RouteDispatchPage } from './pages/driver/RouteDispatchPage';
import { DailyRoutePage } from './pages/driver/DailyRoutePage';
import { TrackingPage } from './pages/public/TrackingPage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';
import { PMVRequirementsPage } from './pages/public/PMVRequirementsPage';
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
          
          {/* PMV Requirements Checklist Page */}
          <Route path="/requirements" element={<PMVRequirementsPage />} />

          {/* Customer Routes */}
          <Route path="/customer/orders" element={<CustomerOrdersPage />} />
          <Route path="/customer/create" element={<CreateOrderPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/operations" element={<OperationsPage />} />
          <Route path="/admin/create-order" element={<CreateOrderPage />} />

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
