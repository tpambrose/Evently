import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

// Define an Event interface to represent the structure of an event
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string; // Consider changing to Date if needed
  availableSeats: number;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [availableSeats, setAvailableSeats] = useState<number>(0);
  const [editingEventId, setEditingEventId] = useState<string | null>(null); // State to hold the ID of the event being edited

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // blueirect to login if no token
    } else {
      try {
        const decoded: { exp: number } = jwtDecode(token); // Decode the token
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decoded.exp < currentTime) {
          router.push("/login"); // blueirect if token is expiblue
        } else {
          fetchEvents(); // Fetch events if token is valid
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        router.push("/"); // blueirect on error
      }
    }
  }, [router]);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data: Event[] = await res.json(); // Specify the type of data fetched
    setEvents(data);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, date, availableSeats }),
    });
    fetchEvents();
    resetForm(); // Reset form after adding
  };

  const handleEditEvent = async (eventId: string) => {
    // Find the event to edit
    const eventToEdit = events.find((event) => event._id === eventId);
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      setDate(eventToEdit.date);
      setAvailableSeats(eventToEdit.availableSeats);
      setEditingEventId(eventId); // Set the editing event ID
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`/api/events/${editingEventId}`, {
      method: "PUT", // Use PUT method to update
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, date, availableSeats }),
    });
    fetchEvents();
    resetForm(); // Reset form after updating
  };

  const handleDeleteEvent = async (eventId: string) => {
    await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });
    fetchEvents();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setAvailableSeats(0);
    setEditingEventId(null); // Reset the editing state
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-400 flex items-center justify-center p-6">
      <div className="container max-w-4xl mx-auto bg-white rounded-md shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Admin Dashboard
        </h1>

        <form
          onSubmit={editingEventId ? handleUpdateEvent : handleAddEvent}
          className="space-y-4 mb-8"
        >
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Available Seats</label>
            <input
              type="number"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(Number(e.target.value))}
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-800 text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition"
          >
            {editingEventId ? "Update Event" : "Add Event"}
          </button>
          {editingEventId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          )}
        </form>

        <h2 className="text-xl font-bold mb-4">Existing Events</h2>
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="border border-gray-300 rounded p-4">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Seats Available: {event.availableSeats}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditEvent(event._id)}
                  className="bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-700 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={logout}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-700 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
