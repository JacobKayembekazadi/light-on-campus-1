import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  MessageCircle, 
  Heart, 
  User, 
  Menu, 
  X,
  LogOut,
  Zap
} from 'lucide-react';
import { User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: UserType;
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, currentView, onChangeView, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Community', icon: Home },
    { id: 'courses', label: 'Learn', icon: BookOpen },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'donate', label: 'Give', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Zap className="text-blue-600 fill-blue-600" size={24} />
          <span className="font-bold text-xl text-slate-800">Light<span className="text-blue-600">OnCampus</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen sticky top-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-2">
          <Zap className="text-blue-600 fill-blue-600" size={28} />
          <span className="font-bold text-xl text-slate-800">Light<span className="text-blue-600">OnCampus</span></span>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
                ${currentView === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen scroll-smooth">
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
