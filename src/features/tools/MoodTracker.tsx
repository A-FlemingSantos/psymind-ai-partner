import React, { useState } from 'react';
import { Heart, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { generateMoodInsight } from '@/shared/services';

interface MoodEntry {
  id: string;
  mood: { label: string; emoji: string };
  date: string;
  note?: string;
}

const MoodTracker: React.FC = () => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const moods = [
    { label: 'Muito Feliz', emoji: '😄' },
    { label: 'Feliz', emoji: '😊' },
    { label: 'Neutro', emoji: '😐' },
    { label: 'Triste', emoji: '😢' },
    { label: 'Ansioso', emoji: '😰' }
  ];

  const addMoodEntry = (mood: { label: string; emoji: string }) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setMoodHistory(prev => [newEntry, ...prev.slice(0, 9)]);
  };

  const generateInsight = async () => {
    if (moodHistory.length === 0) return;
    
    setLoading(true);
    try {
      const result = await generateMoodInsight(moodHistory);
      setInsight(result);
    } catch (error) {
      setInsight('Erro ao gerar análise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="text-pink-500" size={24} />
          Rastreador de Humor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Como você está se sentindo hoje?</h3>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.label}
                variant="outline"
                onClick={() => addMoodEntry(mood)}
                className="flex items-center gap-2"
              >
                <span className="text-xl">{mood.emoji}</span>
                {mood.label}
              </Button>
            ))}
          </div>
        </div>

        {moodHistory.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar size={18} />
                Histórico Recente
              </h3>
              <Button
                onClick={generateInsight}
                disabled={loading}
                size="sm"
                className="flex items-center gap-2"
              >
                <TrendingUp size={16} />
                {loading ? 'Analisando...' : 'Gerar Análise'}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {moodHistory.slice(0, 5).map((entry) => (
                <div key={entry.id} className="text-center p-2 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">{entry.mood.emoji}</div>
                  <div className="text-xs text-muted-foreground">{entry.date}</div>
                </div>
              ))}
            </div>

            {insight && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Análise do Humor</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300" dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;