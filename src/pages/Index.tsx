
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Dashboard } from '@/components/Dashboard/Dashboard';

const Index = () => {
  return (
    <Provider store={store}>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </Provider>
  );
};

export default Index;
