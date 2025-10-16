
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MockTest } from './components/MockTest';
import { AIChatbot } from './components/AIChatbot';
import { StudyPlanner } from './components/StudyPlanner';
import { Community } from './components/Community';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { initializeAi } from './services/geminiService';
import type { ViewType, User } from './types';
import { KnowledgeBase } from './components/KnowledgeBase';
import { LearningProfile } from './components/LearningProfile';
import { ParentDashboard } from './components/ParentDashboard';
import { StudyMaterials } from './components/StudyMaterials';
import { TeacherDashboard } from './components/TeacherDashboard';
import TodayPlan from './components/TodayPlan';
import DailyReminder from './components/DailyReminder';

// Người dùng khách mặc định vì chức năng đăng nhập đã bị loại bỏ
const mockUser: User = {
  id: 'local-user',
  name: 'Học sinh',
  email: 'hocsinh@example.com',
  avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=HS`,
  role: 'student'
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const [user] = useState<User>(mockUser);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    try {
        const savedApiKey = localStorage.getItem('gemini-api-key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
            initializeAi(savedApiKey);
        }
    } catch (error) {
        console.error("Failed to load API key from localStorage.", error);
    }
  }, []);

  const handleApiKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
    initializeAi(newApiKey);
    localStorage.setItem('gemini-api-key', newApiKey);
    setShowApiKeyModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const requireAuthAndApi = useCallback((action: () => void) => {
    // Chỉ kiểm tra API key, không kiểm tra người dùng
    if (!apiKey) {
        setPendingAction(() => action);
        setShowApiKeyModal(true);
        return;
    }
    action();
  }, [apiKey]);

  const handleSetView = (view: ViewType) => {
    if (view !== 'mock-test' && view !== 'knowledge-base') {
        setSelectedSubject(null); // Clear subject when navigating away
        setSelectedTopic(null);
    }
    const protectedViews: ViewType[] = ['mock-test', 'chatbot', 'planner', 'knowledge-base', 'learning-profile', 'parent-dashboard', 'study-materials', 'teacher-dashboard', 'today-plan', 'daily-reminder'];
    if (protectedViews.includes(view)) {
      requireAuthAndApi(() => setCurrentView(view));
    } else {
      setCurrentView(view);
    }
  };

  const handleStartTest = (subject: string) => {
    requireAuthAndApi(() => {
        setSelectedSubject(subject);
        setSelectedTopic(null);
        setCurrentView('mock-test');
    });
  };
  
  const handleStartPractice = (subject: string, topic: string) => {
    requireAuthAndApi(() => {
        setSelectedSubject(subject);
        setSelectedTopic(topic);
        setCurrentView('mock-test');
    });
  };

  const handleViewKnowledge = (subject: string) => {
    requireAuthAndApi(() => {
        setSelectedSubject(subject);
        setCurrentView('knowledge-base');
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStartTest={handleStartTest} onViewKnowledge={handleViewKnowledge} />;
      case 'mock-test':
        return <MockTest subject={selectedSubject} topic={selectedTopic} />;
      case 'knowledge-base':
        return <KnowledgeBase subject={selectedSubject} onStartPractice={handleStartPractice} />;
      case 'chatbot':
        return <AIChatbot />;
      case 'planner':
        return <StudyPlanner />;
      case 'community':
        return <Community user={user} />;
      case 'learning-profile':
        return <LearningProfile onStartPractice={handleStartPractice} />;
      case 'parent-dashboard':
        return <ParentDashboard />;
      case 'study-materials':
        return <StudyMaterials />;
      case 'teacher-dashboard':
        return <TeacherDashboard />;
      case 'today-plan':
        return <TodayPlan />;
      case 'daily-reminder':
        return <DailyReminder />;
      default:
        return <Dashboard onStartTest={handleStartTest} onViewKnowledge={handleViewKnowledge} />;
    }
  };

  const cancelAndGoHome = () => {
    setShowApiKeyModal(false);
    setPendingAction(null);
    setCurrentView('dashboard');
  }
  
  return (
    <>
      {showApiKeyModal && (
        <ApiKeyModal
          currentApiKey={apiKey}
          onKeySubmit={handleApiKeySubmit}
          onDismiss={cancelAndGoHome}
        />
      )}
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        <Sidebar currentView={currentView} setView={handleSetView} />
        <div className="flex-1 flex flex-col overflow-hidden">
           <Header 
              user={user} 
              apiKey={apiKey}
              onApiKeyClick={() => requireAuthAndApi(() => setShowApiKeyModal(true))} 
            />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
