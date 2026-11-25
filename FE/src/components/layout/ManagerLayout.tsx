import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const ManagerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed 240px Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-[240px] flex flex-col min-h-screen">
        {/* Fixed 64px Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 mt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
