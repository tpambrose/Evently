import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

// Define an Event interface to represent the structure of an event
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  availableSeats: number;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [availableSeats, setAvailableSeats] = useState<number>(0);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          router.push("/login");
        } else {
          fetchEvents();
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        router.push("/");
      }
    }
  }, [router]);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data: Event[] = await res.json();
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
    resetForm();
  };

  const handleEditEvent = async (eventId: string) => {
    const eventToEdit = events.find((event) => event._id === eventId);
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      setDate(eventToEdit.date);
      setAvailableSeats(eventToEdit.availableSeats);
      setEditingEventId(eventId);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`/api/events/${editingEventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, date, availableSeats }),
    });
    fetchEvents();
    resetForm();
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
    setEditingEventId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="container max-w-4xl mx-auto bg-white rounded-md shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">
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
            className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition"
          >
            {editingEventId ? "Update Event" : "Add Event"}
          </button>
          {editingEventId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded ml-2 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </form>

        <h2 className="text-xl font-bold mb-4">Existing Events</h2>
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="border border-gray-300 rounded p-4 shadow-md">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Seats Available: {event.availableSeats}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditEvent(event._id)}
                  className="bg-orange-500 text-white font-bold py-1 px-3 rounded hover:bg-orange-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="bg-orange-500 text-white font-bold py-1 px-3 rounded hover:bg-orange-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={logout}
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-orange-600 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
