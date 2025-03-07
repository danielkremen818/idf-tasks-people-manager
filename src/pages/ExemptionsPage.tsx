
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ExemptionType } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { ShieldAlert, Plus, Search, Trash, Edit, User } from 'lucide-react';
import { motion } from 'framer-motion';

const ExemptionsPage = () => {
  const { exemptions, people, addExemption, updateExemption, deleteExemption } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedExemption, setSelectedExemption] = useState<ExemptionType | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ExemptionType>({
    id: '',
    name: '',
    description: '',
  });
  
  // Handle opening the dialog for adding a new exemption
  const handleAddExemption = () => {
    setSelectedExemption(null);
    setFormData({
      id: uuidv4(),
      name: '',
      description: '',
    });
    setShowDialog(true);
  };
  
  // Handle opening the dialog for editing an existing exemption
  const handleEditExemption = (exemption: ExemptionType) => {
    setSelectedExemption(exemption);
    setFormData({ ...exemption });
    setShowDialog(true);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (selectedExemption) {
      updateExemption(formData);
    } else {
      addExemption(formData);
    }
    setShowDialog(false);
  };
  
  // Filter exemptions based on search term
  const filteredExemptions = exemptions.filter(exemption => 
    exemption.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exemption.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get counts for a specific exemption
  const getPeopleCount = (exemptionId: string) => {
    return people.filter(person => person.exemptionIds.includes(exemptionId)).length;
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
            <h1 className="text-3xl font-bold">פטורים רפואיים</h1>
            <Button 
              onClick={handleAddExemption} 
              className="flex items-center gap-2 button-animated"
              variant="default"
            >
              <Plus size={16} />
              הוסף פטור
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
                placeholder="חפש לפי שם או תיאור פטור..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </motion.div>
          
          {filteredExemptions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <p className="text-lg text-gray-400">לא נמצאו פטורים התואמים את החיפוש</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredExemptions.map(exemption => (
                <motion.div
                  key={exemption.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-800 border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:transform hover:scale-[1.02]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl tracking-tight flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-blue-400" />
                        {exemption.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-gray-400 mb-4">{exemption.description}</p>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-gray-400" />
                        <span className="text-gray-400">
                          {getPeopleCount(exemption.id)} חיילים עם פטור זה
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t border-gray-700">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // Check if exemption is assigned to people before deletion
                          const isAssigned = people.some(p => p.exemptionIds.includes(exemption.id));
                          if (isAssigned) {
                            alert('לא ניתן למחוק פטור שמוקצה לחיילים. הסר את הפטור מהחיילים קודם.');
                            return;
                          }
                          deleteExemption(exemption.id);
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> מחק
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditExemption(exemption)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> ערוך
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedExemption ? 'ערוך פטור' : 'הוסף פטור חדש'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-300">שם הפטור</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="לדוגמה: פרופיל 21"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-300">תיאור</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="תאר את המגבלות של הפטור"
                rows={3}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              ביטול
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="default"
              className="button-animated"
            >
              {selectedExemption ? 'עדכן' : 'הוסף'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExemptionsPage;
