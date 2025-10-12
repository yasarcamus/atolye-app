import { create } from 'zustand';
import { Production, Material, UserSettings } from '@/lib/db';

interface AppState {
  productions: Production[];
  materials: Material[];
  settings: UserSettings | null;
  
  setProductions: (productions: Production[]) => void;
  addProduction: (production: Production) => void;
  updateProduction: (id: number, production: Partial<Production>) => void;
  deleteProduction: (id: number) => void;
  
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (id: number, material: Partial<Material>) => void;
  deleteMaterial: (id: number) => void;
  
  setSettings: (settings: UserSettings) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useStore = create<AppState>((set) => ({
  productions: [],
  materials: [],
  settings: null,
  
  setProductions: (productions) => set({ productions }),
  addProduction: (production) => 
    set((state) => ({ productions: [...state.productions, production] })),
  updateProduction: (id, production) =>
    set((state) => ({
      productions: state.productions.map((p) =>
        p.id === id ? { ...p, ...production } : p
      ),
    })),
  deleteProduction: (id) =>
    set((state) => ({
      productions: state.productions.filter((p) => p.id !== id),
    })),
  
  setMaterials: (materials) => set({ materials }),
  addMaterial: (material) =>
    set((state) => ({ materials: [...state.materials, material] })),
  updateMaterial: (id, material) =>
    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === id ? { ...m, ...material } : m
      ),
    })),
  deleteMaterial: (id) =>
    set((state) => ({
      materials: state.materials.filter((m) => m.id !== id),
    })),
  
  setSettings: (settings) => set({ settings }),
  updateSettings: (settings) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...settings } : null,
    })),
}));
