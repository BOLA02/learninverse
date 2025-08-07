'use client';
import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Hash,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose }) => {
  const { joinGroup, groups } = useChat();
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await joinGroup(inviteCode.trim().toUpperCase());
      if (success) {
        toast.success('Successfully joined the group!');
        handleClose();
      }
    } catch (error) {
      setError('Failed to join group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setInviteCode('');
    setError('');
    onClose();
  };

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'class': return <GraduationCap className="h-4 w-4" />;
      case 'study_group': return <BookOpen className="h-4 w-4" />;
      case 'project': return <Users className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'study_group': return 'bg-green-100 text-green-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Preview group if invite code matches
  const previewGroup = groups.find(g => g.inviteCode === inviteCode.trim().toUpperCase());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Join Group</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invite Code Input */}
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                  setError('');
                }}
                placeholder="Enter group invite code"
                className="text-center font-mono text-lg tracking-wider"
                maxLength={10}
                required
              />
              <p className="text-xs text-muted-foreground text-center">
                Ask your classmate for the group invite code
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Group Preview */}
            {previewGroup && (
              <div className="bg-secondary p-4 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center">
                    {getGroupIcon(previewGroup.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{previewGroup.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${getGroupTypeColor(previewGroup.type)}`}>
                        {previewGroup.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {previewGroup.members.length} members
                      </span>
                    </div>
                    {previewGroup.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {previewGroup.description}
                      </p>
                    )}
                    {previewGroup.course && (
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>Course: {previewGroup.course}</span>
                        {previewGroup.academicYear && (
                          <span>Year: {previewGroup.academicYear}</span>
                        )}
                      </div>
                    )}
                    {previewGroup.subjects && previewGroup.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {previewGroup.subjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !inviteCode.trim()}
            >
              {isLoading ? 'Joining Group...' : 'Join Group'}
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">How to join a group:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Ask a group member for the invite code</li>
              <li>• Enter the code in the field above</li>
              <li>• Click "Join Group" to become a member</li>
              <li>• You'll be able to chat with all group members</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinGroupModal;
