// src/App.tsx
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ArticlePage from "./pages/ArticlePage";
import ResearchPaperPage from "./pages/ResearchPaperPage";
import BookPage from "./pages/BookPage";
import DetailPage from "./pages/DetailPage";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/articles" element={<ArticlePage />} />
          <Route path="/research-papers" element={<ResearchPaperPage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/item/:type/:id" element={<DetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
