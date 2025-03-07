
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Users, Clipboard, Building2, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Status } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { people, tasks, departments, exemptions } = useAppContext();
  const navigate = useNavigate();
  
  // Stats
  const availablePeople = people.filter(p => p.available).length;
  const pendingTasks = tasks.filter(t => t.status === 'ממתין').length;
  const inProgressTasks = tasks.filter(t => t.status === 'בביצוע').length;
  const completedTasks = tasks.filter(t => t.status === 'הושלם').length;
  
  // Task status data for pie chart
  const statusData = [
    { name: 'ממתין', value: pendingTasks, color: '#F59E0B' },
    { name: 'בביצוע', value: inProgressTasks, color: '#3B82F6' },
    { name: 'הושלם', value: completedTasks, color: '#10B981' },
    { name: 'בוטל', value: tasks.filter(t => t.status === 'בוטל').length, color: '#EF4444' },
  ];
  
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
      tasks: tasksForDept,
    };
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-blue-600" />
              חיילים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{people.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {availablePeople} זמינים כרגע
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/people')}
              >
                נהל חיילים
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clipboard className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-green-600" />
              משימות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingTasks} ממתינות, {inProgressTasks} בביצוע
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/tasks')}
              >
                נהל משימות
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-purple-600" />
              יחידות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {departments.length} יחידות פעילות
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/departments')}
              >
                נהל יחידות
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ShieldAlert className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-amber-600" />
              פטורים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exemptions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              סוגי פטורים רפואיים במערכת
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/exemptions')}
              >
                נהל פטורים
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>סטטוס משימות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>חיילים ומשימות לפי יחידה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="people" name="חיילים" fill="#3B82F6" />
                  <Bar dataKey="tasks" name="משימות" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
