import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/Dashboard';
import { FileExplorer } from './components/file-explorer/FileExplorer';
import { UserSettings } from './components/profile/UserSettings';
import SignIn from './components/auth/signin'; // Import du composant SignIn
import SignUp from './components/auth/signup'; // Import du composant SignUp
import AccountActivity from './components/security/account-activity'; // Import du composant AccountActivity
import Vault from './components/security/vault'; // Import du composant Vault
import Authentication from './components/security/authentification'; // Import du composant Authentication
import Devices from './components/security/devices'; // Import du composant Devices

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/files"
            element={
              <Layout>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">My Files</h1>
                  <p className="mt-1 text-muted-foreground">
                    Browse and manage all your files and folders.
                  </p>
                  <FileExplorer currentPath="/files" />
                </div>
              </Layout>
            }
          />
          <Route
            path="/starred"
            element={
              <Layout>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Starred</h1>
                  <p className="mt-1 text-muted-foreground">
                    Your starred files and folders for quick access.
                  </p>
                  <FileExplorer currentPath="/starred" />
                </div>
              </Layout>
            }
          />
          <Route
            path="/recent"
            element={
              <Layout>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Recent</h1>
                  <p className="mt-1 text-muted-foreground">
                    Files and folders you've recently accessed.
                  </p>
                  <FileExplorer currentPath="/recent" />
                </div>
              </Layout>
            }
          />
          <Route
            path="/shared"
            element={
              <Layout>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Shared</h1>
                  <p className="mt-1 text-muted-foreground">
                    Files and folders shared with you or by you.
                  </p>
                  <FileExplorer currentPath="/shared" />
                </div>
              </Layout>
            }
          />
          <Route
            path="/trash"
            element={
              <Layout>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Trash</h1>
                  <p className="mt-1 text-muted-foreground">
                    Deleted files and folders will remain here for 30 days.
                  </p>
                  <FileExplorer currentPath="/trash" />
                </div>
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <UserSettings />
              </Layout>
            }
          />
          {/* Route pour la page de connexion */}
          <Route path="/auth/signin" element={<SignIn />} />
          {/* Nouvelle route pour la page d'inscription */}
          <Route path="/auth/signup" element={<SignUp />} />
          {/* Nouvelle route pour Account Activity */}
          <Route
            path="/security/account-activity"
            element={
              <Layout>
                <AccountActivity />
              </Layout>
            }
          />
          {/* Nouvelle route pour Vault */}
          <Route
            path="/security/vault"
            element={
              <Layout>
                <Vault />
              </Layout>
            }
          />
          {/* Nouvelle route pour Authentication */}
          <Route
            path="/security/authentication"
            element={
              <Layout>
                <Authentication />
              </Layout>
            }
          />

          {/* Nouvelle route pour Devices */}
          <Route
            path="/security/devices"
            element={
              <Layout>
                <Devices />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
