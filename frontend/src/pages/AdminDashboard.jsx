import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAttendees, setShowAttendees] = useState(false);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  // Redirect if not admin
  if (userRole !== 'admin') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">❌ Admin access required</div>
      </div>
    );
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Event deleted successfully!");
        fetchEvents();
      } else {
        alert("Error deleting event");
      }
    } catch (err) {
      alert("Error deleting event");
    }
  };

  const viewAttendees = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
      const data = await res.json();
      setSelectedEvent(data);
      setShowAttendees(true);
    } catch (err) {
      alert("Error fetching attendees");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    });
  };

  const totalAttendees = events.reduce((sum, event) => sum + (event.attendees?.length || 0), 0);
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="text-xl">Loading dashboard...</div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">⚡ Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your events and track registrations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Events</p>
              <p className="text-3xl font-bold">{events.length}</p>
            </div>
            <div className="text-4xl text-blue-200">🎯</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Attendees</p>
              <p className="text-3xl font-bold">{totalAttendees}</p>
            </div>
            <div className="text-4xl text-green-200">👥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Upcoming</p>
              <p className="text-3xl font-bold">{upcomingEvents.length}</p>
            </div>
            <div className="text-4xl text-orange-200">📅</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Categories</p>
              <p className="text-3xl font-bold">
                {new Set(events.map(event => event.category)).size}
              </p>
            </div>
            <div className="text-4xl text-purple-200">🏷️</div>
          </div>
        </div>
      </div>

      {/* Events Management Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Event Management</h2>
          <button
            onClick={() => navigate('/create-event')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            + New Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl text-gray-600 mb-4">No events created yet!</h3>
            <button
              onClick={() => navigate('/create-event')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {event.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {event.attendees?.length || 0}/{event.maxAttendees}
                        </span>
                        <button
                          onClick={() => viewAttendees(event._id)}
                          className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewAttendees(event._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          👥 Attendees
                        </button>
                        <button
                          onClick={() => deleteEvent(event._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendees Modal */}
      {showAttendees && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                👥 Attendees for "{selectedEvent.title}"
              </h3>
              
              {selectedEvent.attendees?.length === 0 ? (
                <p className="text-gray-500">No attendees yet.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedEvent.attendees?.map((attendee, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {(attendee.name || attendee.email || 'U')[0].toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {attendee.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attendee.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={() => setShowAttendees(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
