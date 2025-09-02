import { Task, Priority, Effort } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sword, Shield, Zap, Crown, Star, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  isCurrent?: boolean;
  isNext?: boolean;
  showCompleteButton?: boolean;
}

const priorityConfig: Record<Priority, { 
  icon: React.ReactNode; 
  label: string; 
  className: string;
  glowClass: string;
}> = {
  critical: { 
    icon: <Crown className="w-5 h-5" />, 
    label: 'Crítico', 
    className: 'crystal-critical text-white',
    glowClass: 'shadow-[0_0_30px_hsl(var(--critical)/0.8)]'
  },
  important: { 
    icon: <Star className="w-5 h-5" />, 
    label: 'Importante', 
    className: 'crystal-important text-white',
    glowClass: 'shadow-[0_0_25px_hsl(var(--important)/0.7)]'
  },
  normal: { 
    icon: <Circle className="w-5 h-5" />, 
    label: 'Normal', 
    className: 'crystal-normal text-white',
    glowClass: 'shadow-[0_0_20px_hsl(var(--normal)/0.6)]'
  },
  optional: { 
    icon: <Circle className="w-4 h-4" />, 
    label: 'Opcional', 
    className: 'crystal-optional text-white',
    glowClass: 'shadow-[0_0_15px_hsl(var(--optional)/0.5)]'
  },
};

const effortConfig: Record<Effort, { 
  icon: React.ReactNode; 
  label: string; 
  xp: number;
}> = {
  quick: { icon: <Zap className="w-4 h-4" />, label: 'Rápido', xp: 10 },
  medium: { icon: <Sword className="w-4 h-4" />, label: 'Médio', xp: 30 },
  large: { icon: <Shield className="w-4 h-4" />, label: 'Grande', xp: 70 },
};

export function TaskCard({ 
  task, 
  onComplete, 
  onEdit, 
  isCurrent = false, 
  isNext = false,
  showCompleteButton = true 
}: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const effort = effortConfig[task.effort];

  const handleComplete = () => {
    if (onComplete && !task.completed) {
      onComplete(task.id);
    }
  };

  return (
    <Card 
      className={cn(
        "relative transition-all duration-500 cursor-pointer hover:scale-105",
        "bg-card/80 backdrop-blur-sm border-2",
        isCurrent && "border-primary shadow-magical scale-110 z-10",
        isNext && "opacity-70 scale-95",
        !isCurrent && !isNext && "opacity-90",
        task.completed && "opacity-50 grayscale"
      )}
      onClick={() => onEdit?.(task)}
    >
      {/* Priority Crystal */}
      <div className={cn(
        "absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center",
        "border-2 border-white/20 backdrop-blur-sm",
        priority.className,
        isCurrent && priority.glowClass
      )}>
        {priority.icon}
      </div>

      {/* XP Badge */}
      <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-crystal">
        +{effort.xp}
      </div>

      <div className="p-6 pt-8">
        {/* Task Title */}
        <h3 className={cn(
          "font-game text-lg font-semibold mb-2 pr-4",
          task.completed && "line-through"
        )}>
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Task Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Priority Badge */}
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              priority.className
            )}>
              {priority.icon}
              <span>{priority.label}</span>
            </div>

            {/* Effort Badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {effort.icon}
              <span>{effort.label}</span>
            </div>
          </div>
        </div>

        {/* Complete Button */}
        {showCompleteButton && !task.completed && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className={cn(
              "w-full btn-magical text-white font-game font-semibold",
              isCurrent && "animate-magical-pulse"
            )}
            size="lg"
          >
            <Check className="w-5 h-5 mr-2" />
            Concluir Missão
          </Button>
        )}

        {task.completed && (
          <div className="flex items-center justify-center w-full py-3 text-accent font-game font-semibold">
            <Check className="w-5 h-5 mr-2" />
            Missão Concluída!
          </div>
        )}
      </div>

      {/* Magical Border Effect for Current Task */}
      {isCurrent && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 pointer-events-none" />
      )}
    </Card>
  );
}