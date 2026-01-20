export enum UserRole {
  MEMBER = 'MEMBER',
  PASTOR = 'PASTOR',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  campus?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
  type: 'general' | 'announcement' | 'preaching';
  image?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: CourseCategory;
  description: string;
  lessons: number;
  duration: string;
  thumbnail: string;
  content?: string; // Markdown content for the course
}

export enum CourseCategory {
  BIBLE_STUDY = 'Bible Study',
  RELATIONSHIPS = 'Love & Relationships',
  LEADERSHIP = 'Leadership',
  PERSONAL_BRANDING = 'Personal Branding',
  EMPLOYMENT = 'Career & Employment',
  PRAYER = 'Prayer',
  COUNSELING = 'Counseling',
  SOCIAL_LIFE = 'Social Life'
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  isAi?: boolean;
}

export interface ChatSession {
  id: string;
  participants: User[];
  lastMessage: string;
  unreadCount: number;
  type: 'personal' | 'group' | 'ai_counselor';
}
