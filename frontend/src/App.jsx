import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  return (
    <Router>
      <div className="p-4 bg-gray-200">
        <nav className="flex gap-4 mb-4">
          <Link to="/signup" className="text-blue-600">Signup</Link>
          <Link to="/login" className="text-blue-600">Login</Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1 className="text-xl">🚀 Eventify Frontend is Live</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
