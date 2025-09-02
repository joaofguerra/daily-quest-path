import { useGameStore } from '@/stores/gameStore';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';
import { SampleDataButton } from './SampleDataButton';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DailyMission() {
  const { 
    dailyMission, 
    generateDailyMission, 
    completeTask, 
    getTodaysMission,
    isNewDay 
  } = useGameStore();

  const [editingTask, setEditingTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    // Generate daily mission if it's a new day or no mission exists
    const todaysMission = getTodaysMission();
    if (!todaysMission || isNewDay()) {
      generateDailyMission();
    }
  }, []);

  const mission = getTodaysMission();
  
  if (!mission) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="font-fantasy text-3xl font-bold text-primary mb-4">
            Bom dia, aventureiro!
          </h1>
          <p className="text-muted-foreground font-game text-lg mb-6">
            Uma nova missão aguarda por ti. Estás pronto para conquistar o dia?
          </p>
          <div className="space-y-4">
            <SampleDataButton />
            <Button 
              onClick={generateDailyMission}
              className="btn-magical text-white font-game font-semibold px-8 py-4 text-lg"
              size="lg"
            >
              <RefreshCw className="w-6 h-6 mr-3" />
              Gerar Missão Diária
            </Button>
            <Button 
              onClick={() => setShowAddTask(true)}
              variant="outline"
              className="font-game px-6 py-3"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Tarefa ao Grimório
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentTaskIndex = mission.tasks.findIndex(task => !task.completed);
  const currentTask = mission.tasks[currentTaskIndex];
  const nextTask = mission.tasks[currentTaskIndex + 1];
  const completedTasks = mission.tasks.filter(task => task.completed).length;
  const totalTasks = mission.tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const handleTaskComplete = (taskId: string) => {
    completeTask(taskId);
  };

  if (mission.completed) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="text-center mb-8 level-up-animation">
          <h1 className="font-fantasy text-4xl font-bold text-level-up mb-4">
            🎉 Missão Concluída! 🎉
          </h1>
          <p className="text-muted-foreground font-game text-lg mb-6">
            Fantástico! Conquistaste todas as tarefas de hoje. 
            <br />
            <span className="text-accent font-bold">+{mission.totalXP} XP</span> ganhos no total!
          </p>
          <div className="bg-gradient-primary text-white p-6 rounded-xl shadow-magical mb-6">
            <p className="font-game text-lg">
              O teu caminho fica mais claro. Que a aventura continue amanhã!
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={generateDailyMission}
              className="btn-magical text-white font-game font-semibold px-6 py-3"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tarefas Extra (Opcional)
            </Button>
            <Button 
              onClick={() => setShowAddTask(true)}
              variant="outline"
              className="font-game px-6 py-3"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Nova Tarefa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Mission Header */}
      <div className="mb-8 text-center">
        <h1 className="font-fantasy text-3xl md:text-4xl font-bold text-primary mb-2">
          Missão Diária
        </h1>
        <p className="text-muted-foreground font-game">
          {new Date().toLocaleDateString('pt-PT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Progress Trail */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-game text-sm text-muted-foreground">
            Progresso da Missão
          </span>
          <span className="font-game text-sm font-bold text-primary">
            {completedTasks} / {totalTasks} concluídas
          </span>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Task Trail */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Current Task */}
        {currentTask && (
          <div className="animate-trail-advance">
            <div className="text-center mb-4">
              <h2 className="font-fantasy text-xl font-bold text-primary mb-2">
                Missão Atual
              </h2>
              <p className="text-muted-foreground font-game text-sm">
                Foca-te nesta missão para avançares na trilha
              </p>
            </div>
            <TaskCard
              task={currentTask}
              onComplete={handleTaskComplete}
              isCurrent={true}
              showCompleteButton={true}
            />
          </div>
        )}

        {/* Next Task Preview */}
        {nextTask && (
          <div className="relative">
            <div className="text-center mb-4">
              <h3 className="font-game text-lg font-semibold text-muted-foreground mb-1">
                Próxima Missão
              </h3>
              <p className="text-muted-foreground font-game text-xs">
                Será desbloqueada após completar a missão atual
              </p>
            </div>
            <TaskCard
              task={nextTask}
              isNext={true}
              showCompleteButton={false}
            />
            <div className="absolute inset-0 bg-black/20 rounded-lg pointer-events-none" />
          </div>
        )}

        {/* Completed Tasks */}
        {mission.tasks.filter(task => task.completed).length > 0 && (
          <div className="mt-12">
            <h3 className="font-game text-lg font-semibold text-accent mb-4 text-center">
              Missões Conquistadas ✨
            </h3>
            <div className="space-y-4 opacity-60">
              {mission.tasks
                .filter(task => task.completed)
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    showCompleteButton={false}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Regenerate Mission Button */}
      <div className="text-center mt-12">
        <Button 
          onClick={generateDailyMission}
          variant="outline"
          className="font-game"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerar Missão
        </Button>
      </div>

      {/* Add Task Dialog */}
      <AddTaskDialog 
        open={showAddTask} 
        onOpenChange={setShowAddTask} 
      />
    </div>
  );
}