import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import HomeLayout from "./pages/home/home";
import SingleNews from "./pages/individual-news/news";
import NewsLayout from "./pages/noticias/noticias";
import Login from "./pages/login/login";
import AddNews from "./pages/admin/add-news/add-news";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LifeStoryPage from "./pages/individual-life-story/lifestory";
import PressReleasePage from "./pages/invividual-press-release/pressrelease";
import Dashboard from "./pages/admin/dashboard/dashboard";
import AddLifeStories from "./pages/admin/add-life-stories/add-life-stories";
import AddPressRelease from "./pages/admin/add-press-release/add-press-release";
import BulletinPage from "./pages/individual-bulletin/individual-bulletin";
import AddBulletin from "./pages/admin/add-bulletin/add-bulletin";
import AdminLayout from "./pages/admin/admin-layout/layout";
const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("mano-a-mano-token");
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("mano-a-mano-token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mano-a-mano-token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("manoAManoLogin", checkAuth);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("manoAManoLogin", checkAuth);
    };
  }, []);

  console.log("isAuthenticated:", isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/noticias" element={<NewsLayout />} />
          <Route path="/noticias/:id" element={<SingleNews />} />
          <Route path="/historias-de-vida/:id" element={<LifeStoryPage />} />
          <Route path="/comunicados/:id" element={<PressReleasePage />} />
          <Route path="/boletines/:id" element={<BulletinPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/nueva-historia-de-vida"
            element={
              isAuthenticated ? <AddLifeStories /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/nuevo-boletin"
            element={
              isAuthenticated ? <AddBulletin /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/nuevo-comunicado-de-prensa"
            element={
              isAuthenticated ? <AddPressRelease /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/nueva-noticia"
            element={isAuthenticated ? <AddNews /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
