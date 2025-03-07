
import React, { useState, useMemo, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Filter eligible people based on their exemptions - THIS IS THE MAIN FIX
  const eligiblePeople = useMemo(() => {
    return people.filter(person => {
      // Check if the person has any prohibited exemptions
      const hasProhibitedExemption = person.exemptionIds.some(exemptionId => 
        formData.prohibitedExemptionIds.includes(exemptionId)
      );
      
      // Only include available people who don't have prohibited exemptions
      return person.available && !hasProhibitedExemption;
    });
  }, [people, formData.prohibitedExemptionIds]);
  
  // Effect to reset assignedPersonId if the current person becomes ineligible
  useEffect(() => {
    if (formData.assignedPersonId) {
      const isPersonEligible = eligiblePeople.some(p => p.id === formData.assignedPersonId);
      if (!isPersonEligible) {
        setFormData({
          ...formData,
          assignedPersonId: null
        });
      }
    }
  }, [formData.assignedPersonId, eligiblePeople]);
  
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
      // When adding a prohibited exemption, also check if the current assignee has it
      const updatedExemptionIds = [...formData.prohibitedExemptionIds, exemptionId];
      let updatedAssignedPersonId = formData.assignedPersonId;
      
      if (formData.assignedPersonId) {
        const assignedPerson = people.find(p => p.id === formData.assignedPersonId);
        if (assignedPerson && assignedPerson.exemptionIds.includes(exemptionId)) {
          // Reset the assignee if they have this prohibited exemption
          updatedAssignedPersonId = null;
        }
      }
      
      setFormData({
        ...formData,
        prohibitedExemptionIds: updatedExemptionIds,
        assignedPersonId: updatedAssignedPersonId
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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-3xl font-bold text-amber-500">משימות</h1>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleAddTask} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700">
                <Plus size={16} />
                הוסף משימה
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="חפש לפי כותרת או תיאור..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | '')}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="כל הסטטוסים" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="filter-all">כל הסטטוסים</SelectItem>
                  <SelectItem value="ממתין">ממתין</SelectItem>
                  <SelectItem value="בביצוע">בביצוע</SelectItem>
                  <SelectItem value="הושלם">הושלם</SelectItem>
                  <SelectItem value="בוטל">בוטל</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | '')}>
                <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="כל העדיפויות" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="filter-all">כל העדיפויות</SelectItem>
                  <SelectItem value="נמוכה">נמוכה</SelectItem>
                  <SelectItem value="בינונית">בינונית</SelectItem>
                  <SelectItem value="גבוהה">גבוהה</SelectItem>
                  <SelectItem value="דחופה">דחופה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <p className="text-lg text-gray-400">לא נמצאו משימות התואמות את החיפוש</p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredTasks.map(task => (
                  <motion.div key={task.id} variants={item} layout>
                    <TaskCard
                      task={task}
                      onEdit={handleEditTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-amber-500">
              {selectedTask ? 'ערוך משימה' : 'הוסף משימה חדשה'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-gray-300">כותרת</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-300">תיאור</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assignedPerson" className="text-gray-300">מבצע המשימה</Label>
              <Select 
                value={formData.assignedPersonId || 'unassigned'} 
                onValueChange={(value) => setFormData({ ...formData, assignedPersonId: value === 'unassigned' ? null : value })}
              >
                <SelectTrigger id="assignedPerson" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="בחר חייל" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="unassigned">לא מוקצה</SelectItem>
                  {eligiblePeople.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {eligiblePeople.length === 0 && (
                <p className="text-amber-500 text-sm">אין חיילים זמינים עם הפטורים הדרושים למשימה זו</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueDate" className="text-gray-300">תאריך יעד</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-gray-400" />
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-gray-300">סטטוס</Label>
              <RadioGroup 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Status })}
                className="flex space-x-4 rtl:space-x-reverse"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="ממתין" id="status-pending" />
                  <Label htmlFor="status-pending" className="text-gray-300">ממתין</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="בביצוע" id="status-in-progress" />
                  <Label htmlFor="status-in-progress" className="text-gray-300">בביצוע</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="הושלם" id="status-completed" />
                  <Label htmlFor="status-completed" className="text-gray-300">הושלם</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="בוטל" id="status-cancelled" />
                  <Label htmlFor="status-cancelled" className="text-gray-300">בוטל</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-gray-300">עדיפות</Label>
              <RadioGroup 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}
                className="flex space-x-4 rtl:space-x-reverse"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="נמוכה" id="priority-low" />
                  <Label htmlFor="priority-low" className="text-gray-300">נמוכה</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="בינונית" id="priority-medium" />
                  <Label htmlFor="priority-medium" className="text-gray-300">בינונית</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="גבוהה" id="priority-high" />
                  <Label htmlFor="priority-high" className="text-gray-300">גבוהה</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="דחופה" id="priority-urgent" />
                  <Label htmlFor="priority-urgent" className="text-gray-300">דחופה</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-gray-300">כישורים נדרשים</Label>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Input
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="הוסף כישור"
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill} size="sm" className="bg-amber-600 hover:bg-amber-700">
                  הוסף
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <AnimatePresence>
                  {formData.requiredSkills.map((skill, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm text-gray-200">{skill}</span>
                      <motion.button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-gray-400 hover:text-red-400"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={14} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-gray-300">פטורים שמונעים ביצוע המשימה</Label>
              <div className="border border-gray-700 rounded-md p-3 space-y-3 bg-gray-800">
                {exemptions.map(exemption => (
                  <div key={exemption.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox 
                      id={`prohibited-${exemption.id}`} 
                      checked={formData.prohibitedExemptionIds.includes(exemption.id)}
                      onCheckedChange={(checked) => handleExemptionChange(exemption.id, !!checked)}
                    />
                    <Label htmlFor={`prohibited-${exemption.id}`} className="text-sm text-gray-300">
                      {exemption.name} - {exemption.description}
                    </Label>
                  </div>
                ))}
                {exemptions.length === 0 && (
                  <p className="text-sm text-gray-400">אין פטורים מוגדרים במערכת</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              ביטול
            </Button>
            <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white">
              {selectedTask ? 'עדכן' : 'הוסף'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;
