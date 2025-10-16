
import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MockTest } from './components/MockTest';
import { AIChatbot } from './components/AIChatbot';
import { StudyPlanner } from './components/StudyPlanner';
import { Community } from './components/Community';
import { Header } from './components/Header';
import { DashboardSkeleton } from './components/DashboardSkeleton';
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
import { LoginModal } from './components/LoginModal';
import { db } from './db/firebase';
import { ensureUserProfile } from './lib/userProfile';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await ensureUserProfile(db);
        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Học sinh',
          email: firebaseUser.email || 'no-email@example.com',
          avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${firebaseUser.displayName || 'HS'}`,
          role: 'student'
        };
        setUser(appUser);
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
      } else {
        setUser(null);
        setApiKey(null);
        localStorage.removeItem('gemini-api-key');
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [pendingAction]);

  useEffect(() => {
    if (user) {
        try {
            const savedApiKey = localStorage.getItem('gemini-api-key');
            if (savedApiKey) {
                setApiKey(savedApiKey);
                initializeAi(savedApiKey);
            }
        } catch (error) {
            console.error("Failed to load API key from localStorage.", error);
        }
    }
  }, [user]);

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
    if (!user) {
        // The pending action is to retry this whole check after login
        setPendingAction(() => () => requireAuthAndApi(action));
        setShowLoginModal(true);
        return;
    }
    // At this point, user is logged in. Now check for API key.
    if (!apiKey) {
        setPendingAction(() => action); // The pending action is the final step
        setShowApiKeyModal(true);
        return;
    }
    action();
  }, [apiKey, user]);

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

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
    setCurrentView('dashboard');
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
  
  const cancelLoginAndGoHome = () => {
      setShowLoginModal(false);
      setPendingAction(null);
      setCurrentView('dashboard');
  }

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <>
      {showLoginModal && (
          <LoginModal 
            onLoginSuccess={() => setShowLoginModal(false)}
            onDismiss={cancelLoginAndGoHome}
          />
      )}
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
              onSignOut={handleSignOut}
              onLoginClick={() => setShowLoginModal(true)}
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
