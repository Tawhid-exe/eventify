import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Events from "./pages/Events.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b px-4 py-4">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex gap-6">
              <Link to="/" className="text-2xl font-bold text-blue-600">🎉 Eventify</Link>
              <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium">Events</Link>
              {token && userRole === 'student' && (
                <Link to="/dashboard" className="text-purple-600 hover:text-purple-800 font-medium">My Dashboard</Link>
              )}
              {token && userRole === 'admin' && (
                <>
                  <Link to="/admin" className="text-red-600 hover:text-red-800 font-medium">Admin Panel</Link>
                  <Link to="/create-event" className="text-green-600 hover:text-green-800 font-medium">+ Create Event</Link>
                </>
              )}
            </div>
            
            <div className="flex gap-4 items-center">
              {!token ? (
                <>
                  <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
                  <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Sign Up</Link>
                </>
              ) : (
                <>
                  <span className="text-gray-600">Welcome, {userRole}!</span>
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
          <Route path="/" element={
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-5xl font-bold text-gray-800 mb-6">🚀 Welcome to Eventify</h1>
              <p className="text-xl text-gray-600 mb-8">Discover and register for amazing events!</p>
              <div className="space-x-4">
                <Link to="/events" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg">
                  Browse Events
                </Link>
                {!token && (
                  <Link to="/signup" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg">
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
