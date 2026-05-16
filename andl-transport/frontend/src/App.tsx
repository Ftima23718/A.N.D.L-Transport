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
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          {isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/etudiant/dashboard" />}
        </ProtectedRoute>
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
