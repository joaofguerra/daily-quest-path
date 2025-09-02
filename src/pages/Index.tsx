import { XPBar } from '@/components/game/XPBar';
import { DailyMission } from '@/components/game/DailyMission';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Settings } from 'lucide-react';

const Index = () => {
  const { userProgress } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-enchanted">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-fantasy font-bold text-sm">L</span>
              </div>
              <h1 className="font-fantasy text-xl font-bold text-primary">
                LevelUp Life
              </h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="font-game">
                <BookOpen className="w-4 h-4 mr-2" />
                Grimório
              </Button>
              <Button variant="ghost" size="sm" className="font-game">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-4">
            <XPBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <DailyMission />
      </main>
    </div>
  );
};

export default Index;