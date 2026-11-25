import React from 'react';
import { Outlet } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[420px] mb-4 flex items-center justify-center gap-2.5">
        <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-white shadow-sm">
          <Dumbbell className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-text-primary">SmartGym</span>
      </div>
      <Outlet />
    </div>
  );
};
