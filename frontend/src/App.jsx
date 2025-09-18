import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RedirectPage from "./pages/RedirectPage";
import StatsPage from "./pages/StatsPage";
import Home from "./pages/Home";
import NavigationBar from "./components/NavigationBar";


export default function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/:code" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

