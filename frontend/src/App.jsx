import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Events from "./pages/Events.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Chatbot from "./components/Chatbot.jsx";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme-dark");
    if (saved === "true") setDark(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("theme-dark", dark ? "true" : "false");
  }, [dark]);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className={dark ? "dark" : ""}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
          <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
              <div className="flex gap-6 items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  🎉 Eventify
                </Link>
                <Link to="/events" className="text-blue-600 dark:text-blue-300 hover:underline font-medium">
                  Events
                </Link>
                {token && userRole === "student" && (
                  <Link to="/dashboard" className="text-purple-600 dark:text-purple-300 hover:underline font-medium">
                    My Dashboard
                  </Link>
                )}
                {token && userRole === "admin" && (
                  <>
                    <Link to="/admin" className="text-red-600 dark:text-red-300 hover:underline font-medium">
                      Admin Panel
                    </Link>
                    <Link to="/create-event" className="text-green-600 dark:text-green-300 hover:underline font-medium">
                      + Create Event
                    </Link>
                  </>
                )}
              </div>

              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setDark(!dark)}
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
                  title="Toggle dark mode"
                >
                  {dark ? "☀️ Light" : "🌙 Dark"}
                </button>

                {!token ? (
                  <>
                    <Link to="/login" className="text-blue-600 dark:text-blue-300 hover:underline">
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-gray-600 dark:text-gray-300">Welcome, {userRole}!</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<Events />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/"
              element={
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
                    🚀 Welcome to Eventify
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Discover and register for amazing events!
                  </p>
                  <div className="space-x-4">
                    <Link
                      to="/events"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg"
                    >
                      Browse Events
                    </Link>
                    {!token && (
                      <Link
                        to="/signup"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg"
                      >
                        Get Started
                      </Link>
                    )}
                  </div>
                </div>
              }
            />
          </Routes>

          {/* Floating helper bot */}
          <Chatbot />
        </div>
      </Router>
    </div>
  );
}

export default App;
