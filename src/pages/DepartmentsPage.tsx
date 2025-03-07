
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Department } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Building2, Plus, Search, Trash, Edit, User, Clipboard } from 'lucide-react';
import { motion } from 'framer-motion';

const DepartmentsPage = () => {
  const { departments, people, tasks, addDepartment, updateDepartment, deleteDepartment } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Department>({
    id: '',
    name: '',
    colorCode: '#3B82F6',
  });
  
  // Handle opening the dialog for adding a new department
  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setFormData({
      id: uuidv4(),
      name: '',
      colorCode: '#3B82F6',
    });
    setShowDialog(true);
  };
  
  // Handle opening the dialog for editing an existing department
  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({ ...department });
    setShowDialog(true);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (selectedDepartment) {
      updateDepartment(formData);
    } else {
      addDepartment(formData);
    }
    setShowDialog(false);
  };
  
  // Filter departments based on search term
  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get counts for a specific department
  const getPeopleCount = (departmentId: string) => {
    return people.filter(person => person.departmentId === departmentId).length;
  };
  
  const getTasksCount = (departmentId: string) => {
    const departmentPeople = people.filter(person => person.departmentId === departmentId);
    const departmentPeopleIds = departmentPeople.map(person => person.id);
    
    return tasks.filter(task => 
      task.assignedPersonId && departmentPeopleIds.includes(task.assignedPersonId)
    ).length;
  };

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
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-3xl font-bold text-amber-500">מדורים</h1>
            <Button onClick={handleAddDepartment} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700">
              <Plus size={16} />
              הוסף מדור
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-700"
          >
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="חפש לפי שם מדור..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </motion.div>
          
          {filteredDepartments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <p className="text-lg text-gray-400">לא נמצאו מדורים התואמים את החיפוש</p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDepartments.map(department => (
                <motion.div key={department.id} variants={item}>
                  <Card className="border-gray-700 bg-gray-800 hover:bg-gray-750 overflow-hidden hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl tracking-tight text-white">{department.name}</CardTitle>
                        <div 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: department.colorCode }}
                        ></div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4 pt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-gray-400" />
                          <span className="text-gray-300">
                            {getPeopleCount(department.id)} חיילים
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clipboard className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-gray-400" />
                          <span className="text-gray-300">
                            {getTasksCount(department.id)} משימות
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t border-gray-700">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Check if department has people assigned before deletion
                            const hasPeople = people.some(p => p.departmentId === department.id);
                            if (hasPeople) {
                              alert('לא ניתן למחוק מדור עם חיילים מוקצים. העבר את החיילים למדור אחר קודם.');
                              return;
                            }
                            deleteDepartment(department.id);
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> מחק
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditDepartment(department)}
                          className="text-amber-500 hover:text-amber-400 border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10"
                        >
                          <Edit size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> ערוך
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-amber-500">
              {selectedDepartment ? 'ערוך מדור' : 'הוסף מדור חדש'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-300">שם המדור</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="colorCode" className="text-gray-300">צבע מזהה</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="colorCode"
                  type="color"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                  className="w-16 h-10 p-1 bg-transparent"
                />
                <div className="flex-1">
                  <Input
                    value={formData.colorCode}
                    onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                    className="font-mono bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              ביטול
            </Button>
            <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white">
              {selectedDepartment ? 'עדכן' : 'הוסף'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
