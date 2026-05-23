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
import ResponsableDashboard from './pages/ResponsableDashboard';
import GestionLignesResponsable from './pages/GestionLignesResponsable';
import AssignationChauffeurs from './pages/AssignationChauffeurs';
import ChauffeurDashboard from './pages/ChauffeurDashboard';
import ProgrammeRechlatChauffeur from './pages/ProgrammeRechlatChauffeur';
import ListeRekab from './pages/ListeRekab';

const LoadingScreen = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      <p className="text-white text-lg font-semibold">Chargement...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

function getHomeRoute(role?: string) {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'RESPONSABLE') return '/responsable/dashboard';
  if (role === 'CHAUFFEUR') return '/chauffeur/dashboard';
  return '/etudiant/dashboard';
}

function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  const homeRoute = getHomeRoute(user?.role);

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to={homeRoute} replace />}
      />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to={homeRoute} replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* ── ADMIN ── */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/inscriptions" element={<ProtectedRoute role="ADMIN"><InscriptionsPage /></ProtectedRoute>} />
      <Route path="/admin/etudiants" element={<ProtectedRoute role="ADMIN"><GestionEtudiantsPage /></ProtectedRoute>} />
      <Route path="/admin/paiements" element={<ProtectedRoute role="ADMIN"><GestionPaiementsPage /></ProtectedRoute>} />
      <Route path="/admin/transport" element={<ProtectedRoute role="ADMIN"><TransportManagementPage /></ProtectedRoute>} />
      <Route path="/admin/bus-chauffeurs" element={<ProtectedRoute role="ADMIN"><BusChauffeursPage /></ProtectedRoute>} />
      <Route path="/admin/etablissements" element={<ProtectedRoute role="ADMIN"><EtablissementsPage /></ProtectedRoute>} />
      <Route path="/admin/tarifs" element={<ProtectedRoute role="ADMIN"><TarifManagementPage /></ProtectedRoute>} />
      <Route path="/admin/scanner" element={<ProtectedRoute role="ADMIN"><QRScannerPage /></ProtectedRoute>} />

      {/* ── ETUDIANT ── */}
      <Route path="/etudiant/dashboard" element={<ProtectedRoute role="ETUDIANT"><EtudiantDashboard /></ProtectedRoute>} />
      <Route path="/etudiant/inscription" element={<ProtectedRoute role="ETUDIANT"><SoumissionInscription /></ProtectedRoute>} />

      {/* ── RESPONSABLE ── */}
      <Route path="/responsable/dashboard" element={<ProtectedRoute role="RESPONSABLE"><ResponsableDashboard /></ProtectedRoute>} />
      <Route path="/responsable/lignes" element={<ProtectedRoute role="RESPONSABLE"><GestionLignesResponsable /></ProtectedRoute>} />
      <Route path="/responsable/chauffeurs" element={<ProtectedRoute role="RESPONSABLE"><AssignationChauffeurs /></ProtectedRoute>} />

      {/* ── CHAUFFEUR ── */}
      <Route path="/chauffeur/dashboard" element={<ProtectedRoute role="CHAUFFEUR"><ChauffeurDashboard /></ProtectedRoute>} />
      <Route path="/chauffeur/programme" element={<ProtectedRoute role="CHAUFFEUR"><ProgrammeRechlatChauffeur /></ProtectedRoute>} />
      <Route path="/chauffeur/rekab" element={<ProtectedRoute role="CHAUFFEUR"><ListeRekab /></ProtectedRoute>} />
      <Route path="/chauffeur/scanner" element={<ProtectedRoute role="CHAUFFEUR"><QRScannerPage /></ProtectedRoute>} />

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