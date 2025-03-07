
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Database, Sun, Moon, Save, RotateCcw, Info, Brush, Palette, Layout, Globe, BellRing, UserPlus, Trash2, UserCog, Users, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserRole } from '@/lib/types';

// Available themes
const themes = [
  { id: 'dark', name: 'Dark (Default)', primary: '#F6D365', background: '#222' },
  { id: 'light', name: 'Light', primary: '#4F46E5', background: '#F9FAFB' },
  { id: 'military', name: 'Military Green', primary: '#A3C982', background: '#2D3F2C' },
  { id: 'navy', name: 'Navy Blue', primary: '#64B6F7', background: '#0F2942' },
  { id: 'desert', name: 'Desert Sand', primary: '#E9B872', background: '#3D3937' },
];

// Available font sizes
const fontSizes = [
  { id: 'sm', name: 'Small', value: '14px' },
  { id: 'md', name: 'Medium', value: '16px' },
  { id: 'lg', name: 'Large', value: '18px' },
  { id: 'xl', name: 'Extra Large', value: '20px' },
];

// UI animation speeds
const animationSpeeds = [
  { id: 'off', name: 'Off' },
  { id: 'slow', name: 'Slow' },
  { id: 'normal', name: 'Normal' },
  { id: 'fast', name: 'Fast' },
];

const SettingsPage = () => {
  const { departments, exemptions } = useAppContext();
  const { user, allUsers, updateUser, deleteUser, register } = useAuth();
  
  // UI Settings
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('md');
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [accentColor, setAccentColor] = useState('#F6D365');
  
  // System Settings
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [appName, setAppName] = useState('Task-Force');
  const [language, setLanguage] = useState('he');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  
  // User Management
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('USER');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [editUserData, setEditUserData] = useState<{id: string, name: string, email: string, password: string, role: UserRole} | null>(null);
  
  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN';
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsDarkMode(settings.isDarkMode ?? true);
        setCurrentTheme(settings.theme ?? 'dark');
        setFontSize(settings.fontSize ?? 'md');
        setAnimationSpeed(settings.animationSpeed ?? 'normal');
        setAccentColor(settings.accentColor ?? '#F6D365');
        setIsDebugMode(settings.isDebugMode ?? false);
        setAppName(settings.appName ?? 'Task-Force');
        setLanguage(settings.language ?? 'he');
        setNotificationsEnabled(settings.notificationsEnabled ?? true);
        setBackupFrequency(settings.backupFrequency ?? 'weekly');
        
        // Apply theme
        applyTheme(settings.theme ?? 'dark', settings.isDarkMode ?? true);
        applyFontSize(settings.fontSize ?? 'md');
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);
  
  // Function to apply theme
  const applyTheme = (themeId, isDark) => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    
    // Remove all theme classes first
    document.documentElement.classList.remove('dark', 'light', 'military', 'navy', 'desert');
    
    // Add the selected theme class
    document.documentElement.classList.add(themeId);
    
    // Apply custom properties
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-background', theme.background);
  };
  
  // Function to apply font size
  const applyFontSize = (size) => {
    const fontSizeObj = fontSizes.find(f => f.id === size) || fontSizes[1];
    document.documentElement.style.setProperty('--base-font-size', fontSizeObj.value);
  };
  
  // Function to handle theme toggle
  const handleThemeToggle = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    // Keep current theme but toggle dark/light mode override
    const themeToApply = newIsDarkMode ? currentTheme : 'light';
    applyTheme(themeToApply, newIsDarkMode);
    
    toast({
      title: newIsDarkMode ? "Dark Mode Activated" : "Light Mode Activated",
      description: "Theme updated successfully",
    });
  };
  
  // Function to handle theme change
  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    applyTheme(themeId, isDarkMode);
    
    // Also update accent color based on theme
    const theme = themes.find(t => t.id === themeId) || themes[0];
    setAccentColor(theme.primary);
    
    toast({
      title: "Theme Changed",
      description: `Theme updated to ${theme.name}`,
    });
  };
  
  // Function to handle font size change
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    applyFontSize(size);
    
    toast({
      title: "Font Size Updated",
      description: "Font size changed successfully",
    });
  };
  
  // Function to save settings
  const handleSaveSettings = () => {
    const settings = {
      isDarkMode,
      theme: currentTheme,
      fontSize,
      animationSpeed,
      accentColor,
      isDebugMode,
      appName,
      language,
      notificationsEnabled,
      backupFrequency
    };
    
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Re-apply theme to ensure it takes effect
    applyTheme(currentTheme, isDarkMode);
    applyFontSize(fontSize);
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully",
    });
  };
  
  // Function to reset settings
  const handleResetSettings = () => {
    // Default settings
    setIsDarkMode(true);
    setCurrentTheme('dark');
    setFontSize('md');
    setAnimationSpeed('normal');
    setAccentColor('#F6D365');
    setIsDebugMode(false);
    setAppName('Task-Force');
    setLanguage('he');
    setNotificationsEnabled(true);
    setBackupFrequency('weekly');
    
    // Apply default theme
    applyTheme('dark', true);
    applyFontSize('md');
    
    // Remove from localStorage
    localStorage.removeItem('appSettings');
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults",
    });
  };
  
  // Function to simulate database backup
  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "Database backup has been initiated. This may take a few moments.",
    });
    
    // Simulate backup process
    setTimeout(() => {
      toast({
        title: "Backup Complete",
        description: "Database has been backed up successfully.",
      });
    }, 3000);
  };
  
  // Function to handle adding a new user
  const handleAddUser = async () => {
    try {
      if (!newUserName || !newUserEmail || !newUserPassword) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      await register(newUserName, newUserEmail, newUserPassword, newUserRole);
      
      // Reset form
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('USER');
      
      // Close dialog
      setShowAddUserDialog(false);
      
      toast({
        title: "User Added",
        description: `${newUserName} has been added successfully`,
      });
    } catch (error) {
      toast({
        title: "Error Adding User",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };
  
  // Function to handle user deletion
  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      // Confirm before deleting
      if (!window.confirm(`Are you sure you want to delete user ${userName}?`)) {
        return;
      }
      
      await deleteUser(userId);
      
      toast({
        title: "User Deleted",
        description: `${userName} has been removed successfully`,
      });
    } catch (error) {
      toast({
        title: "Error Deleting User",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };
  
  // Function to open edit user dialog
  const handleEditUser = (userId: string) => {
    const userToEdit = allUsers.find(u => u.id === userId);
    if (userToEdit) {
      setEditUserData({
        id: userToEdit.id,
        name: userToEdit.name,
        email: userToEdit.email,
        password: '', // We don't show the current password
        role: userToEdit.role
      });
    }
  };
  
  // Function to update user
  const handleUpdateUser = async () => {
    try {
      if (!editUserData) return;
      
      const updates: {name?: string, email?: string, role?: UserRole} = {};
      
      if (editUserData.name) updates.name = editUserData.name;
      if (editUserData.email) updates.email = editUserData.email;
      if (editUserData.role) updates.role = editUserData.role;
      
      await updateUser(editUserData.id, updates);
      
      // Close edit dialog
      setEditUserData(null);
      
      toast({
        title: "User Updated",
        description: "User information has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error Updating User",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.h1 
            className="text-3xl font-bold mb-6"
            variants={cardVariants}
          >
            הגדרות
          </motion.h1>
          
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Info size={16} />
                כללי
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                מראה
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database size={16} />
                מערכת
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users size={16} />
                ניהול משתמשים
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>הגדרות כלליות</CardTitle>
                    <CardDescription>Basic settings for the system</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="appName">שם המערכת</Label>
                      <Input 
                        id="appName" 
                        value={appName} 
                        onChange={(e) => setAppName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language / שפה</Label>
                      <Select 
                        value={language} 
                        onValueChange={setLanguage}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="he">עברית</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Notifications</Label>
                        <Switch 
                          id="notifications" 
                          checked={notificationsEnabled} 
                          onCheckedChange={setNotificationsEnabled}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable system notifications
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="debugMode">Debug Mode</Label>
                        <Switch 
                          id="debugMode" 
                          checked={isDebugMode} 
                          onCheckedChange={setIsDebugMode}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Shows additional technical information when errors occur
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>סטטיסטיקה</CardTitle>
                    <CardDescription>System statistics and information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground">מדורים במערכת</p>
                        <p className="text-2xl font-bold text-primary">{departments.length}</p>
                      </div>
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground">פטורים במערכת</p>
                        <p className="text-2xl font-bold text-primary">{exemptions.length}</p>
                      </div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <p className="text-sm text-muted-foreground">Current User</p>
                      <p className="text-lg font-medium">{user?.name || 'Guest'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <p className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-full inline-block mt-2">
                        {user?.role || 'Not logged in'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>בחירת ערכת נושא</CardTitle>
                    <CardDescription>התאם אישית את המראה והתחושה של האפליקציה</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="darkMode" className="text-base">מצב כהה</Label>
                          <p className="text-sm text-muted-foreground">החלף בין מראה כהה ובהיר</p>
                        </div>
                        <Switch 
                          id="darkMode" 
                          checked={isDarkMode} 
                          onCheckedChange={handleThemeToggle}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>ערכת נושא</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {themes.map(theme => (
                          <div 
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                              currentTheme === theme.id ? 'border-primary scale-105' : 'border-border hover:border-primary/50'
                            }`}
                            style={{
                              background: theme.background,
                              color: theme.primary
                            }}
                          >
                            <div className="h-8 rounded flex items-center justify-center" style={{ background: `${theme.primary}33` }}>
                              <Palette size={18} />
                            </div>
                            <p className="mt-2 text-sm font-medium text-center">{theme.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select 
                        value={fontSize} 
                        onValueChange={handleFontSizeChange}
                      >
                        <SelectTrigger id="fontSize">
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontSizes.map(size => (
                            <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="animationSpeed">Animation Speed</Label>
                      <Select 
                        value={animationSpeed} 
                        onValueChange={setAnimationSpeed}
                      >
                        <SelectTrigger id="animationSpeed">
                          <SelectValue placeholder="Select animation speed" />
                        </SelectTrigger>
                        <SelectContent>
                          {animationSpeeds.map(speed => (
                            <SelectItem key={speed.id} value={speed.id}>{speed.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-full border border-border"
                          style={{ backgroundColor: accentColor }}
                        ></div>
                        <Input 
                          id="accentColor" 
                          type="color" 
                          value={accentColor} 
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="system" className="space-y-6">
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Advanced settings for administrators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {user?.role === 'ADMIN' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Database Backup Frequency</Label>
                          <Select 
                            value={backupFrequency} 
                            onValueChange={setBackupFrequency}
                          >
                            <SelectTrigger id="backupFrequency">
                              <SelectValue placeholder="Select backup frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="manual">Manual Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="databaseBackup">Database Backup</Label>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={handleBackupNow}
                            >
                              Backup Now
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Import Data
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Create a backup of all system data or restore from an existing backup
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>System Reset</Label>
                          <Button 
                            variant="destructive" 
                            className="w-full"
                            onClick={() => {
                              toast({
                                title: "System Reset",
                                description: "This is a demo. In a real system, this would reset all data.",
                                variant: "destructive"
                              });
                            }}
                          >
                            Reset All System Data
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            This action will delete all data in the system without possibility of recovery
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-900/20 border border-amber-800/30 text-amber-200">
                        <Shield className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Administrator Access Required</p>
                          <p className="text-sm">You need administrator privileges to access these settings</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>ניהול משתמשים</span>
                      {isAdmin && (
                        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex items-center gap-2">
                              <UserPlus size={16} />
                              <span>הוסף משתמש</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>הוסף משתמש חדש</DialogTitle>
                              <DialogDescription>
                                Add a new user to the system with appropriate permissions.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">שם</Label>
                                <Input 
                                  id="name" 
                                  value={newUserName} 
                                  onChange={(e) => setNewUserName(e.target.value)}
                                  placeholder="Enter user's name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">אימייל</Label>
                                <Input 
                                  id="email" 
                                  type="email" 
                                  value={newUserEmail} 
                                  onChange={(e) => setNewUserEmail(e.target.value)}
                                  placeholder="Enter email address"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="password">סיסמה</Label>
                                <Input 
                                  id="password" 
                                  type="password" 
                                  value={newUserPassword} 
                                  onChange={(e) => setNewUserPassword(e.target.value)}
                                  placeholder="Enter password"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="role">תפקיד</Label>
                                <Select 
                                  value={newUserRole} 
                                  onValueChange={(value) => setNewUserRole(value as UserRole)}
                                >
                                  <SelectTrigger id="role">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ADMIN">מנהל מערכת</SelectItem>
                                    <SelectItem value="SUPERVISOR">מפקד</SelectItem>
                                    <SelectItem value="USER">משתמש רגיל</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>ביטול</Button>
                              <Button onClick={handleAddUser}>הוסף משתמש</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardTitle>
                    <CardDescription>
                      View and manage system users and their permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isAdmin ? (
                      <>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>שם</TableHead>
                                <TableHead>אימייל</TableHead>
                                <TableHead>תפקיד</TableHead>
                                <TableHead className="text-right">פעולות</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allUsers.map(userItem => (
                                <TableRow key={userItem.id}>
                                  <TableCell className="font-medium">{userItem.name}</TableCell>
                                  <TableCell>{userItem.email}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      userItem.role === 'ADMIN' 
                                        ? 'bg-amber-100 text-amber-800' 
                                        : userItem.role === 'SUPERVISOR'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {userItem.role === 'ADMIN' ? 'מנהל מערכת' : 
                                       userItem.role === 'SUPERVISOR' ? 'מפקד' : 'משתמש רגיל'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <Dialog open={editUserData?.id === userItem.id} onOpenChange={(open) => !open && setEditUserData(null)}>
                                        <DialogTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => handleEditUser(userItem.id)}
                                          >
                                            <UserCog size={16} />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Edit User: {editUserData?.name}</DialogTitle>
                                            <DialogDescription>
                                              Update user information and permissions
                                            </DialogDescription>
                                          </DialogHeader>
                                          {editUserData && (
                                            <div className="space-y-4 py-4">
                                              <div className="space-y-2">
                                                <Label htmlFor="editName">שם</Label>
                                                <Input 
                                                  id="editName" 
                                                  value={editUserData.name} 
                                                  onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="editEmail">אימייל</Label>
                                                <Input 
                                                  id="editEmail" 
                                                  type="email" 
                                                  value={editUserData.email} 
                                                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="editRole">תפקיד</Label>
                                                <Select 
                                                  value={editUserData.role} 
                                                  onValueChange={(value) => setEditUserData({...editUserData, role: value as UserRole})}
                                                >
                                                  <SelectTrigger id="editRole">
                                                    <SelectValue placeholder="Select role" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="ADMIN">מנהל מערכת</SelectItem>
                                                    <SelectItem value="SUPERVISOR">מפקד</SelectItem>
                                                    <SelectItem value="USER">משתמש רגיל</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>
                                          )}
                                          <DialogFooter>
                                            <Button variant="outline" onClick={() => setEditUserData(null)}>ביטול</Button>
                                            <Button onClick={handleUpdateUser}>עדכן משתמש</Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="text-destructive hover:text-destructive/90"
                                        onClick={() => handleDeleteUser(userItem.id, userItem.name)}
                                        disabled={userItem.id === user?.id} // Prevent deleting current user
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-900/20 border border-amber-800/30 text-amber-200">
                        <Lock className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Administrator Access Required</p>
                          <p className="text-sm">Only system administrators can manage users</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          <motion.div 
            className="flex justify-end gap-4 mt-8"
            variants={cardVariants}
          >
            <Button 
              variant="outline" 
              onClick={handleResetSettings}
              className="flex items-center gap-2"
            >
              <RotateCcw size={16} />
              איפוס הגדרות
            </Button>
            <Button 
              onClick={handleSaveSettings}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              שמור הגדרות
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
