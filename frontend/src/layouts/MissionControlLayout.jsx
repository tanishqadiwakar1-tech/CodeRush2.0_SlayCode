import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Topbar from '../components/ui/Topbar';

export default function MissionControlLayout() {
  return (
    <div className="flex min-h-screen bg-[#060816] text-[#F8FAFC]">
      {/* 280px Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Floating Topbar */}
        <Topbar />

        {/* Page Content Workspace */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
