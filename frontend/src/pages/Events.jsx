import { useState, useEffect } from "react";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://eventify-9enr.onrender.com/api/events");
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
      const res = await fetch(`https://eventify-9enr.onrender.com/api/events/${eventId}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchEvents(); // Refresh
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error registering for event");
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

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || event.category === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">🎉 Upcoming Events</h1>
        {userRole === "admin" && (
          <a
            href="/create-event"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            + Create Event
          </a>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2 flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2"
        >
          <option value="all">All</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="competition">Competition</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl text-gray-600 dark:text-gray-300">No events found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search/filter.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                    {event.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {event.attendees?.length || 0}/{event.maxAttendees}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">📅 {formatDate(event.date)}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">🕐 {event.time}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">📍 {event.location}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">👤 By {event.createdBy?.name}</span>
                  </div>
                </div>

                {userRole === "student" && token && (
                  <button
                    onClick={() => registerForEvent(event._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Register Now
                  </button>
                )}

                {!token && (
                  <div className="text-center py-2">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Login to register</span>
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
