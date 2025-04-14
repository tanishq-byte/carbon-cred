import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import EmissionForm from "./pages/EmissionForm";
import Sandbox from "./pages/Sandbox";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/authform" element={<AuthForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/emission" element={<EmissionForm />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
