// src/App.tsx
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./views/components/Navbar";
import Home from "./views/pages/Home";
import Login from "./views/pages/Login";
import Signup from "./views/pages/Signup";
import Dashboard from "./views/pages/Dashboard";
import Profile from "./views/components/Profile";
import PrivateRoute from "./views/components/PrivateRoute";
import ArticlePage from "./views/pages/ArticlePage";
import ResearchPaperPage from "./views/pages/ResearchPaperPage";
import BookPage from "./views/pages/BookPage";
import DetailPage from "./views/pages/DetailPage";

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
