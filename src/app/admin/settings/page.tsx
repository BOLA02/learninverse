'use client';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Save, 
  Calendar, 
  Mail, 
  Shield, 
  Database,
  Bell,
  Palette,
  Globe,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    institutionName: 'Learninverse University',
    institutionEmail: 'admin@learninverse.edu',
    institutionPhone: '+1 (555) 123-4567',
    institutionAddress: '123 Education Street, Learning City, LC 12345',
    timezone: 'America/New_York',
    language: 'en',
    academicYearStart: '2024-09-01',
    academicYearEnd: '2025-06-30'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.learninverse.edu',
    smtpPort: '587',
    smtpUsername: 'noreply@learninverse.edu',
    smtpPassword: '••••••••',
    enableEmailNotifications: true,
    enableAssignmentReminders: true,
    enableGradeNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30,
    enableLoginAttemptLimit: true,
    maxLoginAttempts: 5,
    enableIPWhitelist: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableSystemNotifications: true,
    enableMaintenanceAlerts: true,
    enablePerformanceAlerts: true,
    enableSecurityAlerts: true,
    alertEmail: 'alerts@learninverse.edu'
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'academic', label: 'Academic Calendar', icon: Calendar },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleSaveSettings = (settingsType: string) => {
    toast.success(`${settingsType} settings saved successfully!`);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="institutionName">Institution Name</Label>
          <Input
            id="institutionName"
            value={generalSettings.institutionName}
            onChange={(e) => setGeneralSettings({...generalSettings, institutionName: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institutionEmail">Institution Email</Label>
          <Input
            id="institutionEmail"
            type="email"
            value={generalSettings.institutionEmail}
            onChange={(e) => setGeneralSettings({...generalSettings, institutionEmail: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institutionPhone">Phone Number</Label>
          <Input
            id="institutionPhone"
            value={generalSettings.institutionPhone}
            onChange={(e) => setGeneralSettings({...generalSettings, institutionPhone: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="institutionAddress">Institution Address</Label>
        <Textarea
          id="institutionAddress"
          value={generalSettings.institutionAddress}
          onChange={(e) => setGeneralSettings({...generalSettings, institutionAddress: e.target.value})}
          rows={3}
        />
      </div>
      
      <Button onClick={() => handleSaveSettings('General')}>
        <Save className="h-4 w-4 mr-2" />
        Save General Settings
      </Button>
    </div>
  );

  const renderAcademicSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="academicYearStart">Academic Year Start</Label>
          <Input
            id="academicYearStart"
            type="date"
            value={generalSettings.academicYearStart}
            onChange={(e) => setGeneralSettings({...generalSettings, academicYearStart: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="academicYearEnd">Academic Year End</Label>
          <Input
            id="academicYearEnd"
            type="date"
            value={generalSettings.academicYearEnd}
            onChange={(e) => setGeneralSettings({...generalSettings, academicYearEnd: e.target.value})}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Important Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fall Semester Start</Label>
            <Input type="date" defaultValue="2024-09-01" />
          </div>
          <div className="space-y-2">
            <Label>Fall Semester End</Label>
            <Input type="date" defaultValue="2024-12-15" />
          </div>
          <div className="space-y-2">
            <Label>Spring Semester Start</Label>
            <Input type="date" defaultValue="2025-01-15" />
          </div>
          <div className="space-y-2">
            <Label>Spring Semester End</Label>
            <Input type="date" defaultValue="2025-05-15" />
          </div>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('Academic Calendar')}>
        <Save className="h-4 w-4 mr-2" />
        Save Academic Settings
      </Button>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="smtpHost">SMTP Host</Label>
          <Input
            id="smtpHost"
            value={emailSettings.smtpHost}
            onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="smtpPort">SMTP Port</Label>
          <Input
            id="smtpPort"
            value={emailSettings.smtpPort}
            onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="smtpUsername">SMTP Username</Label>
          <Input
            id="smtpUsername"
            value={emailSettings.smtpUsername}
            onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="smtpPassword">SMTP Password</Label>
          <Input
            id="smtpPassword"
            type="password"
            value={emailSettings.smtpPassword}
            onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
            <Switch
              id="enableEmailNotifications"
              checked={emailSettings.enableEmailNotifications}
              onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableEmailNotifications: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enableAssignmentReminders">Assignment Reminders</Label>
            <Switch
              id="enableAssignmentReminders"
              checked={emailSettings.enableAssignmentReminders}
              onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableAssignmentReminders: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enableGradeNotifications">Grade Notifications</Label>
            <Switch
              id="enableGradeNotifications"
              checked={emailSettings.enableGradeNotifications}
              onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableGradeNotifications: checked})}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('Email')}>
        <Save className="h-4 w-4 mr-2" />
        Save Email Settings
      </Button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Authentication</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
            <Switch
              id="enableTwoFactor"
              checked={securitySettings.enableTwoFactor}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactor: checked})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                min="6"
                max="20"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                max="120"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="passwordRequireSpecialChars">Require Special Characters in Password</Label>
            <Switch
              id="passwordRequireSpecialChars"
              checked={securitySettings.passwordRequireSpecialChars}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, passwordRequireSpecialChars: checked})}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Login Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableLoginAttemptLimit">Enable Login Attempt Limit</Label>
            <Switch
              id="enableLoginAttemptLimit"
              checked={securitySettings.enableLoginAttemptLimit}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableLoginAttemptLimit: checked})}
            />
          </div>
          
          {securitySettings.enableLoginAttemptLimit && (
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Maximum Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="3"
                max="10"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enableIPWhitelist">Enable IP Whitelist</Label>
            <Switch
              id="enableIPWhitelist"
              checked={securitySettings.enableIPWhitelist}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableIPWhitelist: checked})}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('Security')}>
        <Save className="h-4 w-4 mr-2" />
        Save Security Settings
      </Button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="alertEmail">Alert Email Address</Label>
        <Input
          id="alertEmail"
          type="email"
          value={notificationSettings.alertEmail}
          onChange={(e) => setNotificationSettings({...notificationSettings, alertEmail: e.target.value})}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">System Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableSystemNotifications">System Notifications</Label>
            <Switch
              id="enableSystemNotifications"
              checked={notificationSettings.enableSystemNotifications}
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enableSystemNotifications: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enableMaintenanceAlerts">Maintenance Alerts</Label>
            <Switch
              id="enableMaintenanceAlerts"
              checked={notificationSettings.enableMaintenanceAlerts}
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enableMaintenanceAlerts: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enablePerformanceAlerts">Performance Alerts</Label>
            <Switch
              id="enablePerformanceAlerts"
              checked={notificationSettings.enablePerformanceAlerts}
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enablePerformanceAlerts: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enableSecurityAlerts">Security Alerts</Label>
            <Switch
              id="enableSecurityAlerts"
              checked={notificationSettings.enableSecurityAlerts}
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enableSecurityAlerts: checked})}
            />
          </div>
        </div>
      </div>
      
      <Button onClick={() => handleSaveSettings('Notification')}>
        <Save className="h-4 w-4 mr-2" />
        Save Notification Settings
      </Button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'academic':
        return renderAcademicSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Appearance settings coming soon...</p>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <AdminLayout 
      title="System Settings" 
      description="Configure system settings and preferences"
    >
      <div className="space-y-6">
        {/* Settings Navigation */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {(() => {
                const activeTabData = tabs.find(tab => tab.id === activeTab);
                const IconComponent = activeTabData?.icon;
                return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
              })()}
              <span>{tabs.find(tab => tab.id === activeTab)?.label} Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderTabContent()}
          </CardContent>
        </Card>
      </div> 
    </AdminLayout>
  );
};

export default SystemSettings;
