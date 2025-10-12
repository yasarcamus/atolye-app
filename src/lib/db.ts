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
  
  // Shaking reminders
  shakingFrequency?: number; // days between shakings (1 = daily, 2 = every 2 days)
  shakingHistory?: { date: Date; shaken: boolean }[];
  lastShakingDate?: Date;
  nextShakingDate?: Date;
  
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
  pricePerMl: number; // Price per unit (depends on unit)
  unit: 'ml' | 'g' | 'adet';
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id?: number;
  isPremium: boolean;
  notificationsEnabled: boolean;
  notificationTime: string; // HH:mm format
  shakingRemindersEnabled: boolean;
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
      shakingRemindersEnabled: true,
      productionLimit: 3,
      darkMode: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};

// Initialize default materials (Alkol, Saf Su, Şişe)
export const initializeDefaultMaterials = async () => {
  const count = await db.materials.count();
  if (count === 0) {
    const now = new Date();
    await db.materials.bulkAdd([
      { name: 'Alkol', type: 'alcohol', pricePerMl: 0, unit: 'ml', createdAt: now, updatedAt: now },
      { name: 'Saf Su', type: 'water', pricePerMl: 0, unit: 'ml', createdAt: now, updatedAt: now },
      { name: 'Şişe', type: 'other', pricePerMl: 0, unit: 'adet', createdAt: now, updatedAt: now },
    ]);
  }
};
