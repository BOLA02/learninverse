'use client';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Send, 
  Bell, 
  Edit, 
  Trash2, 
  Users,
  Calendar,
  Clock,
  Eye,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'reminder' | 'update';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipients: 'all' | 'students' | 'teachers' | 'admins' | 'custom';
  status: 'draft' | 'scheduled' | 'sent';
  scheduledDate?: string;
  sentDate?: string;
  createdBy: string;
  createdAt: string;
  readCount: number;
  totalRecipients: number;
}

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'System Maintenance Scheduled',
      message: 'The system will be under maintenance on Sunday, February 25th from 2:00 AM to 6:00 AM EST.',
      type: 'alert',
      priority: 'high',
      recipients: 'all',
      status: 'sent',
      sentDate: '2024-02-20',
      createdBy: 'System Admin',
      createdAt: '2024-02-20',
      readCount: 892,
      totalRecipients: 1234
    },
    {
      id: '2',
      title: 'New Course Registration Open',
      message: 'Registration for Spring 2024 courses is now open. Please register by March 1st.',
      type: 'announcement',
      priority: 'medium',
      recipients: 'students',
      status: 'sent',
      sentDate: '2024-02-18',
      createdBy: 'Academic Office',
      createdAt: '2024-02-18',
      readCount: 756,
      totalRecipients: 1000
    },
    {
      id: '3',
      title: 'Assignment Deadline Reminder',
      message: 'Reminder: CS101 Assignment 3 is due tomorrow at 11:59 PM.',
      type: 'reminder',
      priority: 'medium',
      recipients: 'students',
      status: 'scheduled',
      scheduledDate: '2024-02-24',
      createdBy: 'Dr. John Smith',
      createdAt: '2024-02-22',
      readCount: 0,
      totalRecipients: 45
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement' as Notification['type'],
    priority: 'medium' as Notification['priority'],
    recipients: 'all' as Notification['recipients'],
    scheduledDate: ''
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'announcement': return <MessageSquare className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'update': return <Info className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'alert': return 'bg-red-100 text-red-800 border-red-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'update': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecipientCount = (recipients: Notification['recipients']) => {
    switch (recipients) {
      case 'all': return 1234;
      case 'students': return 1000;
      case 'teachers': return 150;
      case 'admins': return 84;
      case 'custom': return 0;
      default: return 0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...formData,
      status: formData.scheduledDate ? 'scheduled' : 'draft',
      createdBy: 'Current Admin',
      createdAt: new Date().toISOString().split('T')[0],
      readCount: 0,
      totalRecipients: getRecipientCount(formData.recipients)
    };

    if (editingNotification) {
      setNotifications(notifications.map(n => 
        n.id === editingNotification.id ? { ...n, ...formData } : n
      ));
      toast.success('Notification updated successfully!');
    } else {
      setNotifications([newNotification, ...notifications]);
      toast.success('Notification created successfully!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'announcement',
      priority: 'medium',
      recipients: 'all',
      scheduledDate: ''
    });
    setShowCreateForm(false);
    setEditingNotification(null);
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      recipients: notification.recipients,
      scheduledDate: notification.scheduledDate || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = (notificationId: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success('Notification deleted successfully!');
    }
  };

  const handleSendNow = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId 
        ? { ...n, status: 'sent' as Notification['status'], sentDate: new Date().toISOString().split('T')[0] }
        : n
    ));
    toast.success('Notification sent successfully!');
  };

  return (
    <AdminLayout 
      title="Notifications & Communication" 
      description="Send announcements, alerts, and manage communication with users"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="update">Update</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Notification
          </Button>
        </div>

        {/* Create/Edit Notification Form */}
        {showCreateForm && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{editingNotification ? 'Edit Notification' : 'Create New Notification'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: Notification['type']) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: Notification['priority']) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients</Label>
                    <Select value={formData.recipients} onValueChange={(value: Notification['recipients']) => setFormData({ ...formData, recipients: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="teachers">Teachers Only</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="custom">Custom Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Schedule for Later (Optional)</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingNotification ? 'Update Notification' : 'Create Notification'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{notification.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                          <Badge className={getStatusColor(notification.status)}>
                            {notification.status}
                          </Badge>
                          <Badge variant="outline">
                            {notification.recipients}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{notification.totalRecipients} recipients</span>
                      </div>
                      {notification.status === 'sent' && (
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>{notification.readCount} read ({Math.round((notification.readCount / notification.totalRecipients) * 100)}%)</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {notification.status === 'sent' 
                            ? `Sent: ${notification.sentDate}`
                            : notification.status === 'scheduled'
                            ? `Scheduled: ${notification.scheduledDate}`
                            : `Created: ${notification.createdAt}`
                          }
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        By: {notification.createdBy}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {notification.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleSendNow(notification.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Now
                      </Button>
                    )}
                    {notification.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => handleSendNow(notification.id)}
                        variant="outline"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Now
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(notification)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NotificationManagement;
