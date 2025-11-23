import React from 'react';
import { X } from 'lucide-react';

interface AddProjectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleAddProject: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isModalOpen, setIsModalOpen, handleAddProject }) => {
  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Novo Projeto</h2>
          <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddProject} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Título do Projeto</label>
            <input
              name="title"
              type="text"
              placeholder="ex: Auditoria Financeira Q3"
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-none focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-zinc-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Categoria</label>
            <select
              name="category"
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-none focus:ring-2 focus:ring-orange-200 transition-all text-zinc-600"
            >
              <option value="Design">Design</option>
              <option value="Development">Desenvolvimento</option>
              <option value="Marketing">Marketing</option>
              <option value="Research">Pesquisa</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl font-medium bg-zinc-900 text-orange-50 hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
            >
              Criar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;