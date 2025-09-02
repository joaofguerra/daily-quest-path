import { useGameStore } from '@/stores/gameStore';
import { getXPForNextLevel } from '@/types/game';
import { Sparkles } from 'lucide-react';

export function XPBar() {
  const { userProgress, combo } = useGameStore();
  const nextLevelXP = getXPForNextLevel(userProgress.level);
  const currentLevelStartXP = userProgress.level > 1 ? getXPForNextLevel(userProgress.level - 1) : 0;
  const progressInLevel = userProgress.totalXP - currentLevelStartXP;
  const xpNeededForLevel = nextLevelXP - currentLevelStartXP;
  const progressPercentage = (progressInLevel / xpNeededForLevel) * 100;

  return (
    <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 shadow-soft">
      {/* Level Badge */}
      <div className="absolute -top-3 left-4 bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-game font-bold shadow-magical">
        Nível {userProgress.level}
      </div>

      {/* Combo Indicator */}
      {combo.active && (
        <div className="absolute -top-3 right-4 bg-combo text-white px-3 py-1 rounded-full text-sm font-game font-bold shadow-crystal animate-magical-pulse flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Combo {combo.multiplier}x
        </div>
      )}

      {/* XP Progress Bar */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-game text-muted-foreground">
            {progressInLevel} / {xpNeededForLevel} XP
          </span>
          <span className="text-sm font-game text-accent font-bold">
            Total: {userProgress.totalXP} XP
          </span>
        </div>
        
        <div className="relative h-3 bg-muted rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full xp-bar rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
          {progressPercentage >= 100 && (
            <div className="absolute inset-0 bg-level-up rounded-full animate-magical-pulse" />
          )}
        </div>
      </div>

      {/* Streak Indicator */}
      <div className="flex items-center justify-between mt-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-streak rounded-full shadow-crystal animate-crystal-shine" />
          <span className="font-game text-muted-foreground">
            Sequência: <span className="text-streak font-bold">{userProgress.currentStreak} dias</span>
          </span>
        </div>
        <div className="text-muted-foreground font-game">
          Tarefas: <span className="text-accent font-bold">{userProgress.tasksCompleted}</span>
        </div>
      </div>
    </div>
  );
}