import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Crown, Star, Circle, Zap, Sword, Shield } from 'lucide-react';
import { Priority, Effort } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const priorityOptions: Array<{ value: Priority; label: string; icon: React.ReactNode; className: string }> = [
  { value: 'critical', label: 'Crítico', icon: <Crown className="w-5 h-5" />, className: 'crystal-critical' },
  { value: 'important', label: 'Importante', icon: <Star className="w-5 h-5" />, className: 'crystal-important' },
  { value: 'normal', label: 'Normal', icon: <Circle className="w-5 h-5" />, className: 'crystal-normal' },
  { value: 'optional', label: 'Opcional', icon: <Circle className="w-4 h-4" />, className: 'crystal-optional' },
];

const effortOptions: Array<{ value: Effort; label: string; icon: React.ReactNode; xp: number }> = [
  { value: 'quick', label: 'Rápido', icon: <Zap className="w-5 h-5" />, xp: 10 },
  { value: 'medium', label: 'Médio', icon: <Sword className="w-5 h-5" />, xp: 30 },
  { value: 'large', label: 'Grande', icon: <Shield className="w-5 h-5" />, xp: 70 },
];

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [effort, setEffort] = useState<Effort>('medium');
  
  const { addTask } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addTask(title.trim(), description.trim(), priority, effort);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('normal');
    setEffort('medium');
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fantasy text-2xl text-primary">
            Nova Aventura
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-game font-semibold">
              Título da Missão *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Responder emails importantes"
              className="font-game"
              required
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-game font-semibold">
              Detalhes da Missão (opcional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adiciona notas, links ou detalhes extras..."
              className="font-game min-h-20"
              rows={3}
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <Label className="font-game font-semibold">
              Cristal de Poder (Prioridade)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all duration-200 text-white font-game font-medium",
                    "flex items-center gap-2 justify-center hover:scale-105",
                    priority === option.value 
                      ? `${option.className} border-white/50 shadow-lg` 
                      : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  )}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Effort Selection */}
          <div className="space-y-3">
            <Label className="font-game font-semibold">
              Tamanho do Desafio (Esforço)
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {effortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEffort(option.value)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all duration-200 font-game font-medium",
                    "flex flex-col items-center gap-1 hover:scale-105",
                    effort === option.value 
                      ? "bg-accent text-accent-foreground border-accent shadow-crystal" 
                      : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  )}
                >
                  {option.icon}
                  <span className="text-xs">{option.label}</span>
                  <span className="text-xs font-bold">+{option.xp} XP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 font-game"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-magical text-white font-game font-semibold"
              disabled={!title.trim()}
            >
              Adicionar ao Grimório
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}