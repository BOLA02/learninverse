'use client';
import { ChatProvider } from '@/contexts/ChatContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatInterface from '@/components/chat/ChatInterface';

const ChatPage = () => {
  return (
    <ProtectedRoute requiredRole="student">
      <ChatProvider>
        <div className="h-screen flex bg-[#f7f9fa]">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <ChatSidebar />
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1">
            <ChatInterface />
          </div>
        </div>
      </ChatProvider>
    </ProtectedRoute>
  );
};

export default ChatPage;
