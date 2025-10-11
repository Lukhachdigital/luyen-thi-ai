import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MockTest } from './components/MockTest';
import { AIChatbot } from './components/AIChatbot';
import { StudyPlanner } from './components/StudyPlanner';
import { Community } from './components/Community';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { initializeAi } from './services/geminiService';
import type { ViewType } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      initializeAi(savedApiKey);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleApiKeySubmit = (apiKey: string) => {
    initializeAi(apiKey);
    localStorage.setItem('gemini-api-key', apiKey);
    setShowApiKeyModal(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setView={setCurrentView} />;
      case 'mock-test':
        return <MockTest />;
      case 'chatbot':
        return <AIChatbot />;
      case 'planner':
        return <StudyPlanner />;
      case 'community':
        return <Community />;
      default:
        return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <>
      {showApiKeyModal && (
        <ApiKeyModal
          onKeySubmit={handleApiKeySubmit}
          onDismiss={() => setShowApiKeyModal(false)}
        />
      )}
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        <Sidebar currentView={currentView} setView={setCurrentView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onApiKeyClick={() => setShowApiKeyModal(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
