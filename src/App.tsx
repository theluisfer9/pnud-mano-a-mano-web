import HomeLayout from "./pages/home/home";
import SingleNews from "./pages/individual-news/news";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewsLayout from "./pages/noticias/noticias";
import Login from "./pages/login/login";
import PrivateRoute from "./components/PrivateRoute/private-route";
import AddNews from "./pages/admin/add-news/add-news";
function App() {
  const isAuthenticated = Boolean(localStorage.getItem("mano-a-mano-token"));
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/noticias" element={<NewsLayout />} />
        <Route path="/noticias/:id" element={<SingleNews />} />
        <Route path="/login" element={<Login />} />
        {/*Protected Routes */}
        <Route
          path="/nueva-noticia"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <AddNews />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
