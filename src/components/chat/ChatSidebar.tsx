'use client';
import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Users,
  MessageSquare,
  Hash,
  BookOpen,
  GraduationCap,
  Settings,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { ChatGroup } from '@/lib/utils';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';

interface ChatSidebarProps {
  className?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ className }) => {
  const { user } = useAuth();
  const { groups, activeGroup, setActiveGroup, privateChats, activePrivateChat, setActivePrivateChat } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'groups' | 'private'>('groups');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showGroupActions, setShowGroupActions] = useState(false);

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupIcon = (type: ChatGroup['type']) => {
    switch (type) {
      case 'class': return <GraduationCap className="h-4 w-4" />;
      case 'study_group': return <BookOpen className="h-4 w-4" />;
      case 'project': return <Users className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  const getGroupTypeColor = (type: ChatGroup['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'study_group': return 'bg-green-100 text-green-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const isUserGroupAdmin = (group: ChatGroup) => {
    const member = group.members.find(m => m.userId === user?.id);
    return member?.role === 'admin';
  };

  return (
    <div className={`bg-card border-r border-border h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowGroupActions(!showGroupActions)}
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Dropdown Menu */}
            {showGroupActions && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setShowCreateModal(true);
                      setShowGroupActions(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setShowJoinModal(true);
                      setShowGroupActions(false);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Group
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex mt-4 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'groups'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'private'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Private
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'groups' ? (
          <div className="p-2">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => {
                  setActiveGroup(group);
                  setActivePrivateChat(null);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  activeGroup?.id === group.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Group Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center">
                      {getGroupIcon(group.type)}
                    </div>
                  </div>
                  
                  {/* Group Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {group.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {isUserGroupAdmin(group) && (
                          <Badge variant="outline" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        {group.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatLastMessageTime(group.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getGroupTypeColor(group.type)}`}>
                          {group.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {group.members.length} members
                        </span>
                      </div>
                    </div>
                    
                    {group.lastMessage && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        <span className="font-medium">{group.lastMessage.senderName}:</span>{' '}
                        {group.lastMessage.content}
                      </p>
                    )}
                    
                    {group.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredGroups.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No groups found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create a group or join one with an invite code
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            {privateChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setActivePrivateChat(chat);
                  setActiveGroup(null);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  activePrivateChat?.id === chat.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-foreground">
                      Private Chat
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {chat.participants.length} participants
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {privateChats.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No private chats</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start a conversation with a classmate
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  );
};

export default ChatSidebar;
