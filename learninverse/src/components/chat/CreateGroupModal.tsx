'use client';
import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Hash,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { ChatGroup } from '@/lib/utils';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { createGroup } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'invite'>('details');
  const [createdGroup, setCreatedGroup] = useState<ChatGroup | null>(null);
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'class' as ChatGroup['type'],
    academicYear: '2024',
    course: '',
    subjects: [] as string[]
  });

  const [subjectInput, setSubjectInput] = useState('');

  const groupTypes: Array<{
    value: ChatGroup['type'];
    label: string;
    icon: any;
    description: string;
  }> = [
    { value: 'class', label: 'Class Group', icon: GraduationCap, description: 'For students in the same class/year' },
    { value: 'study_group', label: 'Study Group', icon: BookOpen, description: 'For collaborative studying' },
    { value: 'project', label: 'Project Team', icon: Users, description: 'For group projects and assignments' },
    { value: 'general', label: 'General', icon: Hash, description: 'For general discussions' }
  ];

  const academicYears = ['2024', '2023', '2022', '2021'];
  const courses = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'English Literature',
    'Business Administration',
    'Engineering',
    'Medicine'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    setIsLoading(true);
    try {
      const newGroup = await createGroup(formData);
      setCreatedGroup(newGroup);
      setStep('invite');
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error('Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subjectInput.trim()]
      });
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter(s => s !== subject)
    });
  };

  const handleCopyInviteCode = async () => {
    if (createdGroup?.inviteCode) {
      try {
        await navigator.clipboard.writeText(createdGroup.inviteCode);
        setInviteCodeCopied(true);
        toast.success('Invite code copied to clipboard!');
        setTimeout(() => setInviteCodeCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy invite code');
      }
    }
  };

  const handleClose = () => {
    setStep('details');
    setCreatedGroup(null);
    setFormData({
      name: '',
      description: '',
      type: 'class',
      academicYear: '2024',
      course: '',
      subjects: []
    });
    setSubjectInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {step === 'details' ? 'Create New Group' : 'Group Created!'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {step === 'details' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., CS 2024 - Year 3"
                  required
                />
              </div>

              {/* Group Type */}
              <div className="space-y-2">
                <Label>Group Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {groupTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        formData.type === type.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <type.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Academic Details */}
              {(formData.type === 'class' || formData.type === 'study_group') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Select value={formData.academicYear} onValueChange={(value) => setFormData({ ...formData, academicYear: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(course => (
                          <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Subjects */}
              {(formData.type === 'class' || formData.type === 'study_group') && (
                <div className="space-y-2">
                  <Label>Subjects</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      placeholder="Add a subject"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                    />
                    <Button type="button" onClick={handleAddSubject} size="sm">
                      Add
                    </Button>
                  </div>
                  {formData.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveSubject(subject)}>
                          {subject} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the group..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Group...' : 'Create Group'}
              </Button>
            </form>
          ) : (
            /* Invite Step */
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {createdGroup?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your group has been created successfully! Share the invite code with your classmates.
                </p>
              </div>

              {/* Invite Code */}
              <div className="bg-secondary p-4 rounded-lg">
                <Label className="text-sm text-muted-foreground">Invite Code</Label>
                <div className="flex items-center justify-between mt-2">
                  <code className="text-lg font-mono font-bold text-primary">
                    {createdGroup?.inviteCode}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyInviteCode}
                    className="ml-2"
                  >
                    {inviteCodeCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Group Details */}
              <div className="text-left bg-card border border-border rounded-lg p-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{createdGroup?.type.replace('_', ' ')}</span>
                  </div>
                  {createdGroup?.course && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Course:</span>
                      <span>{createdGroup.course}</span>
                    </div>
                  )}
                  {createdGroup?.academicYear && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year:</span>
                      <span>{createdGroup.academicYear}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Members:</span>
                    <span>{createdGroup?.members.length} (You as Admin)</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Close
                </Button>
                <Button onClick={handleCopyInviteCode} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGroupModal;
