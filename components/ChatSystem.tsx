import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatSession, User, UserRole } from '../types';
import { MOCK_CHATS } from '../constants';
import { Send, Bot, Users, Search, MoreVertical, MessageSquare } from 'lucide-react';
import { getSpiritualCounsel } from '../services/geminiService';

interface ChatSystemProps {
  currentUser: User;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ currentUser }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_CHATS);
  const [activeSessionId, setActiveSessionId] = useState<string>(MOCK_CHATS[0].id);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'chat1': [
      { id: 'm1', senderId: 'ai', senderName: 'AI Counselor', content: 'Peace be with you. I am your spiritual support assistant. How is your heart today?', timestamp: Date.now() - 100000, isAi: true }
    ],
    'chat2': [
      { id: 'm2', senderId: 'u3', senderName: 'John', content: 'Hey guys, dont forget bible study tonight!', timestamp: Date.now() - 50000 }
    ]
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentMessages = messages[activeSessionId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, activeSessionId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

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
    setInputMessage('');

    // AI Counselor Logic
    if (activeSession?.type === 'ai_counselor') {
      setIsTyping(true);
      const userQuery = inputMessage; // Capture active closure
      
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
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-60px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-100">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search messages..." 
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
             />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`p-4 cursor-pointer transition-colors border-b border-slate-100 hover:bg-slate-100 ${
                activeSessionId === session.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={session.participants[0].avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  {session.type === 'ai_counselor' && (
                    <div className="absolute -bottom-1 -right-1 bg-purple-100 p-1 rounded-full border border-white">
                        <Bot size={12} className="text-purple-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">
                      {session.type === 'group' ? 'Community Group' : session.participants[0].name}
                    </h4>
                    {session.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{session.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-50/50">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <img src={activeSession.participants[0].avatar} className="w-10 h-10 rounded-full" alt="Chat Avatar" />
                <div>
                  <h3 className="font-bold text-slate-800">
                    {activeSession.type === 'ai_counselor' ? 'Spiritual Counselor' : activeSession.participants[0].name}
                  </h3>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
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
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-purple-50 border border-purple-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={activeSession.type === 'ai_counselor' ? "Ask for spiritual advice..." : "Type a message..."}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  className={`p-3 rounded-xl transition-all ${
                    inputMessage.trim() ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageSquare size={48} className="mb-4 text-slate-200" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;