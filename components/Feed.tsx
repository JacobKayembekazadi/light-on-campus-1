import React, { useState } from 'react';
import { Post, User, UserRole, Comment } from '../types';
import { MOCK_POSTS, MOCK_COMMENTS } from '../constants';
import {
  Image, Send, Sparkles, MessageSquare, ThumbsUp, Share2,
  Trash2, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { generatePostDraft } from '../services/geminiService';
import { ShareModal, EmptyState, ConfirmDialog } from './ui';
import { PostSkeleton } from './ui/SkeletonLoader';

interface FeedProps {
  currentUser: User;
}

const Feed: React.FC<FeedProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'announcements' | 'preachings'>('all');

  // Comments state
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({});

  // Share modal state
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; post: Post | null }>({ isOpen: false, post: null });

  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; commentId: string | null }>({ isOpen: false, commentId: null });

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
      likedBy: [],
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

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: string) => {
    const content = newCommentContent[postId]?.trim();
    if (!content) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: Date.now()
    };

    setComments([...comments, newComment]);
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    ));
    setNewCommentContent(prev => ({ ...prev, [postId]: '' }));
  };

  const handleDeleteComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    setComments(comments.filter(c => c.id !== commentId));
    setPosts(posts.map(post =>
      post.id === comment.postId ? { ...post, comments: Math.max(0, post.comments - 1) } : post
    ));
    setDeleteDialog({ isOpen: false, commentId: null });
  };

  const handleShare = (post: Post) => {
    setShareModal({ isOpen: true, post });
  };

  const getPostComments = (postId: string) => {
    return comments.filter(c => c.postId === postId).sort((a, b) => a.timestamp - b.timestamp);
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'announcements') return post.type === 'announcement';
    if (activeTab === 'preachings') return post.type === 'preaching';
    return true;
  });

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Community Feed</h1>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200 overflow-x-auto">
          {(['all', 'announcements', 'preachings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all whitespace-nowrap ${
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
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={`What's on your heart today, ${currentUser.name.split(' ')[0]}?`}
              className="w-full p-3 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-100 resize-none h-24 text-slate-700 placeholder:text-slate-400"
            />
            <div className="flex flex-wrap justify-between items-center gap-2">
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
                disabled={!newPostContent.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <Send size={18} />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPosts.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          description={activeTab === 'all'
            ? "Be the first to share something with the community!"
            : `No ${activeTab} have been posted yet.`}
          action={activeTab !== 'all' ? {
            label: 'View All Posts',
            onClick: () => setActiveTab('all')
          } : undefined}
        />
      )}

      {/* Feed Stream */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const postComments = getPostComments(post.id);
            const isLiked = post.likedBy.includes(currentUser.id);
            const isExpanded = expandedComments[post.id];

            return (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
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
                      <p className="text-xs text-slate-400">{formatTimeAgo(post.timestamp)}</p>
                    </div>
                  </div>

                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>

                  {post.image && (
                    <div className="mt-4 -mx-4">
                      <img src={post.image} alt="Post attachment" className="w-full max-h-96 object-cover" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-slate-500">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors min-w-[60px] ${
                      isLiked ? 'text-blue-600' : 'hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare size={18} />
                    <span className="text-sm font-medium">{post.comments} Comments</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                  >
                    <Share2 size={18} />
                    <span className="text-sm font-medium hidden sm:inline">Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                {isExpanded && (
                  <div className="border-t border-slate-100">
                    {/* Comments List */}
                    <div className="max-h-64 overflow-y-auto">
                      {postComments.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-sm">
                          No comments yet. Be the first to comment!
                        </div>
                      ) : (
                        postComments.map((comment) => (
                          <div key={comment.id} className="p-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50">
                            <div className="flex gap-3">
                              <img
                                src={comment.userAvatar}
                                alt={comment.userName}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-slate-800">{comment.userName}</span>
                                    <span className="text-xs text-slate-400">{formatTimeAgo(comment.timestamp)}</span>
                                  </div>
                                  {comment.userId === currentUser.id && (
                                    <button
                                      onClick={() => setDeleteDialog({ isOpen: true, commentId: comment.id })}
                                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <div className="flex gap-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={newCommentContent[post.id] || ''}
                            onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newCommentContent[post.id]?.trim()}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Share Modal */}
      {shareModal.post && (
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false, post: null })}
          title={shareModal.post.content.slice(0, 100)}
          text={shareModal.post.content}
          url={`${window.location.origin}/post/${shareModal.post.id}`}
        />
      )}

      {/* Delete Comment Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteDialog.commentId && handleDeleteComment(deleteDialog.commentId)}
        onCancel={() => setDeleteDialog({ isOpen: false, commentId: null })}
      />
    </div>
  );
};

export default Feed;
