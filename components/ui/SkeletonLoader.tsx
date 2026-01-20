import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const PostSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex gap-4">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);

export const CourseSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5">
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

export const ChatSkeleton: React.FC = () => (
  <div className="p-4 border-b border-slate-100">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  </div>
);

export const MessageSkeleton: React.FC<{ isMe?: boolean }> = ({ isMe = false }) => (
  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe ? 'bg-slate-200' : 'bg-slate-100'}`}>
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <Skeleton className="h-32 w-full rounded-none" />
    <div className="px-8 pb-8">
      <div className="relative -mt-12 mb-4">
        <Skeleton className="w-24 h-24 rounded-full border-4 border-white" />
      </div>
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-5 w-24 mb-6" />
      <div className="flex gap-6 mb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </div>
);

export default Skeleton;
