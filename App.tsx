import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MockTest } from './components/MockTest';
import { AIChatbot } from './components/AIChatbot';
import { StudyPlanner } from './components/StudyPlanner';
import { Community } from './components/Community';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LoginModal } from './components/LoginModal';
import { initializeAi } from './services/geminiService';
import type { ViewType, User } from './types';

declare const google: any;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      initializeAi(savedApiKey);
    }
  }, []);

  const handleSignOut = () => {
    setUser(null);
  };

  const handleGoogleSignIn = useCallback((credentialResponse: any) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const newUser: User = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        avatarUrl: decoded.picture
      };
      setUser(newUser);
      setShowLoginModal(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } catch (e) {
      console.error("Error decoding JWT", e);
    }
  }, [pendingAction]);

  useEffect(() => {
    if (typeof google === 'undefined') {
      return;
    }

    google.accounts.id.initialize({
      client_id: '320099579191-f331p75bb1ghei0e8hkl1sv63psddhuo.apps.googleusercontent.com',
      callback: handleGoogleSignIn,
    });

    if (showLoginModal) {
       const GSIbuttonContainer = document.getElementById('google-signin-button-container');
       if(GSIbuttonContainer) {
          google.accounts.id.renderButton(
            GSIbuttonContainer,
            { theme: 'outline', size: 'large', width: '250', type: 'standard' }
          );
       }
    }
  }, [showLoginModal, handleGoogleSignIn]);

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
        setPendingAction(() => () => requireAuthAndApi(action));
        setShowLoginModal(true);
        return;
    }
    if (!apiKey) {
        setPendingAction(() => action);
        setShowApiKeyModal(true);
        return;
    }
    action();
  }, [user, apiKey]);

  const handleSetView = (view: ViewType) => {
    const protectedViews: ViewType[] = ['mock-test', 'chatbot', 'planner'];
    if (protectedViews.includes(view)) {
      requireAuthAndApi(() => setCurrentView(view));
    } else {
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setView={handleSetView} />;
      case 'mock-test':
        return <MockTest />;
      case 'chatbot':
        return <AIChatbot />;
      case 'planner':
        return <StudyPlanner />;
      case 'community':
        return <Community />;
      default:
        return <Dashboard setView={handleSetView} />;
    }
  };

  const cancelAndGoHome = () => {
    setShowLoginModal(false);
    setShowApiKeyModal(false);
    setPendingAction(null);
    setCurrentView('dashboard');
  }

  return (
    <>
      {showLoginModal && <LoginModal onDismiss={cancelAndGoHome} />}
      {showApiKeyModal && (
        <ApiKeyModal
          onKeySubmit={handleApiKeySubmit}
          onDismiss={cancelAndGoHome}
        />
      )}
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        <Sidebar currentView={currentView} setView={handleSetView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} onApiKeyClick={() => requireAuthAndApi(() => setShowApiKeyModal(true))} onSignOut={handleSignOut} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;