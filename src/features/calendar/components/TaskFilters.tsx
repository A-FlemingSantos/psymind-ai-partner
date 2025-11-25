import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

interface TaskFiltersProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  showCompleted: boolean;
  onToggleCompleted: () => void;
  onClearFilters: () => void;
}

const categories = [
  { value: 'work', label: 'Trabalho', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'personal', label: 'Pessoal', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  { value: 'health', label: 'Saúde', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'study', label: 'Estudos', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' }
];

const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedCategories,
  onCategoryToggle,
  showCompleted,
  onToggleCompleted,
  onClearFilters
}) => {
  const hasActiveFilters = selectedCategories.length > 0 || !showCompleted;

  return (
    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filtros</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X size={12} className="mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.value}
            variant={selectedCategories.includes(category.value) ? "default" : "outline"}
            className={`cursor-pointer transition-colors text-xs ${
              selectedCategories.includes(category.value) 
                ? category.color 
                : 'hover:bg-muted'
            }`}
            onClick={() => onCategoryToggle(category.value)}
          >
            {category.label}
          </Badge>
        ))}
        
        <Badge
          variant={!showCompleted ? "default" : "outline"}
          className="cursor-pointer text-xs"
          onClick={onToggleCompleted}
        >
          {showCompleted ? 'Todas' : 'Pendentes'}
        </Badge>
      </div>
    </div>
  );
};

export default TaskFilters;