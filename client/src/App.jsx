import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ForcePasswordChange from './components/layout/ForcePasswordChange';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PatientListPage from './pages/patients/PatientListPage';
import PatientCreatePage from './pages/patients/PatientCreatePage';
import PatientDetailPage from './pages/patients/PatientDetailPage';
import EvaluationListPage from './pages/evaluations/EvaluationListPage';
import EvaluationFormPage from './pages/evaluations/EvaluationFormPage';
import ReportListPage from './pages/reports/ReportListPage';
import ReportPreviewPage from './pages/reports/ReportPreviewPage';
import UserManagementPage from './pages/admin/UserManagementPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

              {/* Force password change */}
              <Route
                path="/cambiar-contrasena"
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected — with force password change guard */}
              <Route
                element={
                  <ProtectedRoute>
                    <ForcePasswordChange>
                      <AppLayout />
                    </ForcePasswordChange>
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/pacientes" element={<PatientListPage />} />
                <Route path="/pacientes/nuevo" element={<PatientCreatePage />} />
                <Route path="/pacientes/:id" element={<PatientDetailPage />} />
                <Route
                  path="/evaluaciones"
                  element={
                    <ProtectedRoute allowedRoles={['doctor', 'assistant']}>
                      <EvaluationListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/evaluaciones/:id"
                  element={
                    <ProtectedRoute allowedRoles={['doctor', 'assistant']}>
                      <EvaluationFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/informes"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <ReportListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/informes/:id"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <ReportPreviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <UserManagementPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
