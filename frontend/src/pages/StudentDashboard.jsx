// src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";

function StudentDashboard() {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Redirect if not student
  if (userRole !== "student") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">❌ Student access required</div>
      </div>
    );
  }

  useEffect(() => {
    fetchRegisteredEvents();
    // eslint-disable-next-line
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const allEvents = await res.json();

      // Get user ID from token
      const userRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        const userId = userData._id;

        // Filter events user is registered for
        const registered = allEvents.filter(
          (event) =>
            event.attendees &&
            event.attendees.some((attendee) => attendee._id === userId || attendee === userId)
        );

        setRegisteredEvents(registered);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setLoading(false);
    }
  };

  const unregisterFromEvent = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/unregister`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchRegisteredEvents(); // Refresh the list
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error unregistering from event");
    }
  };

  // NEW: certificate download with auth header
  const handleDownloadCertificate = async (eventId, title) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/certificate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return alert(data.error || "Could not download certificate");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(title || "certificate").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Download failed");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">📚 My Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your registered events</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          📋 Registered Events ({registeredEvents.length})
        </h2>

        {registeredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl text-gray-600 dark:text-gray-300 mb-2">No events registered yet!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Browse events and start registering for exciting activities.
            </p>
            <a
              href="/events"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {registeredEvents.map((event) => (
              <div
                key={event._id}
                className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {event.title}
                      </h3>
                      <span className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 text-xs font-medium px-2 py-1 rounded">
                        Registered ✅
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium">📅 {formatDate(event.date)}</span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium">🕐 {event.time}</span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium">📍 {event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
                      {event.category}
                    </span>

                    <button
                      onClick={() => unregisterFromEvent(event._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
                    >
                      Unregister
                    </button>

                    {/* NEW: Download Certificate */}
                    <button
                      onClick={() => handleDownloadCertificate(event._id, event.title)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm"
                    >
                      🏆 Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Events</p>
              <p className="text-3xl font-bold">{registeredEvents.length}</p>
            </div>
            <div className="text-4xl text-blue-200">🎫</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Upcoming</p>
              <p className="text-3xl font-bold">
                {registeredEvents.filter((event) => new Date(event.date) > new Date()).length}
              </p>
            </div>
            <div className="text-4xl text-green-200">⏰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Categories</p>
              <p className="text-3xl font-bold">
                {new Set(registeredEvents.map((event) => event.category)).size}
              </p>
            </div>
            <div className="text-4xl text-purple-200">🏷️</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
