
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Person } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { Mail, Phone, Building, Shield, AlertTriangle } from 'lucide-react';

interface PeopleCardProps {
  person: Person;
  onEdit: (person: Person) => void;
}

const PeopleCard: React.FC<PeopleCardProps> = ({ person, onEdit }) => {
  const { departments, exemptions, deletePerson } = useAppContext();
  
  const department = departments.find(d => d.id === person.departmentId);
  const personExemptions = exemptions.filter(e => person.exemptionIds.includes(e.id));

  return (
    <Card className="card-animated overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={person.available ? "default" : "destructive"}>
            {person.available ? 'זמין' : 'לא זמין'}
          </Badge>
          {department && (
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: department.colorCode }}
            ></div>
          )}
        </div>
        <CardTitle className="text-xl tracking-tight">{person.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{person.email}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{person.phone}</span>
          </div>
          
          {department && (
            <div className="flex items-center text-sm">
              <Building className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{department.name}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <AlertTriangle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span className="text-xs line-clamp-1">{person.emergencyContact}</span>
          </div>
        </div>
        
        {personExemptions.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium mb-1">פטורים:</p>
            <div className="flex flex-wrap gap-1">
              {personExemptions.map(exemption => (
                <Badge key={exemption.id} variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                  {exemption.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => deletePerson(person.id)}
        >
          מחק
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(person)}
        >
          ערוך
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PeopleCard;
