import React from 'react';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import type { UserRole } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentRole, setRole }) => {
  return (
    <div className="min-h-screen bg-flow-bg text-flow-dark font-body flex flex-col">
      <Header currentRole={currentRole} setRole={setRole} />
      <div className="flex flex-1">
        <Sidebar currentRole={currentRole} />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
