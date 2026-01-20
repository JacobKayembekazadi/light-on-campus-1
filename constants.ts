import { User, UserRole, Post, Course, CourseCategory, ChatSession, Comment, Enrollment } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Joshua Aluko',
  role: UserRole.MEMBER,
  avatar: 'https://picsum.photos/seed/joshua/100/100',
  campus: 'Main Campus',
  email: 'joshua.aluko@example.com',
  bio: 'Passionate about faith and community. Computer Science student.',
  joinedDate: '2023-10-15'
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
    likedBy: ['u2', 'u3', 'u4'],
    comments: 3,
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
    likedBy: ['u1', 'pastor1'],
    comments: 2,
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
    likedBy: ['u1', 'u2', 'u3', 'u4', 'u5'],
    comments: 5,
    type: 'preaching'
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment1',
    postId: 'p1',
    userId: 'u2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://picsum.photos/seed/sarah/100/100',
    content: 'Can\'t wait! Will definitely be there with my roommate.',
    timestamp: Date.now() - 3000000
  },
  {
    id: 'comment2',
    postId: 'p1',
    userId: 'u3',
    userName: 'Michael Brown',
    userAvatar: 'https://picsum.photos/seed/michael/100/100',
    content: 'Romans is my favorite book! Thank you Pastor.',
    timestamp: Date.now() - 2500000
  },
  {
    id: 'comment3',
    postId: 'p1',
    userId: 'u4',
    userName: 'Grace Thompson',
    userAvatar: 'https://picsum.photos/seed/grace/100/100',
    content: 'Praying for a powerful service!',
    timestamp: Date.now() - 2000000
  },
  {
    id: 'comment4',
    postId: 'p2',
    userId: 'pastor1',
    userName: 'Pastor Michael',
    userAvatar: 'https://picsum.photos/seed/pastor/100/100',
    content: 'So glad you could make it, Sarah! Mental health is so important.',
    timestamp: Date.now() - 6000000
  },
  {
    id: 'comment5',
    postId: 'p2',
    userId: 'u3',
    userName: 'Michael Brown',
    userAvatar: 'https://picsum.photos/seed/michael/100/100',
    content: 'I missed it! Will there be a recording?',
    timestamp: Date.now() - 5000000
  },
  {
    id: 'comment6',
    postId: 'p3',
    userId: 'u1',
    userName: 'Joshua Aluko',
    userAvatar: 'https://picsum.photos/seed/joshua/100/100',
    content: 'Amen! This verse has been carrying me through finals week.',
    timestamp: Date.now() - 80000000
  },
  {
    id: 'comment7',
    postId: 'p3',
    userId: 'u2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://picsum.photos/seed/sarah/100/100',
    content: 'Such a timely word! Thank you Rev. David.',
    timestamp: Date.now() - 78000000
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

export const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'e1',
    courseId: 'c1',
    userId: 'u1',
    progress: 80,
    completedLessons: [0, 1, 2, 3, 4, 5],
    enrolledAt: Date.now() - 604800000, // 7 days ago
    lastAccessedAt: Date.now() - 86400000 // 1 day ago
  },
  {
    id: 'e2',
    courseId: 'c2',
    userId: 'u1',
    progress: 35,
    completedLessons: [0, 1, 2, 3],
    enrolledAt: Date.now() - 1209600000, // 14 days ago
    lastAccessedAt: Date.now() - 172800000 // 2 days ago
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
  },
  {
    id: 'chat3',
    participants: [{ id: 'pastor1', name: 'Pastor Michael', role: UserRole.PASTOR, avatar: 'https://picsum.photos/seed/pastor/100/100' }],
    lastMessage: 'God bless you!',
    unreadCount: 0,
    type: 'personal'
  }
];
