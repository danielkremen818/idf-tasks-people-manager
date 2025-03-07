import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Users, Clipboard, Building2, ShieldAlert, BarChart2, PieChart, CalendarDays, Activity, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { Status, Priority } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const Dashboard: React.FC = () => {
  const {
    people,
    tasks,
    departments,
    exemptions
  } = useAppContext();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('overview');

  // Stats
  const availablePeople = people.filter(p => p.available).length;
  const pendingTasks = tasks.filter(t => t.status === 'ממתין').length;
  const inProgressTasks = tasks.filter(t => t.status === 'בביצוע').length;
  const completedTasks = tasks.filter(t => t.status === 'הושלם').length;
  const cancelledTasks = tasks.filter(t => t.status === 'בוטל').length;

  // Priority stats
  const highPriorityTasks = tasks.filter(t => t.priority === 'דחוף').length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'בינוני').length;
  const lowPriorityTasks = tasks.filter(t => t.priority === 'נמוך').length;

  // Calculate task completion rate
  const completionRate = tasks.length > 0 ? Math.round(completedTasks / tasks.length * 100) : 0;

  // Task status data for pie chart with improved colors
  const statusData = [{
    name: 'ממתין',
    value: pendingTasks,
    color: '#FFC107'
  }, {
    name: 'בביצוע',
    value: inProgressTasks,
    color: '#3B82F6'
  }, {
    name: 'הושלם',
    value: completedTasks,
    color: '#10B981'
  }, {
    name: 'בוטל',
    value: cancelledTasks,
    color: '#EF4444'
  }];

  // Priority data for pie chart
  const priorityData = [{
    name: 'דחוף',
    value: highPriorityTasks,
    color: '#EF4444'
  }, {
    name: 'בינוני',
    value: mediumPriorityTasks,
    color: '#F59E0B'
  }, {
    name: 'נמוך',
    value: lowPriorityTasks,
    color: '#10B981'
  }];

  // Department data for bar chart
  const departmentData = departments.map(dept => {
    const peopleCount = people.filter(p => p.departmentId === dept.id).length;
    const tasksForDept = tasks.filter(t => {
      const assignedPerson = people.find(p => p.id === t.assignedPersonId);
      return assignedPerson && assignedPerson.departmentId === dept.id;
    }).length;
    return {
      name: dept.name,
      people: peopleCount,
      tasks: tasksForDept
    };
  });

  // Task trends by month (mock data, in a real app this would be calculated)
  const monthlyTaskData = [{
    name: 'ינואר',
    completed: 18,
    created: 24
  }, {
    name: 'פברואר',
    completed: 22,
    created: 28
  }, {
    name: 'מרץ',
    completed: 30,
    created: 32
  }, {
    name: 'אפריל',
    completed: 25,
    created: 21
  }, {
    name: 'מאי',
    completed: 15,
    created: 18
  }, {
    name: 'יוני',
    completed: completedTasks,
    created: tasks.length
  }];

  // People availability by department
  const availabilityData = departments.map(dept => {
    const deptPeople = people.filter(p => p.departmentId === dept.id);
    const availableCount = deptPeople.filter(p => p.available).length;
    const unavailableCount = deptPeople.length - availableCount;
    return {
      name: dept.name,
      זמינים: availableCount,
      'לא זמינים': unavailableCount
    };
  });
  return <div className="space-y-6 animate-fade-in">
      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border-blue-800/30 shadow-lg transition-all duration-300 hover:shadow-blue-900/10 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-blue-400" />
              חיילים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{people.length}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {availablePeople} זמינים כרגע
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                {Math.round(availablePeople / people.length * 100)}% זמינות
              </span>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full hover:bg-blue-900/30" onClick={() => navigate('/people')}>
                נהל חיילים
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/10 border-green-800/30 shadow-lg transition-all duration-300 hover:shadow-green-900/10 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clipboard className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-green-400" />
              משימות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {pendingTasks} ממתינות, {inProgressTasks} בביצוע
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
                {completionRate}% הושלמו
              </span>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full hover:bg-green-900/30" onClick={() => navigate('/tasks')}>
                נהל משימות
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border-purple-800/30 shadow-lg transition-all duration-300 hover:shadow-purple-900/10 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-purple-400" />
              יחידות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {departments.length} יחידות פעילות
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                {Math.round(tasks.length / (departments.length || 1))} משימות לכל יחידה
              </span>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full hover:bg-purple-900/30" onClick={() => navigate('/departments')}>
                נהל יחידות
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/10 border-amber-800/30 shadow-lg transition-all duration-300 hover:shadow-amber-900/10 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ShieldAlert className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-amber-400" />
              פטורים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exemptions.length}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                סוגי פטורים רפואיים במערכת
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {exemptions.length > 0 ? 'פעיל' : 'לא פעיל'}
              </span>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full hover:bg-amber-900/30" onClick={() => navigate('/exemptions')}>
                נהל פטורים
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different dashboard views */}
      <Tabs defaultValue="overview" value={activeView} onValueChange={setActiveView} className="mt-8">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">סקירה כללית</span>
            <span className="sm:hidden">סקירה</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            <span className="hidden sm:inline">ניתוח משימות</span>
            <span className="sm:hidden">משימות</span>
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">ניהול כוח אדם</span>
            <span className="sm:hidden">כוח אדם</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">מגמות ותחזיות</span>
            <span className="sm:hidden">מגמות</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview tab content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  סטטוס משימות
                </CardTitle>
                <CardDescription>התפלגות משימות לפי סטטוס</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" label={({
                      name,
                      percent
                    }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                      </Pie>
                      <Tooltip formatter={value => [`${value} משימות`, 'כמות']} />
                      <Legend verticalAlign="bottom" />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  חיילים ומשימות לפי יחידה
                </CardTitle>
                <CardDescription>השוואת מספר החיילים והמשימות בכל יחידה</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData} margin={{
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 5
                  }}>
                      <XAxis dataKey="name" tick={{
                      fontSize: 12
                    }} />
                      <YAxis tick={{
                      fontSize: 12
                    }} />
                      <Tooltip formatter={value => [`${value}`, '']} />
                      <Legend verticalAlign="top" />
                      <Bar dataKey="people" name="חיילים" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tasks" name="משימות" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="col-span-1 bg-gradient-to-br from-blue-900/10 to-blue-800/5 border-blue-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-blue-400">
                  <Clock className="h-4 w-4 mr-2" />
                  ממתינות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(pendingTasks / tasks.length * 100)}% מכלל המשימות
                </p>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 bg-gradient-to-br from-purple-900/10 to-purple-800/5 border-purple-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-purple-400">
                  <Activity className="h-4 w-4 mr-2" />
                  בביצוע
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(inProgressTasks / tasks.length * 100)}% מכלל המשימות
                </p>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 bg-gradient-to-br from-green-900/10 to-green-800/5 border-green-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-green-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  הושלמו
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(completedTasks / tasks.length * 100)}% מכלל המשימות
                </p>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 bg-gradient-to-br from-red-900/10 to-red-800/5 border-red-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-red-400">
                  <XCircle className="h-4 w-4 mr-2" />
                  בוטלו
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cancelledTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(cancelledTasks / tasks.length * 100)}% מכלל המשימות
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tasks tab content */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  חלוקת עדיפויות
                </CardTitle>
                <CardDescription>התפלגות משימות לפי רמת עדיפות</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie data={priorityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" label={({
                      name,
                      percent
                    }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />)}
                      </Pie>
                      <Tooltip formatter={value => [`${value} משימות`, 'כמות']} />
                      <Legend verticalAlign="bottom" />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  מגמות משימות חודשיות
                </CardTitle>
                <CardDescription>השוואה בין משימות שנוצרו והושלמו לאורך זמן</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTaskData} margin={{
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 5
                  }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                      <XAxis dataKey="name" tick={{
                      fontSize: 12
                    }} />
                      <YAxis tick={{
                      fontSize: 12
                    }} />
                      <Tooltip formatter={value => [`${value} משימות`, '']} />
                      <Legend verticalAlign="top" />
                      <Line type="monotone" dataKey="created" name="נוצרו" stroke="#F59E0B" activeDot={{
                      r: 8
                    }} />
                      <Line type="monotone" dataKey="completed" name="הושלמו" stroke="#10B981" activeDot={{
                      r: 8
                    }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>דירוג עומס עבודה לפי יחידה</CardTitle>
              <CardDescription>מדד המבוסס על מספר המשימות ביחס למספר החיילים</CardDescription>
            </CardHeader>
            <CardContent className="rounded-xl">
              <div className="h-12 space-y-4">
                {departmentData.map(dept => {
                const workloadRatio = dept.people > 0 ? dept.tasks / dept.people : 0;
                const percentage = Math.min(100, Math.round(workloadRatio * 25));
                let color = "#10B981"; // Low workload
                if (percentage > 75) color = "#EF4444"; // High workload
                else if (percentage > 50) color = "#F59E0B"; // Medium-high workload
                else if (percentage > 25) color = "#3B82F6"; // Medium-low workload

                return <div key={dept.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-muted-foreground">{workloadRatio.toFixed(1)} משימות לחייל</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full">
                        <div className="h-2 rounded-full transition-all duration-500" style={{
                      width: `${percentage}%`,
                      backgroundColor: color
                    }} />
                      </div>
                    </div>;
              })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* People tab content */}
        <TabsContent value="people" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  זמינות חיילים
                </CardTitle>
                <CardDescription>חיילים זמינים לעומת לא זמינים בכל יחידה</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={availabilityData} layout="vertical" margin={{
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 30
                  }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" tick={{
                      fontSize: 12
                    }} width={80} />
                      <Tooltip formatter={value => [`${value} חיילים`, '']} />
                      <Legend />
                      <Bar dataKey="זמינים" stackId="a" fill="#10B981" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="לא זמינים" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  ניצולת כוח אדם
                </CardTitle>
                <CardDescription>היחס בין חיילים למשימות פעילות</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full flex items-center justify-center flex-col">
                  <div className="text-7xl font-bold text-primary mb-4">
                    {people.length > 0 ? Math.round(tasks.length / people.length * 10) / 10 : 0}
                  </div>
                  <div className="text-lg text-muted-foreground">משימות לחייל בממוצע</div>
                  <div className="mt-6 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>{'>'}2 משימות לחייל: עומס גבוה</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span>1-2 משימות לחייל: עומס בינוני</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>{'<'}1 משימות לחייל: עומס נמוך</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Trends tab content */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>תחזית השלמת משימות</CardTitle>
              <CardDescription>תחזית להשלמת משימות בהתבסס על נתונים היסטוריים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTaskData} margin={{
                  top: 5,
                  right: 5,
                  bottom: 5,
                  left: 5
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                    <XAxis dataKey="name" tick={{
                    fontSize: 12
                  }} />
                    <YAxis tick={{
                    fontSize: 12
                  }} />
                    <Tooltip formatter={value => [`${value} משימות`, '']} />
                    <Legend verticalAlign="top" />
                    <Line type="monotone" dataKey="completed" name="ביצוע בפועל" stroke="#10B981" activeDot={{
                    r: 8
                  }} strokeWidth={2} />
                    {/* Projected line - would normally be calculated */}
                    <Line type="monotone" dataKey="created" name="תחזית" stroke="#3B82F6" strokeDasharray="5 5" activeDot={{
                    r: 4
                  }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-green-900/10 to-green-800/5 border-green-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  יעילות המערכת
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completionRate}%</div>
                <p className="text-sm text-muted-foreground">
                  אחוז משימות שהושלמו מסך כל המשימות
                </p>
                <div className="mt-4 h-2 bg-gray-800 rounded-full">
                  <div className="h-2 rounded-full bg-green-500 transition-all duration-1000" style={{
                  width: `${completionRate}%`
                }} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-900/10 to-amber-800/5 border-amber-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
                  משימות דחופות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{highPriorityTasks}</div>
                <p className="text-sm text-muted-foreground">
                  {tasks.length > 0 ? Math.round(highPriorityTasks / tasks.length * 100) : 0}% מכלל המשימות דורשות טיפול דחוף
                </p>
                <div className="mt-4 h-2 bg-gray-800 rounded-full">
                  <div className="h-2 rounded-full bg-amber-500 transition-all duration-1000" style={{
                  width: `${tasks.length > 0 ? highPriorityTasks / tasks.length * 100 : 0}%`
                }} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-900/10 to-blue-800/5 border-blue-800/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  זמינות כוח אדם
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{people.length > 0 ? Math.round(availablePeople / people.length * 100) : 0}%</div>
                <p className="text-sm text-muted-foreground">
                  אחוז החיילים הזמינים כעת למשימות
                </p>
                <div className="mt-4 h-2 bg-gray-800 rounded-full">
                  <div className="h-2 rounded-full bg-blue-500 transition-all duration-1000" style={{
                  width: `${people.length > 0 ? availablePeople / people.length * 100 : 0}%`
                }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Dashboard;