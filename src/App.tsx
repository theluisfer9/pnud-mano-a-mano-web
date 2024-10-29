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
import { NewsProvider } from "./context/newscontext";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("mano-a-mano-token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("manoAManoLogin", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("manoAManoLogin", checkAuth);
    };
  }, []);

  return (
    <NewsProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/noticias" element={<NewsLayout />} />
          <Route path="/noticias/:id" element={<SingleNews />} />
          <Route path="/login" element={<Login />} />
          {/*Protected Routes */}
          <Route
            path="/nueva-noticia"
            element={isAuthenticated ? <AddNews /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </NewsProvider>
  );
}

export default App;
