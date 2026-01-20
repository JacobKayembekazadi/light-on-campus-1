import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatSession, User } from '../types';
import { MOCK_CHATS } from '../constants';
import { Send, Bot, Search, MoreVertical, MessageSquare, ArrowLeft, Users, X } from 'lucide-react';
import { getSpiritualCounsel } from '../services/geminiService';
import { EmptyState } from './ui';
import { ChatSkeleton, MessageSkeleton } from './ui/SkeletonLoader';

interface ChatSystemProps {
  currentUser: User;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ currentUser }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_CHATS);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'chat1': [
      { id: 'm1', senderId: 'ai', senderName: 'AI Counselor', content: 'Peace be with you. I am your spiritual support assistant. How is your heart today?', timestamp: Date.now() - 100000, isAi: true }
    ],
    'chat2': [
      { id: 'm2', senderId: 'u3', senderName: 'John', content: 'Hey guys, dont forget bible study tonight!', timestamp: Date.now() - 50000 },
      { id: 'm3', senderId: 'u4', senderName: 'Mary', content: 'Thanks for the reminder! I\'ll be there.', timestamp: Date.now() - 40000 }
    ],
    'chat3': [
      { id: 'm4', senderId: 'pastor1', senderName: 'Pastor Michael', content: 'God bless you! Let me know if you need anything.', timestamp: Date.now() - 20000 }
    ]
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentMessages = activeSessionId ? (messages[activeSessionId] || []) : [];

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const participantName = session.participants[0]?.name?.toLowerCase() || '';
    const lastMessage = session.lastMessage?.toLowerCase() || '';
    return participantName.includes(query) || lastMessage.includes(query);
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, activeSessionId]);

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setShowMobileChat(true);
    // Clear unread count
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, unreadCount: 0 } : s
    ));
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeSessionId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: inputMessage,
      timestamp: Date.now()
    };

    setMessages(prev => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), newMessage]
    }));

    // Update last message in session
    setSessions(prev => prev.map(s =>
      s.id === activeSessionId ? { ...s, lastMessage: inputMessage } : s
    ));

    setInputMessage('');

    // AI Counselor Logic
    if (activeSession?.type === 'ai_counselor') {
      setIsTyping(true);
      const userQuery = inputMessage;

      try {
        const aiResponse = await getSpiritualCounsel(userQuery);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          senderName: 'AI Counselor',
          content: aiResponse,
          timestamp: Date.now(),
          isAi: true
        };

        setMessages(prev => ({
          ...prev,
          [activeSessionId]: [...(prev[activeSessionId] || []), aiMessage]
        }));

        setSessions(prev => prev.map(s =>
          s.id === activeSessionId ? { ...s, lastMessage: aiResponse.slice(0, 50) + '...' } : s
        ));
      } catch (err) {
        console.error(err);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai',
          senderName: 'AI Counselor',
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
          timestamp: Date.now(),
          isAi: true
        };
        setMessages(prev => ({
          ...prev,
          [activeSessionId]: [...(prev[activeSessionId] || []), errorMessage]
        }));
      } finally {
        setIsTyping(false);
      }
    }
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'ai_counselor':
        return <Bot size={12} className="text-purple-600" />;
      case 'group':
        return <Users size={12} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-60px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-full md:w-80 border-r border-slate-100 bg-slate-50">
          {[1, 2, 3, 4].map((i) => <ChatSkeleton key={i} />)}
        </div>
        <div className="hidden md:flex flex-1 flex-col bg-slate-50/50 p-4 space-y-4">
          <MessageSkeleton />
          <MessageSkeleton isMe />
          <MessageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-60px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar List - Hidden on mobile when chat is open */}
      <div className={`${showMobileChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 border-r border-slate-100 flex-col bg-slate-50`}>
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSessions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={MessageSquare}
                title={searchQuery ? "No results found" : "No conversations"}
                description={searchQuery
                  ? `No conversations match "${searchQuery}"`
                  : "Start a new conversation to connect with others"}
              />
            </div>
          ) : (
            filteredSessions.map(session => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={`p-4 cursor-pointer transition-all border-b border-slate-100 hover:bg-slate-100 active:bg-slate-200 ${
                  activeSessionId === session.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={session.participants[0].avatar}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {getSessionIcon(session.type) && (
                      <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${
                        session.type === 'ai_counselor' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {getSessionIcon(session.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">
                        {session.type === 'group' ? 'Community Group' : session.participants[0].name}
                      </h4>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {formatTime(Date.now() - Math.random() * 86400000)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xs text-slate-500 truncate flex-1">{session.lastMessage}</p>
                      {session.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {session.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Chat Area */}
      <div className={`${showMobileChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-slate-50/50`}>
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <button
                  onClick={handleBackToList}
                  className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={activeSession.participants[0].avatar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Chat Avatar"
                />
                <div>
                  <h3 className="font-bold text-slate-800">
                    {activeSession.type === 'ai_counselor' ? 'Spiritual Counselor' : activeSession.participants[0].name}
                  </h3>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {activeSession.type === 'ai_counselor' ? 'AI Powered' : 'Online'}
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <EmptyState
                    icon={MessageSquare}
                    title="No messages yet"
                    description="Send a message to start the conversation"
                  />
                </div>
              ) : (
                currentMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : msg.isAi
                            ? 'bg-purple-50 border border-purple-100 text-slate-800 rounded-bl-none'
                            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                      }`}>
                        {msg.isAi && (
                          <div className="text-xs font-bold text-purple-600 mb-1 flex items-center gap-1">
                            <Bot size={12} /> Counselor
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-purple-50 border border-purple-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={activeSession.type === 'ai_counselor' ? "Ask for spiritual advice..." : "Type a message..."}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`p-3 rounded-xl transition-all min-w-[48px] ${
                    inputMessage.trim()
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-slate-400">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">Your Messages</h3>
            <p className="text-sm text-slate-400 text-center max-w-xs">
              Select a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
