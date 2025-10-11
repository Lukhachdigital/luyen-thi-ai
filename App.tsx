import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MockTest } from './components/MockTest';
import { AIChatbot } from './components/AIChatbot';
import { StudyPlanner } from './components/StudyPlanner';
import { Community } from './components/Community';
import { Header } from './components/Header';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LoginModal } from './components/LoginModal';
import { initializeAi } from './services/geminiService';
import type { ViewType, User } from './types';

declare const google: any;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const pendingActionRef = useRef(pendingAction);
  pendingActionRef.current = pendingAction;

  // Effect to load persisted user and API key from localStorage on initial load
  useEffect(() => {
    try {
        const savedUserJson = localStorage.getItem('app-user');
        if (savedUserJson) {
            setUser(JSON.parse(savedUserJson));
        }

        const savedApiKey = localStorage.getItem('gemini-api-key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
            initializeAi(savedApiKey);
        }
    } catch (error) {
        console.error("Failed to parse data from localStorage.", error);
        localStorage.removeItem('app-user'); // Clear potentially corrupted user data
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('app-user');
    // Prevent Google One-Tap from automatically signing the user back in.
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }
  };
  
  const handleSignIn = () => {
    setPendingAction(null); // Clear pending actions for a direct sign-in attempt
    setShowLoginModal(true);
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
      localStorage.setItem('app-user', JSON.stringify(newUser)); // Persist user
      setShowLoginModal(false);
      if (pendingActionRef.current) {
        pendingActionRef.current();
        setPendingAction(null);
      }
    } catch (e) {
      console.error("Error decoding JWT", e);
    }
  }, [setPendingAction, setUser]);

  // Effect for GSI initialization, runs once.
  useEffect(() => {
    if (typeof google === 'undefined') {
      return;
    }

    google.accounts.id.initialize({
      client_id: '320099579191-f331p75bb1ghei0e8hkl1sv63psddhuo.apps.googleusercontent.com',
      callback: handleGoogleSignIn,
    });
  }, [handleGoogleSignIn]);

  // Effect for rendering the button when the modal is visible.
  useEffect(() => {
    if (showLoginModal && typeof google !== 'undefined') {
       const GSIbuttonContainer = document.getElementById('google-signin-button-container');
       if(GSIbuttonContainer) {
          // GSI library can be sensitive to re-rendering. Clear the container before rendering.
          GSIbuttonContainer.innerHTML = '';
          google.accounts.id.renderButton(
            GSIbuttonContainer,
            { theme: 'outline', size: 'large', width: '250', type: 'standard' }
          );
       }
    }
  }, [showLoginModal]);

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
           <Header 
              user={user} 
              isLoading={isLoading}
              onSignIn={handleSignIn} 
              onApiKeyClick={() => requireAuthAndApi(() => setShowApiKeyModal(true))} 
              onSignOut={handleSignOut} 
            />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
            {isLoading ? <DashboardSkeleton /> : renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
