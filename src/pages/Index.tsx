
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">לוח בקרה</h1>
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
