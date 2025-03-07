
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Status, Priority, Task } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Search, Plus, Calendar, X } from 'lucide-react';

const TasksPage = () => {
  const { tasks, people, exemptions, addTask, updateTask } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [skill, setSkill] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<Task>({
    id: '',
    title: '',
    description: '',
    assignedPersonId: null,
    status: 'ממתין',
    priority: 'בינונית',
    requiredSkills: [],
    prohibitedExemptionIds: [],
    dueDate: new Date().toISOString().substring(0, 10),
  });
  
  // Handle opening the dialog for adding a new task
  const handleAddTask = () => {
    setSelectedTask(null);
    setFormData({
      id: uuidv4(),
      title: '',
      description: '',
      assignedPersonId: null,
      status: 'ממתין',
      priority: 'בינונית',
      requiredSkills: [],
      prohibitedExemptionIds: [],
      dueDate: new Date().toISOString().substring(0, 10),
    });
    setShowDialog(true);
  };
  
  // Handle opening the dialog for editing an existing task
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormData({ ...task });
    setShowDialog(true);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (selectedTask) {
      updateTask(formData);
    } else {
      addTask(formData);
    }
    setShowDialog(false);
  };
  
  // Handle adding a skill
  const handleAddSkill = () => {
    if (skill.trim() && !formData.requiredSkills.includes(skill.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skill.trim()]
      });
      setSkill('');
    }
  };
  
  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s !== skillToRemove)
    });
  };
  
  // Handle checkbox change for prohibited exemptions
  const handleExemptionChange = (exemptionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        prohibitedExemptionIds: [...formData.prohibitedExemptionIds, exemptionId]
      });
    } else {
      setFormData({
        ...formData,
        prohibitedExemptionIds: formData.prohibitedExemptionIds.filter(id => id !== exemptionId)
      });
    }
  };
  
  // Filter tasks based on search term and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">משימות</h1>
            <Button onClick={handleAddTask} className="flex items-center gap-2">
              <Plus size={16} />
              הוסף משימה
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="חפש לפי כותרת או תיאור..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | '')}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="כל הסטטוסים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">כל הסטטוסים</SelectItem>
                  <SelectItem value="ממתין">ממתין</SelectItem>
                  <SelectItem value="בביצוע">בביצוע</SelectItem>
                  <SelectItem value="הושלם">הושלם</SelectItem>
                  <SelectItem value="בוטל">בוטל</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | '')}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="כל העדיפויות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">כל העדיפויות</SelectItem>
                  <SelectItem value="נמוכה">נמוכה</SelectItem>
                  <SelectItem value="בינונית">בינונית</SelectItem>
                  <SelectItem value="גבוהה">גבוהה</SelectItem>
                  <SelectItem value="דחופה">דחופה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">לא נמצאו משימות התואמות את החיפוש</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? 'ערוך משימה' : 'הוסף משימה חדשה'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">כותרת</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">תיאור</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assignedPerson">מבצע המשימה</Label>
              <Select 
                value={formData.assignedPersonId || ''} 
                onValueChange={(value) => setFormData({ ...formData, assignedPersonId: value || null })}
              >
                <SelectTrigger id="assignedPerson">
                  <SelectValue placeholder="בחר חייל" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">לא מוקצה</SelectItem>
                  {people
                    .filter(person => person.available)
                    .map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueDate">תאריך יעד</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>סטטוס</Label>
              <RadioGroup 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Status })}
                className="flex space-x-4 rtl:space-x-reverse"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="ממתין" id="status-pending" />
                  <Label htmlFor="status-pending">ממתין</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="בביצוע" id="status-in-progress" />
                  <Label htmlFor="status-in-progress">בביצוע</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="הושלם" id="status-completed" />
                  <Label htmlFor="status-completed">הושלם</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="בוטל" id="status-cancelled" />
                  <Label htmlFor="status-cancelled">בוטל</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label>עדיפות</Label>
              <RadioGroup 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}
                className="flex space-x-4 rtl:space-x-reverse"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="נמוכה" id="priority-low" />
                  <Label htmlFor="priority-low">נמוכה</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="בינונית" id="priority-medium" />
                  <Label htmlFor="priority-medium">בינונית</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="גבוהה" id="priority-high" />
                  <Label htmlFor="priority-high">גבוהה</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="דחופה" id="priority-urgent" />
                  <Label htmlFor="priority-urgent">דחופה</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label>כישורים נדרשים</Label>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Input
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="הוסף כישור"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill} size="sm">
                  הוסף
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requiredSkills.map((skill, index) => (
                  <div key={index} className="bg-secondary/10 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-sm">{skill}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>פטורים שמונעים ביצוע המשימה</Label>
              <div className="border rounded-md p-3 space-y-3">
                {exemptions.map(exemption => (
                  <div key={exemption.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox 
                      id={`prohibited-${exemption.id}`} 
                      checked={formData.prohibitedExemptionIds.includes(exemption.id)}
                      onCheckedChange={(checked) => handleExemptionChange(exemption.id, !!checked)}
                    />
                    <Label htmlFor={`prohibited-${exemption.id}`} className="text-sm">
                      {exemption.name} - {exemption.description}
                    </Label>
                  </div>
                ))}
                {exemptions.length === 0 && (
                  <p className="text-sm text-muted-foreground">אין פטורים מוגדרים במערכת</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              ביטול
            </Button>
            <Button onClick={handleSubmit}>
              {selectedTask ? 'עדכן' : 'הוסף'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;
