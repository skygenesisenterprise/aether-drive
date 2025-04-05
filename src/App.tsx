import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/Dashboard';
import { FileExplorer } from './components/file-explorer/FileExplorer';
import { UserSettings } from './components/profile/UserSettings';

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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
