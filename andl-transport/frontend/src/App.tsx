import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import InscriptionsPage from './pages/InscriptionsPage';
import EtudiantDashboard from './pages/EtudiantDashboard';
import SoumissionInscription from './pages/SoumissionInscription';
import GestionEtudiantsPage from './pages/GestionEtudiantsPage';
import GestionPaiementsPage from './pages/GestionPaiementsPage';
import TransportManagementPage from './pages/TransportManagementPage';
import BusChauffeursPage from './pages/BusChauffeursPage';
import EtablissementsPage from './pages/EtablissementsPage';
import TarifManagementPage from './pages/TarifManagementPage';
import QRScannerPage from './pages/QRScannerPage';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Afficher un écran de chargement pendant que nous récupérons l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-lg font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Écran de chargement au démarrage
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-lg font-semibold">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isAdmin ? "/admin/dashboard" : "/etudiant/dashboard"} replace />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={isAdmin ? "/admin/dashboard" : "/etudiant/dashboard"} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/inscriptions" element={
        <ProtectedRoute role="ADMIN">
          <InscriptionsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/etudiants" element={
        <ProtectedRoute role="ADMIN">
          <GestionEtudiantsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/paiements" element={
        <ProtectedRoute role="ADMIN">
          <GestionPaiementsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/transport" element={
        <ProtectedRoute role="ADMIN">
          <TransportManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/bus-chauffeurs" element={
        <ProtectedRoute role="ADMIN">
          <BusChauffeursPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/etablissements" element={
        <ProtectedRoute role="ADMIN">
          <EtablissementsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/tarifs" element={
        <ProtectedRoute role="ADMIN">
          <TarifManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/scanner" element={
        <ProtectedRoute role="ADMIN">
          <QRScannerPage />
        </ProtectedRoute>
      } />

      <Route path="/etudiant/dashboard" element={
        <ProtectedRoute role="ETUDIANT">
          <EtudiantDashboard />
        </ProtectedRoute>
      } />

      <Route path="/etudiant/inscription" element={
        <ProtectedRoute role="ETUDIANT">
          <SoumissionInscription />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
