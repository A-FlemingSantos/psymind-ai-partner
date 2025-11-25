import React, { useState, useEffect } from 'react';
import { Heart, Shuffle, Users, User, Briefcase, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { sendMessage } from '@/shared/services/chatService';

interface KindnessAct {
  id: string;
  text: string;
  category: string;
  completed: boolean;
  completedAt?: Date;
}

const KindnessTracker: React.FC = () => {
  const [currentAct, setCurrentAct] = useState<KindnessAct | null>(null);
  const [category, setCategory] = useState('random');
  const [isLoading, setIsLoading] = useState(false);
  const [completedActs, setCompletedActs] = useState<KindnessAct[]>([]);

  const categories = [
    { id: 'random', label: 'Aleatório', icon: Shuffle },
    { id: 'stranger', label: 'Estranhos', icon: Users },
    { id: 'family', label: 'Família/Amigos', icon: User },
    { id: 'self', label: 'Para Você', icon: Heart },
    { id: 'work', label: 'Trabalho/Escola', icon: Briefcase }
  ];

  const actsDatabase = {
    stranger: [
      "Elogie sinceramente a roupa ou acessório de alguém que você não conhece.",
      "Segure a porta para alguém entrar ou sair.",
      "Deixe um bilhete positivo em um livro da biblioteca ou lugar público.",
      "Sorria e cumprimente o motorista do ônibus ou caixa do mercado.",
      "Pague o café da pessoa atrás de você na fila (se puder)."
    ],
    family: [
      "Ligue para um parente apenas para dizer que o ama.",
      "Faça uma tarefa doméstica que não é sua responsabilidade.",
      "Escreva uma carta de agradecimento para alguém que te ajudou no passado.",
      "Cozinhe a refeição favorita de alguém da sua casa.",
      "Ouça ativamente alguém sem interromper ou olhar o celular."
    ],
    self: [
      "Liste 3 coisas que você gosta em si mesmo.",
      "Tire 15 minutos para fazer algo que você ama sem culpa.",
      "Perdoe-se por um erro cometido recentemente.",
      "Faça uma caminhada consciente observando a natureza.",
      "Escreva em um diário como você está se sentindo hoje."
    ],
    work: [
      "Ofereça ajuda a um colega que parece sobrecarregado.",
      "Elogie o trabalho de alguém publicamente ou para o chefe.",
      "Traga um lanche ou doce para compartilhar com a equipe.",
      "Deixe um post-it de encorajamento na mesa de alguém.",
      "Agradeça a alguém por algo específico que ela fez."
    ]
  };

  useEffect(() => {
    const saved = localStorage.getItem('psymind-kindness-acts');
    if (saved) {
      const parsed = JSON.parse(saved).map((act: any) => ({
        ...act,
        completedAt: act.completedAt ? new Date(act.completedAt) : undefined
      }));
      setCompletedActs(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('psymind-kindness-acts', JSON.stringify(completedActs));
  }, [completedActs]);

  const generateAct = async (selectedCategory = category) => {
    setIsLoading(true);
    
    try {
      const categoryPrompts = {
        random: 'Sugira um ato de bondade simples e prático que qualquer pessoa pode fazer hoje (1 frase). Sem saudações.',
        stranger: 'Sugira um ato de bondade simples para fazer a um estranho (1 frase). Sem saudações.',
        family: 'Sugira um ato de bondade simples para fazer a família ou amigos (1 frase). Sem saudações.',
        self: 'Sugira um ato de autocuidado ou autocompaixão simples (1 frase). Sem saudações.',
        work: 'Sugira um ato de bondade simples para fazer no trabalho ou escola (1 frase). Sem saudações.'
      };
      
      const prompt = categoryPrompts[selectedCategory as keyof typeof categoryPrompts] || categoryPrompts.random;
      const result = await sendMessage(prompt, []);
      
      if (result.success) {
        setCurrentAct({
          id: Date.now().toString(),
          text: result.text.trim(),
          category: selectedCategory,
          completed: false
        });
      } else {
        // Fallback to database
        generateFromDatabase(selectedCategory);
      }
    } catch (error) {
      generateFromDatabase(selectedCategory);
    }
    
    setIsLoading(false);
  };

  const generateFromDatabase = (selectedCategory: string) => {
    let pool: string[] = [];
    if (selectedCategory === 'random') {
      Object.values(actsDatabase).forEach(arr => pool.push(...arr));
    } else {
      pool = actsDatabase[selectedCategory as keyof typeof actsDatabase] || [];
    }
    const randomAct = pool[Math.floor(Math.random() * pool.length)];
    
    setCurrentAct({
      id: Date.now().toString(),
      text: randomAct,
      category: selectedCategory,
      completed: false
    });
  };

  const handleComplete = () => {
    if (!currentAct) return;
    
    const completedAct = {
      ...currentAct,
      completed: true,
      completedAt: new Date()
    };
    
    setCompletedActs(prev => [completedAct, ...prev.slice(0, 9)]);
    setCurrentAct(null);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    generateAct(newCategory);
  };

  useEffect(() => {
    if (!currentAct) {
      generateAct();
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="text-pink-500" size={24} />
          Atos de Bondade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={category === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(cat.id)}
                className="flex items-center gap-2"
              >
                <IconComponent size={16} />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Current Act */}
        <div className="min-h-32 flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <Heart className="animate-pulse text-pink-500 mx-auto mb-2" size={32} />
              <p className="text-muted-foreground">A IA está encontrando o ato perfeito...</p>
            </div>
          ) : currentAct ? (
            <div className="text-center space-y-4 w-full">
              <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <Heart className="text-pink-500 mx-auto mb-3" size={24} />
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  {currentAct.text}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Heart size={48} className="mx-auto mb-4 opacity-50" />
              <p>Clique em "Gerar Outro" para começar</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => generateAct()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Gerar Outro
          </Button>
          
          {currentAct && (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Vou fazer isso!
            </Button>
          )}
        </div>

        {/* Completed Acts */}
        {completedActs.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={18} />
              Atos Realizados ({completedActs.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {completedActs.slice(0, 5).map((act) => (
                <div key={act.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-1">{act.text}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {act.completedAt?.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KindnessTracker;