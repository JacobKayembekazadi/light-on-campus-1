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
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'courses', label: 'Learn', icon: BookOpen },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'donate', label: 'Give', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (viewId: string) => {
    onChangeView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Zap className="text-blue-600 fill-blue-600" size={22} />
          <span className="font-bold text-lg text-slate-800">Light<span className="text-blue-600">OnCampus</span></span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Slide-out Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Desktop + Mobile Slide-out) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:w-64 md:h-screen md:sticky md:top-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Desktop Logo */}
        <div className="p-6 hidden md:flex items-center gap-2">
          <Zap className="text-blue-600 fill-blue-600" size={28} />
          <span className="font-bold text-xl text-slate-800">Light<span className="text-blue-600">OnCampus</span></span>
        </div>

        {/* Mobile Menu Header */}
        <div className="md:hidden p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-600 fill-blue-600" size={22} />
            <span className="font-bold text-lg text-slate-800">Menu</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 md:px-6 py-4">
          <div
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
            <div className="overflow-hidden flex-1">
              <p className="font-semibold text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 md:px-4 space-y-1 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                ${currentView === item.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-[calc(100vh-56px)] md:min-h-screen md:h-screen scroll-smooth">
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-50' : ''}`}>
                  <item.icon size={22} fill={isActive ? 'currentColor' : 'none'} />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
