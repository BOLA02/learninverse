import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// User types and roles
export type UserRole = 'student' | 'teacher' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  studentId?: string;
  teacherId?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

// Mock user data for development
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'alex.student@learninverse.com',
    name: 'Alex Johnson',
    role: 'student',
    studentId: 'STU001',
    department: 'Computer Science',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-20',
    isActive: true
  },
  {
    id: '2',
    email: 'admin@learninverse.com',
    name: 'Sarah Admin',
    role: 'admin',
    department: 'Administration',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-20',
    isActive: true
  },
  {
    id: '3',
    email: 'john.teacher@learninverse.com',
    name: 'Dr. John Smith',
    role: 'teacher',
    teacherId: 'TCH001',
    department: 'Mathematics',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-19',
    isActive: true
  }
];

// Authentication utilities
export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

export const setStoredUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('loggedIn', 'true');
  }
};

export const clearStoredUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loggedIn');
  }
};

export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    student: 1,
    teacher: 2,
    admin: 3,
    super_admin: 4
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Chat System Types
export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  type: 'class' | 'study_group' | 'project' | 'general';
  academicYear?: string;
  course?: string;
  subjects?: string[];
  createdBy: string;
  createdAt: string;
  members: GroupMember[];
  lastMessage?: ChatMessage;
  isActive: boolean;
  inviteCode: string;
}

export interface GroupMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  permissions: GroupPermission[];
}

export type GroupPermission =
  | 'send_messages'
  | 'send_media'
  | 'add_members'
  | 'remove_members'
  | 'edit_group_info'
  | 'delete_messages'
  | 'pin_messages'
  | 'manage_permissions';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  groupId?: string; // For group messages
  recipientId?: string; // For private messages
  content: string;
  type: 'text' | 'file' | 'image' | 'video' | 'audio' | 'document';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  timestamp: string;
  editedAt?: string;
  replyTo?: string; // Message ID being replied to
  isPinned: boolean;
  readBy: MessageRead[];
  reactions: MessageReaction[];
}

export interface MessageRead {
  userId: string;
  readAt: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface PrivateChat {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessage?: ChatMessage;
  createdAt: string;
  isActive: boolean;
}

// Mock data for development
export const mockChatGroups: ChatGroup[] = [
  {
    id: '1',
    name: 'CS 2024 - Year 3',
    description: 'Computer Science Year 3 Class Group',
    type: 'class',
    academicYear: '2024',
    course: 'Computer Science',
    subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
    createdBy: '1', // Alex (student)
    createdAt: '2024-01-15',
    members: [
      { userId: '1', role: 'admin', joinedAt: '2024-01-15', permissions: ['send_messages', 'send_media', 'add_members', 'remove_members', 'edit_group_info'] },
      { userId: '2', role: 'member', joinedAt: '2024-01-16', permissions: ['send_messages', 'send_media'] },
      { userId: '3', role: 'member', joinedAt: '2024-01-16', permissions: ['send_messages', 'send_media'] }
    ],
    isActive: true,
    inviteCode: 'CS2024Y3'
  },
  {
    id: '2',
    name: 'Math Study Group',
    description: 'Calculus and Linear Algebra study sessions',
    type: 'study_group',
    academicYear: '2024',
    course: 'Mathematics',
    subjects: ['Calculus', 'Linear Algebra'],
    createdBy: '3', // John (teacher)
    createdAt: '2024-01-20',
    members: [
      { userId: '3', role: 'admin', joinedAt: '2024-01-20', permissions: ['send_messages', 'send_media', 'add_members', 'remove_members', 'edit_group_info'] },
      { userId: '1', role: 'member', joinedAt: '2024-01-21', permissions: ['send_messages', 'send_media'] }
    ],
    isActive: true,
    inviteCode: 'MATHSTUDY'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Alex Johnson',
    groupId: '1',
    content: 'Hey everyone! Welcome to our class group. Feel free to share notes and ask questions here.',
    type: 'text',
    timestamp: '2024-01-15T10:00:00Z',
    isPinned: true,
    readBy: [
      { userId: '1', readAt: '2024-01-15T10:00:00Z' },
      { userId: '2', readAt: '2024-01-15T10:30:00Z' }
    ],
    reactions: [
      { userId: '2', emoji: '👍', timestamp: '2024-01-15T10:05:00Z' }
    ]
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Sarah Admin',
    groupId: '1',
    content: 'Thanks for creating this group! This will be really helpful for coordination.',
    type: 'text',
    timestamp: '2024-01-15T10:30:00Z',
    isPinned: false,
    readBy: [
      { userId: '2', readAt: '2024-01-15T10:30:00Z' },
      { userId: '1', readAt: '2024-01-15T10:35:00Z' }
    ],
    reactions: []
  }
];
