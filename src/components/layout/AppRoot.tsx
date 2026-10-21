// Root Wrapper 
import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import GuestBudgetLayout from './GuestBudgetLayout';

export default function AppRoot() {
  const { isHydrated, initializeLocalDB } = useAppStore();

  useEffect(() => {
    initializeLocalDB();
  }, [initializeLocalDB]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">
        <p>Loading local data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <GuestBudgetLayout />
    </div>
  );
}