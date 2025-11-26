import React, { useState, useEffect } from 'react';
import { FileText, Save, Download, Trash2, Search, Sparkles } from 'lucide-react';
import { improveNote } from '@/shared/services';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteTaker: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [improving, setImproving] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('psymind-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('psymind-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Nova Anotação',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;
    
    setNotes(notes.map(note => 
      note.id === selectedNote.id 
        ? { ...selectedNote, updatedAt: new Date() }
        : note
    ));
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const downloadNote = (note: Note) => {
    const element = document.createElement('a');
    const file = new Blob([`${note.title}\n\n${note.content}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const improveNoteWithAI = async () => {
    if (!selectedNote || !selectedNote.content.trim()) return;
    
    setImproving(true);
    try {
      const improved = await improveNote(selectedNote.content);
      setSelectedNote({ ...selectedNote, content: improved });
    } catch (error) {
      // Keep original content on error
    } finally {
      setImproving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Notes List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-blue-500" size={24} />
            Anotações
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar anotações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={createNewNote} size="sm">
              Nova
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma anotação encontrada</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setIsEditing(false);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedNote?.id === note.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <h4 className="font-medium text-sm truncate">{note.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {note.content || 'Sem conteúdo'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDate(note.updatedAt)}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Note Editor */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {selectedNote ? (isEditing ? 'Editando' : 'Visualizando') : 'Editor de Anotações'}
            </CardTitle>
            {selectedNote && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadNote(selectedNote)}
                >
                  <Download size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteNote(selectedNote.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
                {isEditing ? (
                  <Button size="sm" onClick={saveNote}>
                    <Save size={16} />
                    Salvar
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                )}
                {selectedNote.content.trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={improveNoteWithAI}
                    disabled={improving}
                    className="flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    {improving ? 'Melhorando...' : 'Melhorar com IA'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedNote ? (
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <Input
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                    placeholder="Título da anotação"
                    className="font-medium"
                  />
                  <Textarea
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                    placeholder="Escreva sua anotação aqui..."
                    className="min-h-96 resize-none"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{selectedNote.title}</h3>
                  <div className="text-sm text-muted-foreground mb-4">
                    Criado em: {formatDate(selectedNote.createdAt)}
                    {selectedNote.updatedAt.getTime() !== selectedNote.createdAt.getTime() && (
                      <span> • Atualizado em: {formatDate(selectedNote.updatedAt)}</span>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedNote.content || 'Esta anotação está vazia.'}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <FileText size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Selecione uma anotação para visualizar</p>
              <p className="text-sm">ou crie uma nova anotação para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteTaker;