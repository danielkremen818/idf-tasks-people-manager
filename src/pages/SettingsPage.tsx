
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Shield, Database, Sun, Moon, Save, RotateCcw, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { departments, exemptions } = useAppContext();
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [appName, setAppName] = useState('מערכת משימות צה״ל');
  
  // Function to handle theme toggle
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
    toast({
      title: !isDarkMode ? "מצב כהה הופעל" : "מצב בהיר הופעל",
      description: "ערכת הנושא עודכנה בהצלחה",
    });
  };
  
  // Function to save settings
  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify({
      isDarkMode,
      isDebugMode,
      appName
    }));
    
    toast({
      title: "ההגדרות נשמרו",
      description: "הגדרות המערכת עודכנו בהצלחה",
    });
  };
  
  // Function to reset settings
  const handleResetSettings = () => {
    setIsDarkMode(true);
    setIsDebugMode(false);
    setAppName('מערכת משימות צה״ל');
    
    localStorage.removeItem('appSettings');
    document.documentElement.classList.remove('light');
    
    toast({
      title: "ההגדרות אופסו",
      description: "הגדרות המערכת אופסו לברירת המחדל",
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">הגדרות</h1>
          
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-3 mb-8">
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
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>הגדרות כלליות</CardTitle>
                  <CardDescription>הגדרות בסיסיות של המערכת</CardDescription>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="debugMode">מצב דיבאג</Label>
                      <Switch 
                        id="debugMode" 
                        checked={isDebugMode} 
                        onCheckedChange={setIsDebugMode}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      הפעלת מצב דיבאג תציג מידע טכני נוסף במקרה של שגיאות
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>סטטיסטיקה</CardTitle>
                  <CardDescription>מידע סטטיסטי על המערכת</CardDescription>
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
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ערכת נושא</CardTitle>
                  <CardDescription>התאם את מראה המערכת להעדפותיך</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="darkMode" className="text-base">מצב כהה</Label>
                        <p className="text-sm text-muted-foreground">ערכת נושא כהה עם גוונים צבאיים</p>
                      </div>
                      <Switch 
                        id="darkMode" 
                        checked={isDarkMode} 
                        onCheckedChange={handleThemeToggle}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full h-24 rounded-lg bg-background border border-border"></div>
                      <p className="text-sm">רקע</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full h-24 rounded-lg bg-card border border-border"></div>
                      <p className="text-sm">כרטיסים</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full h-12 rounded-lg bg-primary flex items-center justify-center border border-border">
                        <span className="text-primary-foreground">לחצן ראשי</span>
                      </div>
                      <p className="text-sm">כפתורים ראשיים</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full h-12 rounded-lg bg-secondary flex items-center justify-center border border-border">
                        <span className="text-secondary-foreground">לחצן משני</span>
                      </div>
                      <p className="text-sm">כפתורים משניים</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>הגדרות מערכת</CardTitle>
                  <CardDescription>הגדרות מתקדמות למנהלי מערכת</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-900/20 border border-amber-800/30 text-amber-200">
                    <Shield className="h-5 w-5" />
                    <div>
                      <p className="font-medium">הגדרות מתקדמות</p>
                      <p className="text-sm">שינוי הגדרות אלו דורש הרשאות מנהל מערכת</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="databaseBackup">גיבוי מסד נתונים</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="flex-1" disabled>
                        ייצא נתונים
                      </Button>
                      <Button variant="outline" className="flex-1" disabled>
                        ייבא נתונים
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      יצירת גיבוי של כל הנתונים במערכת או שחזור מגיבוי קיים
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>איפוס מערכת</Label>
                    <Button variant="destructive" disabled className="w-full">
                      אפס את כל נתוני המערכת
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      פעולה זו תמחק את כל הנתונים במערכת ללא אפשרות שחזור
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={handleResetSettings}
              className="flex items-center gap-2"
            >
              <RotateCcw size={16} />
              אפס הגדרות
            </Button>
            <Button 
              onClick={handleSaveSettings}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              שמור הגדרות
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
