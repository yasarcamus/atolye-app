import Dexie, { Table } from 'dexie';

export interface Production {
  id?: number;
  name: string;
  essenceName: string;
  essenceRatio: number;
  alcoholRatio: number;
  alcoholBrand: string;
  bottleSize: number;
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  notes?: string;
  status: 'active' | 'completed' | 'tested';
  isFavorite?: boolean;
  category?: string;
  tags?: string[];
  images?: string[];
  dailyNotes?: { date: Date; note: string }[];
  
  // Test results
  longevity?: number;
  sillage?: number;
  rating?: number;
  fabricTest?: string;
  skinTest?: string;
  occasion?: string;
  
  // Cost calculation
  alcoholCost?: number;
  waterCost?: number;
  essenceCost?: number;
  totalCost?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id?: number;
  name: string;
  type: 'alcohol' | 'water' | 'essence' | 'other';
  pricePerMl: number;
  unit: 'ml' | 'g';
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id?: number;
  isPremium: boolean;
  notificationsEnabled: boolean;
  notificationTime: string; // HH:mm format
  productionLimit: number;
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id?: number;
  productionId: number;
  name: string;
  description?: string;
  isFavorite: boolean;
  rating?: number;
  timesUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export class DistilDB extends Dexie {
  productions!: Table<Production>;
  materials!: Table<Material>;
  settings!: Table<UserSettings>;
  recipes!: Table<Recipe>;

  constructor() {
    super('DistilDB');
    this.version(2).stores({
      productions: '++id, name, status, startDate, endDate, createdAt, isFavorite',
      materials: '++id, name, type, createdAt',
      settings: '++id',
      recipes: '++id, productionId, isFavorite, createdAt'
    });
  }
}

export const db = new DistilDB();

// Initialize default settings
export const initializeSettings = async () => {
  const existingSettings = await db.settings.toArray();
  if (existingSettings.length === 0) {
    await db.settings.add({
      isPremium: false,
      notificationsEnabled: true,
      notificationTime: '20:00',
      productionLimit: 3,
      darkMode: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};
