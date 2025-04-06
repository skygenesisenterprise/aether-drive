import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import { Layout as DashboardLayout } from './components/dashboard/layout/Layout';
import SiteLayout from './components/site/layout/Layout';

// Dashboard (Application principale)
import { Dashboard } from './components/dashboard/Dashboard';
import { FileExplorer } from './components/dashboard/file-explorer/FileExplorer';
import { UserSettings } from './components/dashboard/profile/UserSettings';
import AccountActivity from './components/dashboard/security/account-activity';
import Vault from './components/dashboard/security/vault';
import Authentication from './components/dashboard/security/authentification';
import Devices from './components/dashboard/security/devices';

// Authentication
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

// Site vitrine (DMZ)
import Hero from './components/site/sections/Hero';
import Features from './components/site/sections/Features';
import Pricing from './components/site/sections/Pricing';
import CTA from './components/site/sections/CTA';

export default function App() {
  return (
    <Router>
        <Routes>
          {/* Routes pour le site vitrine (DMZ) */}
          <Route
            path="/"
            element={
              <SiteLayout>
                <Hero />
                <Features />
                <Pricing />
                <CTA />
              </SiteLayout>
            }
          />

          {/* Routes pour l'application principale (zone protégée) */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/files"
            element={
              <DashboardLayout>
                <FileExplorer currentPath="dashboard/files" />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <DashboardLayout>
                <UserSettings />
              </DashboardLayout>
            }
          />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route
            path="/dashboard/security/account-activity"
            element={
              <DashboardLayout>
                <AccountActivity />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/security/vault"
            element={
              <DashboardLayout>
                <Vault />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/security/authentication"
            element={
              <DashboardLayout>
                <Authentication />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/security/devices"
            element={
              <DashboardLayout>
                <Devices />
              </DashboardLayout>
            }
          />
        </Routes>
    </Router>
  );
}
