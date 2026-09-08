import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Component/ProtectedRoute";
import { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./Pages/Dashboard";
import { Spinner } from "@fluentui/react-components";
const Home = lazy(() => import("./Pages/Home"));
const ProjectPage = lazy(() => import("./Pages/ProjectPage"));
const TaskPage = lazy(() => import("./Pages/Task"));
const LoginPage = lazy(() => import("./Component/LoginPage"));
const DashboardPage = lazy(() => import("./Pages/Dashboard"))
const NavSidebarPage = lazy(() => import("./Component/Home/NavSidebar"))
const ProfilePage = lazy(() => import("./Component/Profile/ProfilePage"))



const queryclient = new QueryClient();

function App() {
  return (
    <div className="bg-gray-100 h-full w-full">
      <Provider store={store}>
        <BrowserRouter>
          <QueryClientProvider client={queryclient}>
            <Suspense fallback={<div className="flex items-center justify-center text-4xl mt-10 bg-white"> <Spinner appearance="primary" label="Loading..." /></div>}>
              <Routes>
                <Route
                  path="/"
                  element={<LoginPage />}
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <NavSidebarPage />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    path="/dashboard"
                    element={<Dashboard/>}
                  />
                  <Route
                    path="/ProjectPage"
                    element={<ProjectPage />}
                  />
                  <Route
                    path="/TaskPage"
                    element={<TaskPage />}
                  />
                  <Route
                  path="/Profile" 
                  element={<ProfilePage/>}
                  />
                  <Route
                    path="/home/:projectId"
                    element={<Home />}
                  />

                </Route>

              </Routes>
            </Suspense>
          </QueryClientProvider>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;