import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { Wand2 } from 'lucide-react';

export function SampleDataButton() {
  const { addTask, grimoire } = useGameStore();

  const addSampleTasks = () => {
    if (grimoire.length > 0) return; // Don't add if tasks already exist

    const sampleTasks = [
      {
        title: "Responder emails importantes",
        description: "Revisar e responder emails pendentes da caixa de entrada",
        priority: "critical" as const,
        effort: "medium" as const
      },
      {
        title: "Fazer exercício físico",
        description: "30 minutos de caminhada ou treino no ginásio",
        priority: "important" as const,
        effort: "large" as const
      },
      {
        title: "Estudar para apresentação",
        description: "Preparar slides e ensaiar apresentação de amanhã",
        priority: "critical" as const,
        effort: "large" as const
      },
      {
        title: "Fazer compras do supermercado",
        description: "Lista: leite, pão, frutas, legumes",
        priority: "normal" as const,
        effort: "medium" as const
      },
      {
        title: "Ligar aos pais",
        description: "Verificar como estão e marcar almoço do fim de semana",
        priority: "important" as const,
        effort: "quick" as const
      },
      {
        title: "Organizar secretária",
        description: "Arrumar documentos e limpar espaço de trabalho",
        priority: "optional" as const,
        effort: "quick" as const
      },
      {
        title: "Ler capítulo do livro",
        description: "Continuar leitura do livro de desenvolvimento pessoal",
        priority: "optional" as const,
        effort: "medium" as const
      },
      {
        title: "Revisar relatório mensal",
        description: "Analisar métricas e preparar sumário executivo",
        priority: "critical" as const,
        effort: "large" as const
      }
    ];

    sampleTasks.forEach(task => {
      addTask(task.title, task.description, task.priority, task.effort);
    });
  };

  if (grimoire.length > 0) {
    return null; // Don't show button if tasks already exist
  }

  return (
    <Button
      onClick={addSampleTasks}
      className="btn-magical text-white font-game font-semibold"
      size="lg"
    >
      <Wand2 className="w-5 h-5 mr-2" />
      Adicionar Tarefas de Exemplo
    </Button>
  );
}