
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task, Status, Priority } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { Calendar, AlertCircle, User, Edit, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const getStatusClass = (status: Status): string => {
  switch (status) {
    case 'ממתין':
      return 'status-pending';
    case 'בביצוע':
      return 'status-in-progress';
    case 'הושלם':
      return 'status-completed';
    case 'בוטל':
      return 'status-cancelled';
    default:
      return '';
  }
};

const getPriorityClass = (priority: Priority): string => {
  switch (priority) {
    case 'נמוכה':
      return 'priority-low';
    case 'בינונית':
      return 'priority-medium';
    case 'גבוהה':
      return 'priority-high';
    case 'דחופה':
      return 'priority-urgent';
    default:
      return '';
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('he-IL').format(date);
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { people, deleteTask } = useAppContext();
  
  const assignedPerson = task.assignedPersonId 
    ? people.find(p => p.id === task.assignedPersonId) 
    : null;

  return (
    <Card className="card-animated overflow-hidden border border-border/50 hover:border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getPriorityClass(task.priority)}>{task.priority}</Badge>
          <Badge className={getStatusClass(task.status)}>{task.status}</Badge>
        </div>
        <CardTitle className="text-xl tracking-tight gold-accent">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
          <span>תאריך יעד: {formatDate(task.dueDate)}</span>
        </div>
        
        {assignedPerson && (
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
            <span>מבצע: {assignedPerson.name}</span>
          </div>
        )}
        
        {!assignedPerson && (
          <div className="flex items-center text-sm text-amber-300/80">
            <AlertCircle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>לא הוקצה מבצע</span>
          </div>
        )}
        
        {task.requiredSkills.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium mb-1">כישורים נדרשים:</p>
            <div className="flex flex-wrap gap-1">
              {task.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs green-highlight">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-border/30">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => deleteTask(task.id)}
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
          מחק
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(task)}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Edit className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
          ערוך
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
