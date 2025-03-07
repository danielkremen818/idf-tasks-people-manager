
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import PeopleCard from '@/components/PeopleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Person } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Search, Plus, Filter } from 'lucide-react';

const PeoplePage = () => {
  const { people, departments, exemptions, addPerson, updatePerson } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Person>({
    id: '',
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    available: true,
    emergencyContact: '',
    exemptionIds: [],
  });
  
  // Handle opening the dialog for adding a new person
  const handleAddPerson = () => {
    setSelectedPerson(null);
    setFormData({
      id: uuidv4(),
      name: '',
      email: '',
      phone: '',
      departmentId: departments.length > 0 ? departments[0].id : '',
      available: true,
      emergencyContact: '',
      exemptionIds: [],
    });
    setShowDialog(true);
  };
  
  // Handle opening the dialog for editing an existing person
  const handleEditPerson = (person: Person) => {
    setSelectedPerson(person);
    setFormData({ ...person });
    setShowDialog(true);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (selectedPerson) {
      updatePerson(formData);
    } else {
      addPerson(formData);
    }
    setShowDialog(false);
  };
  
  // Handle checkbox change for exemptions
  const handleExemptionChange = (exemptionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        exemptionIds: [...formData.exemptionIds, exemptionId]
      });
    } else {
      setFormData({
        ...formData,
        exemptionIds: formData.exemptionIds.filter(id => id !== exemptionId)
      });
    }
  };
  
  // Filter people based on search term and filters
  const filteredPeople = people.filter(person => {
    const matchesSearch = 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm);
      
    const matchesDepartment = departmentFilter ? person.departmentId === departmentFilter : true;
    const matchesAvailability = availabilityFilter !== null ? person.available === availabilityFilter : true;
    
    return matchesSearch && matchesDepartment && matchesAvailability;
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">חיילים</h1>
            <Button onClick={handleAddPerson} className="flex items-center gap-2">
              <Plus size={16} />
              הוסף חייל
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="חפש לפי שם, אימייל או טלפון..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-9"
                />
              </div>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="כל היחידות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל היחידות</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={availabilityFilter === null ? 'all' : availabilityFilter ? 'true' : 'false'} 
                onValueChange={(value) => {
                  if (value === 'all') {
                    setAvailabilityFilter(null);
                  } else {
                    setAvailabilityFilter(value === 'true');
                  }
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="סטטוס זמינות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="true">זמינים</SelectItem>
                  <SelectItem value="false">לא זמינים</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredPeople.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">לא נמצאו חיילים התואמים את החיפוש</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeople.map(person => (
                <PeopleCard
                  key={person.id}
                  person={person}
                  onEdit={handleEditPerson}
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
              {selectedPerson ? 'ערוך פרטי חייל' : 'הוסף חייל חדש'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">שם מלא</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">טלפון</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="department">יחידה</Label>
              <Select 
                value={formData.departmentId} 
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="בחר יחידה" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="emergency">איש קשר לחירום</Label>
              <Input
                id="emergency"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="שם ומספר טלפון"
              />
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox 
                id="available" 
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: !!checked })}
              />
              <Label htmlFor="available">זמין למשימות</Label>
            </div>
            
            <div className="grid gap-2">
              <Label>פטורים רפואיים</Label>
              <div className="border rounded-md p-3 space-y-3">
                {exemptions.map(exemption => (
                  <div key={exemption.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox 
                      id={`exemption-${exemption.id}`} 
                      checked={formData.exemptionIds.includes(exemption.id)}
                      onCheckedChange={(checked) => handleExemptionChange(exemption.id, !!checked)}
                    />
                    <Label htmlFor={`exemption-${exemption.id}`} className="text-sm">
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
              {selectedPerson ? 'עדכן' : 'הוסף'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeoplePage;
