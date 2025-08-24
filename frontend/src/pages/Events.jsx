import { useState, useEffect } from "react";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

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

  const registerForEvent = async (eventId) => {
    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        fetchEvents(); // Refresh events list
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error registering for event");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="text-xl">Loading events...</div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">🎉 Upcoming Events</h1>
        {userRole === 'admin' && (
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            + Create Event
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl text-gray-600">No events available</h2>
          <p className="text-gray-500 mt-2">Check back later for exciting events!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {event.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.attendees?.length || 0}/{event.maxAttendees}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">📅 {formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">🕐 {event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">📍 {event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">👤 By {event.createdBy?.name}</span>
                  </div>
                </div>

                {userRole === 'student' && token && (
                  <button 
                    onClick={() => registerForEvent(event._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Register Now
                  </button>
                )}
                
                {!token && (
                  <div className="text-center py-2">
                    <span className="text-gray-500 text-sm">Login to register</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
