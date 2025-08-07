'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ChatGroup, 
  ChatMessage, 
  PrivateChat, 
  GroupMember, 
  GroupPermission,
  mockChatGroups,
  mockChatMessages 
} from '@/lib/utils';
import { useAuth } from './AuthContext';

interface ChatContextType {
  // Groups
  groups: ChatGroup[];
  activeGroup: ChatGroup | null;
  setActiveGroup: (group: ChatGroup | null) => void;
  createGroup: (groupData: Partial<ChatGroup>) => Promise<ChatGroup>;
  joinGroup: (inviteCode: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  updateGroupInfo: (groupId: string, updates: Partial<ChatGroup>) => Promise<boolean>;
  
  // Members
  addMember: (groupId: string, userId: string) => Promise<boolean>;
  removeMember: (groupId: string, userId: string) => Promise<boolean>;
  updateMemberRole: (groupId: string, userId: string, role: GroupMember['role']) => Promise<boolean>;
  updateMemberPermissions: (groupId: string, userId: string, permissions: GroupPermission[]) => Promise<boolean>;
  
  // Messages
  messages: ChatMessage[];
  sendMessage: (content: string, groupId?: string, recipientId?: string, type?: ChatMessage['type']) => Promise<boolean>;
  editMessage: (messageId: string, newContent: string) => Promise<boolean>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  pinMessage: (messageId: string) => Promise<boolean>;
  unpinMessage: (messageId: string) => Promise<boolean>;
  
  // Private Chats
  privateChats: PrivateChat[];
  activePrivateChat: PrivateChat | null;
  setActivePrivateChat: (chat: PrivateChat | null) => void;
  startPrivateChat: (userId: string) => Promise<PrivateChat>;
  
  // Utilities
  getUnreadCount: (groupId?: string, userId?: string) => number;
  markAsRead: (messageId: string) => Promise<boolean>;
  searchMessages: (query: string, groupId?: string) => ChatMessage[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<ChatGroup[]>(mockChatGroups);
  const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
  const [activePrivateChat, setActivePrivateChat] = useState<PrivateChat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter messages based on active group or private chat
  const filteredMessages = messages.filter(message => {
    if (activeGroup) {
      return message.groupId === activeGroup.id;
    }
    if (activePrivateChat) {
      return (message.senderId === user?.id && message.recipientId === activePrivateChat.participants.find(p => p !== user?.id)) ||
             (message.recipientId === user?.id && message.senderId === activePrivateChat.participants.find(p => p !== user?.id));
    }
    return [];
  });

  const createGroup = async (groupData: Partial<ChatGroup>): Promise<ChatGroup> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newGroup: ChatGroup = {
        id: Date.now().toString(),
        name: groupData.name || 'New Group',
        description: groupData.description,
        type: groupData.type || 'general',
        academicYear: groupData.academicYear,
        course: groupData.course,
        subjects: groupData.subjects,
        createdBy: user?.id || '',
        createdAt: new Date().toISOString(),
        members: [
          {
            userId: user?.id || '',
            role: 'admin',
            joinedAt: new Date().toISOString(),
            permissions: ['send_messages', 'send_media', 'add_members', 'remove_members', 'edit_group_info', 'delete_messages', 'pin_messages', 'manage_permissions']
          }
        ],
        isActive: true,
        inviteCode: generateInviteCode()
      };
      
      setGroups(prev => [newGroup, ...prev]);
      setIsLoading(false);
      return newGroup;
    } catch (err) {
      setError('Failed to create group');
      setIsLoading(false);
      throw err;
    }
  };

  const joinGroup = async (inviteCode: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const group = groups.find(g => g.inviteCode === inviteCode);
      if (!group) {
        setError('Invalid invite code');
        setIsLoading(false);
        return false;
      }
      
      const isAlreadyMember = group.members.some(m => m.userId === user?.id);
      if (isAlreadyMember) {
        setError('You are already a member of this group');
        setIsLoading(false);
        return false;
      }
      
      const updatedGroup = {
        ...group,
        members: [
          ...group.members,
          {
            userId: user?.id || '',
            role: 'member' as const,
            joinedAt: new Date().toISOString(),
            permissions: ['send_messages', 'send_media'] as GroupPermission[]
          }
        ]
      };
      
      setGroups(prev => prev.map(g => g.id === group.id ? updatedGroup : g));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Failed to join group');
      setIsLoading(false);
      return false;
    }
  };

  const sendMessage = async (
    content: string, 
    groupId?: string, 
    recipientId?: string, 
    type: ChatMessage['type'] = 'text'
  ): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        groupId,
        recipientId,
        content,
        type,
        timestamp: new Date().toISOString(),
        isPinned: false,
        readBy: [{ userId: user.id, readAt: new Date().toISOString() }],
        reactions: []
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update last message in group or private chat
      if (groupId) {
        setGroups(prev => prev.map(g => 
          g.id === groupId ? { ...g, lastMessage: newMessage } : g
        ));
      }
      
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Failed to send message');
      setIsLoading(false);
      return false;
    }
  };

  const addMember = async (groupId: string, userId: string): Promise<boolean> => {
    // Implementation for adding member
    // This would typically involve API calls
    return true;
  };

  const removeMember = async (groupId: string, userId: string): Promise<boolean> => {
    // Implementation for removing member
    return true;
  };

  const updateMemberRole = async (groupId: string, userId: string, role: GroupMember['role']): Promise<boolean> => {
    // Implementation for updating member role
    return true;
  };

  const updateMemberPermissions = async (groupId: string, userId: string, permissions: GroupPermission[]): Promise<boolean> => {
    // Implementation for updating member permissions
    return true;
  };

  const leaveGroup = async (groupId: string): Promise<boolean> => {
    // Implementation for leaving group
    return true;
  };

  const updateGroupInfo = async (groupId: string, updates: Partial<ChatGroup>): Promise<boolean> => {
    // Implementation for updating group info
    return true;
  };

  const editMessage = async (messageId: string, newContent: string): Promise<boolean> => {
    // Implementation for editing message
    return true;
  };

  const deleteMessage = async (messageId: string): Promise<boolean> => {
    // Implementation for deleting message
    return true;
  };

  const pinMessage = async (messageId: string): Promise<boolean> => {
    // Implementation for pinning message
    return true;
  };

  const unpinMessage = async (messageId: string): Promise<boolean> => {
    // Implementation for unpinning message
    return true;
  };

  const startPrivateChat = async (userId: string): Promise<PrivateChat> => {
    // Implementation for starting private chat
    const newChat: PrivateChat = {
      id: Date.now().toString(),
      participants: [user?.id || '', userId],
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setPrivateChats(prev => [newChat, ...prev]);
    return newChat;
  };

  const getUnreadCount = (groupId?: string, userId?: string): number => {
    // Implementation for getting unread count
    return 0;
  };

  const markAsRead = async (messageId: string): Promise<boolean> => {
    // Implementation for marking message as read
    return true;
  };

  const searchMessages = (query: string, groupId?: string): ChatMessage[] => {
    // Implementation for searching messages
    return messages.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase()) &&
      (!groupId || m.groupId === groupId)
    );
  };

  const generateInviteCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const value: ChatContextType = {
    groups,
    activeGroup,
    setActiveGroup,
    createGroup,
    joinGroup,
    leaveGroup,
    updateGroupInfo,
    addMember,
    removeMember,
    updateMemberRole,
    updateMemberPermissions,
    messages: filteredMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    pinMessage,
    unpinMessage,
    privateChats,
    activePrivateChat,
    setActivePrivateChat,
    startPrivateChat,
    getUnreadCount,
    markAsRead,
    searchMessages,
    isLoading,
    error
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
