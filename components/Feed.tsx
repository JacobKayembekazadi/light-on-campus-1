import React, { useState } from 'react';
import { Post, User, UserRole } from '../types';
import { MOCK_POSTS } from '../constants';
import { Image, Send, Sparkles, MessageSquare, ThumbsUp, Share2, Info } from 'lucide-react';
import { generatePostDraft } from '../services/geminiService';

interface FeedProps {
  currentUser: User;
}

const Feed: React.FC<FeedProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'announcements' | 'preachings'>('all');

  const handlePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: newPostContent,
      timestamp: Date.now(),
      likes: 0,
      comments: 0,
      type: currentUser.role === UserRole.PASTOR ? 'preaching' : 'general',
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleAiAssist = async () => {
    setIsGenerating(true);
    const draft = await generatePostDraft("Encouragement for students facing exams", currentUser.role);
    setNewPostContent(draft);
    setIsGenerating(false);
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'announcements') return post.type === 'announcement';
    if (activeTab === 'preachings') return post.type === 'preaching';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Community Feed</h1>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          {(['all', 'announcements', 'preachings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex gap-4">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={`What's on your heart today, ${currentUser.name.split(' ')[0]}?`}
              className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-100 resize-none h-24 text-slate-700 placeholder:text-slate-400"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <Image size={20} />
                </button>
                <button 
                  onClick={handleAiAssist}
                  disabled={isGenerating}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isGenerating ? 'bg-purple-100 text-purple-400' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  <Sparkles size={16} />
                  {isGenerating ? 'Thinking...' : 'AI Assist'}
                </button>
              </div>
              <button 
                onClick={handlePost}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <Send size={18} />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{post.userName}</h3>
                    {post.type === 'announcement' && (
                      <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Official
                      </span>
                    )}
                    {post.type === 'preaching' && (
                      <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Word
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              
              {post.image && (
                <div className="mt-4 -mx-4">
                  <img src={post.image} alt="Post attachment" className="w-full h-64 object-cover" />
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-slate-500">
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <ThumbsUp size={18} />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <MessageSquare size={18} />
                <span className="text-sm font-medium">{post.comments} Comments</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
