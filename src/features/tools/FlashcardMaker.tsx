import React, { useState, useEffect } from 'react';
import { Brain, Plus, RotateCcw, ChevronLeft, ChevronRight, Trash2, Sparkles } from 'lucide-react';
import { generateFlashcardFromText } from '@/shared/services';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  reviewCount: number;
}

interface FlashcardSet {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: Date;
}

const FlashcardMaker: React.FC = () => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [aiText, setAiText] = useState('');
  const [generating, setGenerating] = useState(false);

  // Load flashcard sets from localStorage
  useEffect(() => {
    const savedSets = localStorage.getItem('psymind-flashcards');
    if (savedSets) {
      const parsedSets = JSON.parse(savedSets).map((set: any) => ({
        ...set,
        createdAt: new Date(set.createdAt),
        cards: set.cards.map((card: any) => ({
          ...card,
          lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined
        }))
      }));
      setSets(parsedSets);
    }
  }, []);

  // Save flashcard sets to localStorage
  useEffect(() => {
    localStorage.setItem('psymind-flashcards', JSON.stringify(sets));
  }, [sets]);

  const createNewSet = () => {
    if (!newSetName.trim()) return;
    
    const newSet: FlashcardSet = {
      id: Date.now().toString(),
      name: newSetName,
      cards: [],
      createdAt: new Date()
    };
    
    setSets([newSet, ...sets]);
    setSelectedSet(newSet);
    setNewSetName('');
    setIsCreating(false);
  };

  const addCard = () => {
    if (!selectedSet || !newCard.front.trim() || !newCard.back.trim()) return;
    
    const card: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front,
      back: newCard.back,
      difficulty: 'medium',
      reviewCount: 0
    };
    
    const updatedSet = {
      ...selectedSet,
      cards: [...selectedSet.cards, card]
    };
    
    setSets(sets.map(set => set.id === selectedSet.id ? updatedSet : set));
    setSelectedSet(updatedSet);
    setNewCard({ front: '', back: '' });
  };

  const deleteCard = (cardId: string) => {
    if (!selectedSet) return;
    
    const updatedSet = {
      ...selectedSet,
      cards: selectedSet.cards.filter(card => card.id !== cardId)
    };
    
    setSets(sets.map(set => set.id === selectedSet.id ? updatedSet : set));
    setSelectedSet(updatedSet);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const deleteSet = (setId: string) => {
    setSets(sets.filter(set => set.id !== setId));
    if (selectedSet?.id === setId) {
      setSelectedSet(null);
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  };

  const markDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!selectedSet || selectedSet.cards.length === 0) return;
    
    const currentCard = selectedSet.cards[currentCardIndex];
    const updatedCard = {
      ...currentCard,
      difficulty,
      lastReviewed: new Date(),
      reviewCount: currentCard.reviewCount + 1
    };
    
    const updatedSet = {
      ...selectedSet,
      cards: selectedSet.cards.map(card => 
        card.id === currentCard.id ? updatedCard : card
      )
    };
    
    setSets(sets.map(set => set.id === selectedSet.id ? updatedSet : set));
    setSelectedSet(updatedSet);
    
    // Move to next card
    nextCard();
  };

  const nextCard = () => {
    if (!selectedSet || selectedSet.cards.length === 0) return;
    setCurrentCardIndex((prev) => (prev + 1) % selectedSet.cards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    if (!selectedSet || selectedSet.cards.length === 0) return;
    setCurrentCardIndex((prev) => (prev - 1 + selectedSet.cards.length) % selectedSet.cards.length);
    setShowAnswer(false);
  };

  const currentCard = selectedSet?.cards[currentCardIndex];

  const generateCardFromAI = async () => {
    if (!aiText.trim()) return;
    
    setGenerating(true);
    try {
      const result = await generateFlashcardFromText(aiText);
      if (result) {
        setNewCard(result);
        setAiText('');
      }
    } catch (error) {
      // Keep current card state on error
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="text-purple-500" size={24} />
            Flashcards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {sets.map((set) => (
              <Button
                key={set.id}
                variant={selectedSet?.id === set.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedSet(set);
                  setCurrentCardIndex(0);
                  setShowAnswer(false);
                }}
                className="flex items-center gap-2"
              >
                {set.name} ({set.cards.length})
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSet(set.id);
                  }}
                  className="p-0 h-auto text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} />
                </Button>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Novo Conjunto
            </Button>
          </div>

          {isCreating && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Nome do conjunto"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createNewSet()}
              />
              <Button onClick={createNewSet}>Criar</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSet && (
        <>
          {/* Study Mode */}
          {selectedSet.cards.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Estudar: {selectedSet.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {currentCardIndex + 1} de {selectedSet.cards.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-48 flex items-center justify-center">
                  <div className="text-center space-y-4 w-full">
                    <div className="text-lg font-medium">
                      {showAnswer ? 'Resposta:' : 'Pergunta:'}
                    </div>
                    <div className="text-xl p-6 bg-muted rounded-lg">
                      {showAnswer ? currentCard?.back : currentCard?.front}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={prevCard}>
                    <ChevronLeft size={16} />
                  </Button>
                  <Button onClick={() => setShowAnswer(!showAnswer)}>
                    <RotateCcw size={16} />
                    {showAnswer ? 'Ver Pergunta' : 'Ver Resposta'}
                  </Button>
                  <Button variant="outline" onClick={nextCard}>
                    <ChevronRight size={16} />
                  </Button>
                </div>

                {showAnswer && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markDifficulty('easy')}
                      className="text-green-600 hover:text-green-700"
                    >
                      Fácil
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markDifficulty('medium')}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      Médio
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markDifficulty('hard')}
                      className="text-red-600 hover:text-red-700"
                    >
                      Difícil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Add New Card */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Card Generation */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Sparkles size={16} />
                  Gerar Card com IA
                </label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Cole um texto para gerar pergunta e resposta automaticamente..."
                    value={aiText}
                    onChange={(e) => setAiText(e.target.value)}
                    className="min-h-16"
                  />
                  <Button
                    onClick={generateCardFromAI}
                    disabled={generating || !aiText.trim()}
                    className="shrink-0"
                  >
                    {generating ? 'Gerando...' : 'Gerar'}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Pergunta (Frente)</label>
                <Textarea
                  placeholder="Digite a pergunta..."
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  className="min-h-20"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Resposta (Verso)</label>
                <Textarea
                  placeholder="Digite a resposta..."
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  className="min-h-20"
                />
              </div>
              <Button onClick={addCard} className="w-full">
                <Plus size={16} />
                Adicionar Card
              </Button>
            </CardContent>
          </Card>

          {/* Cards List */}
          {selectedSet.cards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cards no Conjunto ({selectedSet.cards.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedSet.cards.map((card, index) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{card.front}</div>
                        <div className="text-xs text-muted-foreground truncate">{card.back}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          card.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {card.difficulty === 'easy' ? 'Fácil' : 
                           card.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCard(card.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!selectedSet && (
        <Card>
          <CardContent className="text-center py-16">
            <Brain size={64} className="mx-auto mb-4 opacity-50 text-muted-foreground" />
            <p className="text-lg mb-2">Crie seu primeiro conjunto de flashcards</p>
            <p className="text-sm text-muted-foreground">
              Flashcards são uma excelente ferramenta para memorização e revisão
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlashcardMaker;