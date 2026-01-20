import React, { useState } from 'react';
import Layout from './components/Layout';
import Feed from './components/Feed';
import CoursePlatform from './components/CoursePlatform';
import ChatSystem from './components/ChatSystem';
import Donation from './components/Donation';
import Profile from './components/Profile';
import { User, UserRole } from './types';
import { CURRENT_USER } from './constants';
import { Zap, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('feed');

  // Simple Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
           <div className="text-center mb-8">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                <Zap size={32} fill="currentColor" />
             </div>
             <h1 className="text-3xl font-bold text-slate-800">Light<span className="text-blue-600">OnCampus</span></h1>
             <p className="text-slate-500 mt-2">Connect, Grow, and Shine together.</p>
           </div>
           
           <div className="space-y-4">
             <button 
               onClick={() => setCurrentUser(CURRENT_USER)}
               className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
             >
               Login as Member
               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
             </button>
             <button 
               onClick={() => setCurrentUser({...CURRENT_USER, id: 'pastor1', name: 'Pastor Michael', role: UserRole.PASTOR, avatar: 'https://picsum.photos/seed/pastor/100/100'})}
               className="w-full bg-white text-slate-700 border border-slate-200 py-3 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
             >
               Login as Pastor
             </button>
           </div>
           
           <p className="text-xs text-center text-slate-400 mt-8">
             By joining, you agree to our Community Guidelines on spiritual growth and respectful conduct.
           </p>
        </div>
      </div>
    );
  }

  // View Routing
  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <Feed currentUser={currentUser} />;
      case 'courses':
        return <CoursePlatform currentUser={currentUser} />;
      case 'chat':
        return <ChatSystem currentUser={currentUser} />;
      case 'donate':
        return <Donation />;
      case 'profile':
        return <Profile currentUser={currentUser} />;
      default:
        return <Feed currentUser={currentUser} />;
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      currentView={currentView} 
      onChangeView={setCurrentView}
      onLogout={() => setCurrentUser(null)}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
