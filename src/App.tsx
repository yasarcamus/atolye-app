import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from '@/pages/WelcomePage';
import { WorkshopPage } from '@/pages/WorkshopPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PremiumPage } from '@/pages/PremiumPage';
import { MaterialsPage } from '@/pages/MaterialsPage';
import { RecipesPage } from '@/pages/RecipesPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ProductionDetailPage } from '@/pages/ProductionDetailPage';
import { initializeSettings } from '@/lib/db';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isOnboarded = localStorage.getItem('distil_onboarded');
  return isOnboarded ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  useEffect(() => {
    initializeSettings();
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route 
          path="/workshop" 
          element={
            <ProtectedRoute>
              <WorkshopPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/premium" 
          element={
            <ProtectedRoute>
              <PremiumPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/materials" 
          element={
            <ProtectedRoute>
              <MaterialsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recipes" 
          element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/production/:id" 
          element={
            <ProtectedRoute>
              <ProductionDetailPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
