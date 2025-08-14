'use client';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Users, 
  Info,
  Pin,
  Reply,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { ChatMessage } from '@/lib/utils';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const { user } = useAuth();
  const { 
    activeGroup, 
    activePrivateChat, 
    messages, 
    sendMessage, 
    isLoading 
  } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const success = await sendMessage(
      messageInput,
      activeGroup?.id,
      activePrivateChat?.participants.find(p => p !== user?.uid)
    );

    if (success) {
      setMessageInput('');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isConsecutiveMessage = (currentMsg: ChatMessage, prevMsg: ChatMessage | undefined) => {
    if (!prevMsg) return false;
    const timeDiff = new Date(currentMsg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime();
    return prevMsg.senderId === currentMsg.senderId && timeDiff < 5 * 60 * 1000; // 5 minutes
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isOwnMessage = message.senderId === user?.uid;
    const prevMessage = index > 0 ? messages[index - 1] : undefined;
    const isConsecutive = isConsecutiveMessage(message, prevMessage);
    const showDateSeparator = !prevMessage || 
      formatMessageDate(message.timestamp) !== formatMessageDate(prevMessage.timestamp);

    return (
      <div key={message.id}>
        {/* Date Separator */}
        {showDateSeparator && (
          <div className="flex items-center justify-center my-4">
            <div className="bg-secondary px-3 py-1 rounded-full">
              <span className="text-xs text-muted-foreground font-medium">
                {formatMessageDate(message.timestamp)}
              </span>
            </div>
          </div>
        )}

        {/* Message */}
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2 group`}>
          <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
            {/* Avatar */}
            {!isConsecutive && !isOwnMessage && (
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-white font-medium">
                  {message.senderName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {isConsecutive && !isOwnMessage && <div className="w-8" />}

            {/* Message Content */}
            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
              {/* Sender Name */}
              {!isConsecutive && !isOwnMessage && (
                <span className="text-xs text-muted-foreground mb-1 px-3">
                  {message.senderName}
                </span>
              )}

              {/* Message Bubble */}
              <div
                className={`px-3 py-2 rounded-lg relative ${
                  isOwnMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                } ${message.isPinned ? 'ring-2 ring-yellow-400' : ''}`}
              >
                {/* Pinned Indicator */}
                {message.isPinned && (
                  <div className="absolute -top-2 -right-2">
                    <Pin className="h-3 w-3 text-yellow-500 fill-current" />
                  </div>
                )}

                {/* Message Content */}
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>

                {/* Message Time */}
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className={`text-xs ${
                    isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                  </span>
                  {message.editedAt && (
                    <span className={`text-xs ${
                      isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      (edited)
                    </span>
                  )}
                </div>

                {/* Reactions */}
                {message.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.reactions.map((reaction, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                        {reaction.emoji} {reaction.userId === user?.uid ? 'You' : '1'}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Actions */}
              <div className={`opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex space-x-1 ${
                isOwnMessage ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Reply className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Smile className="h-3 w-3" />
                </Button>
                {isOwnMessage && (
                  <>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!activeGroup && !activePrivateChat) {
    return (
      <div className={`flex items-center justify-center h-full bg-background ${className}`}>
        <div className="text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No conversation selected</h3>
          <p className="text-sm text-muted-foreground">
            Choose a group or start a private chat to begin messaging
          </p>
        </div>
      </div>
    );
  }

  const chatTitle = activeGroup ? activeGroup.name : 'Private Chat';
  const chatSubtitle = activeGroup 
    ? `${activeGroup.members.length} members • ${activeGroup.type.replace('_', ' ')}`
    : `${activePrivateChat?.participants.length} participants`;

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{chatTitle}</h2>
              <p className="text-sm text-muted-foreground">{chatSubtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost">
              <Info className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => renderMessage(message, index))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 bg-background border border-border rounded-lg px-3 py-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleFileUpload}
                className="h-8 w-8 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-8 w-8 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            size="sm" 
            disabled={!messageInput.trim() || isLoading}
            className="h-10 w-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            // Handle file upload
            console.log('File selected:', e.target.files?.[0]);
          }}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
