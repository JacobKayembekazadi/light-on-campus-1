import { User, UserRole, Post, Course, CourseCategory, ChatSession } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Joshua Aluko',
  role: UserRole.MEMBER,
  avatar: 'https://picsum.photos/seed/joshua/100/100',
  campus: 'Main Campus'
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'pastor1',
    userName: 'Pastor Michael',
    userAvatar: 'https://picsum.photos/seed/pastor/100/100',
    userRole: UserRole.PASTOR,
    content: 'Sunday Service Announcement: Join us this weekend as we dive deep into the Book of Romans. Bring a friend! #LightOnCampus',
    timestamp: Date.now() - 3600000,
    likes: 45,
    comments: 12,
    type: 'announcement',
    image: 'https://picsum.photos/seed/church/800/400'
  },
  {
    id: 'p2',
    userId: 'u2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://picsum.photos/seed/sarah/100/100',
    userRole: UserRole.MEMBER,
    content: 'Really enjoyed the youth fellowship yesterday. The topic on mental health was very timely.',
    timestamp: Date.now() - 7200000,
    likes: 28,
    comments: 5,
    type: 'general'
  },
  {
    id: 'p3',
    userId: 'pastor2',
    userName: 'Rev. David',
    userAvatar: 'https://picsum.photos/seed/david/100/100',
    userRole: UserRole.PASTOR,
    content: 'Daily Devotion: Faith is the substance of things hoped for, the evidence of things not seen. Hebrews 11:1. Keep the faith strong today!',
    timestamp: Date.now() - 86400000,
    likes: 156,
    comments: 34,
    type: 'preaching'
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Foundations of Faith',
    instructor: 'Pastor Michael',
    category: CourseCategory.BIBLE_STUDY,
    description: 'A 4-week journey into the core beliefs of Christianity.',
    lessons: 8,
    duration: '4h 30m',
    thumbnail: 'https://picsum.photos/seed/bible/400/250'
  },
  {
    id: 'c2',
    title: 'Godly Relationships 101',
    instructor: 'Mrs. Sarah Connor',
    category: CourseCategory.RELATIONSHIPS,
    description: 'Navigating dating, courtship, and marriage with biblical principles.',
    lessons: 12,
    duration: '6h 15m',
    thumbnail: 'https://picsum.photos/seed/love/400/250'
  },
  {
    id: 'c3',
    title: 'Career & Purpose',
    instructor: 'Dr. John Smith',
    category: CourseCategory.EMPLOYMENT,
    description: 'Preparing for the marketplace while holding onto your values.',
    lessons: 6,
    duration: '3h 00m',
    thumbnail: 'https://picsum.photos/seed/work/400/250'
  }
];

export const MOCK_CHATS: ChatSession[] = [
  {
    id: 'chat1',
    participants: [{ id: 'ai', name: 'AI Counselor', role: UserRole.GUEST, avatar: 'https://picsum.photos/seed/ai/100/100' }],
    lastMessage: 'How can I pray for you today?',
    unreadCount: 1,
    type: 'ai_counselor'
  },
  {
    id: 'chat2',
    participants: [{ id: 'u3', name: 'Youth Group A', role: UserRole.MEMBER, avatar: 'https://picsum.photos/seed/group/100/100' }],
    lastMessage: 'Meeting is at 5 PM!',
    unreadCount: 3,
    type: 'group'
  }
];
