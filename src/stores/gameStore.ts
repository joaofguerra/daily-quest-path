import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, UserProgress, Combo, DailyMission, Priority, Effort, XP_VALUES, PRIORITY_ORDER, calculateLevelFromXP } from '../types/game';

interface GameState {
  // User data
  userProgress: UserProgress;
  
  // Tasks and missions
  grimoire: Task[];
  dailyMission: DailyMission | null;
  
  // Gamification
  combo: Combo;
  
  // Actions
  addTask: (title: string, description: string, priority: Priority, effort: Effort) => void;
  completeTask: (taskId: string) => void;
  generateDailyMission: () => void;
  updateUserProgress: (xpGained: number) => void;
  checkAndUpdateCombo: () => void;
  editTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // Utilities
  getTodaysMission: () => DailyMission | null;
  isNewDay: () => boolean;
}

const initialUserProgress: UserProgress = {
  id: 'user-1',
  level: 1,
  currentXP: 0,
  totalXP: 0,
  currentStreak: 0,
  bestStreak: 0,
  tasksCompleted: 0,
  lastActivityDate: new Date(),
  unlockedThemes: ['enchanted-forest'],
  activeTheme: 'enchanted-forest',
  achievements: [],
};

const initialCombo: Combo = {
  active: false,
  tasksInCombo: 0,
  startTime: new Date(),
  multiplier: 1,
  expiresAt: new Date(),
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      userProgress: initialUserProgress,
      grimoire: [],
      dailyMission: null,
      combo: initialCombo,

      addTask: (title, description, priority, effort) => {
        const newTask: Task = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          description,
          priority,
          effort,
          completed: false,
          createdAt: new Date(),
        };

        set((state) => ({
          grimoire: [...state.grimoire, newTask],
        }));
      },

      completeTask: (taskId) => {
        const { grimoire, dailyMission, userProgress, updateUserProgress, checkAndUpdateCombo } = get();
        
        // Find task in grimoire or daily mission
        let task = grimoire.find(t => t.id === taskId);
        if (!task && dailyMission) {
          task = dailyMission.tasks.find(t => t.id === taskId);
        }
        
        if (!task || task.completed) return;

        const xpGained = XP_VALUES[task.effort];
        
        // Update task
        const updatedTask = {
          ...task,
          completed: true,
          completedAt: new Date(),
        };

        // Update grimoire
        set((state) => ({
          grimoire: state.grimoire.map(t => 
            t.id === taskId ? updatedTask : t
          ),
        }));

        // Update daily mission if task is part of it
        if (dailyMission && dailyMission.tasks.some(t => t.id === taskId)) {
          const updatedMissionTasks = dailyMission.tasks.map(t => 
            t.id === taskId ? updatedTask : t
          );
          
          const allTasksCompleted = updatedMissionTasks.every(t => t.completed);
          
          set((state) => ({
            dailyMission: state.dailyMission ? {
              ...state.dailyMission,
              tasks: updatedMissionTasks,
              completed: allTasksCompleted,
              totalXP: state.dailyMission.totalXP + xpGained,
            } : null,
          }));
        }

        // Update user progress
        updateUserProgress(xpGained);
        checkAndUpdateCombo();
      },

      generateDailyMission: () => {
        const { grimoire } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter pending tasks
        const pendingTasks = grimoire.filter(task => !task.completed);
        
        // Sort by priority (critical first) then by creation date (oldest first)
        const sortedTasks = pendingTasks.sort((a, b) => {
          const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return a.createdAt.getTime() - b.createdAt.getTime();
        });

        // Take the top 5-7 tasks for the daily mission
        const missionTasks = sortedTasks.slice(0, 6);

        const mission: DailyMission = {
          id: `mission-${today.getTime()}`,
          date: today,
          tasks: missionTasks,
          completed: false,
          totalXP: 0,
        };

        set({ dailyMission: mission });
      },

      updateUserProgress: (xpGained) => {
        set((state) => {
          const newTotalXP = state.userProgress.totalXP + xpGained;
          const newLevel = calculateLevelFromXP(newTotalXP);
          const leveledUp = newLevel > state.userProgress.level;

          // Update streak if it's a new day
          const today = new Date();
          const lastActivity = new Date(state.userProgress.lastActivityDate);
          const isNewDay = today.toDateString() !== lastActivity.toDateString();
          
          let newStreak = state.userProgress.currentStreak;
          if (isNewDay) {
            const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
              newStreak += 1; // Continue streak
            } else if (daysDiff > 1) {
              newStreak = 1; // Reset streak but count today
            }
          }

          return {
            userProgress: {
              ...state.userProgress,
              level: newLevel,
              currentXP: newTotalXP,
              totalXP: newTotalXP,
              currentStreak: newStreak,
              bestStreak: Math.max(newStreak, state.userProgress.bestStreak),
              tasksCompleted: state.userProgress.tasksCompleted + 1,
              lastActivityDate: today,
            },
          };
        });
      },

      checkAndUpdateCombo: () => {
        const { userProgress } = get();
        const now = new Date();
        
        set((state) => {
          const timeSinceLastTask = now.getTime() - state.combo.startTime.getTime();
          const withinComboWindow = timeSinceLastTask <= 60 * 60 * 1000; // 1 hour

          if (withinComboWindow) {
            const newTasksInCombo = state.combo.tasksInCombo + 1;
            const comboActive = newTasksInCombo >= 3;
            
            return {
              combo: {
                active: comboActive,
                tasksInCombo: newTasksInCombo,
                startTime: state.combo.tasksInCombo === 0 ? now : state.combo.startTime,
                multiplier: comboActive ? 1.5 : 1,
                expiresAt: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes
              },
            };
          } else {
            // Reset combo
            return {
              combo: {
                active: false,
                tasksInCombo: 1,
                startTime: now,
                multiplier: 1,
                expiresAt: now,
              },
            };
          }
        });
      },

      editTask: (taskId, updates) => {
        set((state) => ({
          grimoire: state.grimoire.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          grimoire: state.grimoire.filter(task => task.id !== taskId),
        }));
      },

      getTodaysMission: () => {
        const { dailyMission } = get();
        if (!dailyMission) return null;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const missionDate = new Date(dailyMission.date);
        missionDate.setHours(0, 0, 0, 0);
        
        return today.getTime() === missionDate.getTime() ? dailyMission : null;
      },

      isNewDay: () => {
        const { userProgress } = get();
        const today = new Date();
        const lastActivity = new Date(userProgress.lastActivityDate);
        return today.toDateString() !== lastActivity.toDateString();
      },
    }),
    {
      name: 'levelup-life-game-storage',
    }
  )
);