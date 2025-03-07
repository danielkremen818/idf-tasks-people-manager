
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">יחידות</h1>
            <Button onClick={handleAddDepartment} className="flex items-center gap-2">
              <Plus size={16} />
              הוסף יחידה
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="חפש לפי שם יחידה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-9"
              />
            </div>
          </div>
          
          {filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">לא נמצאו יחידות התואמות את החיפוש</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map(department => (
                <Card key={department.id} className="card-animated overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl tracking-tight">{department.name}</CardTitle>
                      <div 
                        className="w-5 h-5 rounded-full" 
                        style={{ backgroundColor: department.colorCode }}
                      ></div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {getPeopleCount(department.id)} חיילים
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clipboard className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {getTasksCount(department.id)} משימות
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        // Check if department has people assigned before deletion
                        const hasPeople = people.some(p => p.departmentId === department.id);
                        if (hasPeople) {
                          alert('לא ניתן למחוק יחידה עם חיילים מוקצים. העבר את החיילים ליחידה אחרת קודם.');
                          return;
                        }
                        deleteDepartment(department.id);
                      }}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> מחק
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditDepartment(department)}
                    >
                      <Edit size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> ערוך
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDepartment ? 'ערוך יחידה' : 'הוסף יחידה חדשה'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">שם היחידה</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="colorCode">צבע מזהה</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="colorCode"
                  type="color"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <div className="flex-1">
                  <Input
                    value={formData.colorCode}
                    onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              ביטול
            </Button>
            <Button onClick={handleSubmit}>
              {selectedDepartment ? 'עדכן' : 'הוסף'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
