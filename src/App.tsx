import HomeLayout from "./pages/home/home";
import SingleNews from "./pages/individual-news/news";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewsLayout from "./pages/noticias/noticias";
import Login from "./pages/login/login";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/noticias" element={<NewsLayout />} />
        <Route path="/noticias/:id" element={<SingleNews />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
