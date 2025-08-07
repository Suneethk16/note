import React, { useState, useEffect } from 'react';

// Main App component
function App() {
  // State to store the list of notes
  const [notes, setNotes] = useState([]);
  // State to store the new note text input
  const [newNote, setNewNote] = useState('');
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);

  // Base URL for the backend API.
  // IMPORTANT:
  // - When running with Docker Compose, 'backend' is the service name defined in docker-compose.yml.
  //   Docker's internal DNS resolves 'backend' to the backend container's IP within the Docker network.
  // - When running locally WITHOUT Docker Compose (e.g., `npm start` for frontend, `uvicorn` for backend),
  //   you would typically use 'http://localhost:8000'.
  // - When deployed to Kubernetes, this would be the Kubernetes Service name for your backend (e.g., 'http://backend-service:8000').
  // - If you are running this React app in a remote preview environment (like Canvas) and your backend
  //   is running on your local machine, 'localhost' will not work. You would need to expose your
  //   local backend to the internet (e.g., with ngrok) or deploy both frontend and backend
  //   to a publicly accessible environment.
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://notes-backend-312n.onrender.com'; // Use environment variable or fallback

  // Function to fetch notes from the backend
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    const url = `${API_BASE_URL}/notes`;
    console.log(`Attempting to fetch notes from: ${url}`); // Added for debugging
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError(`Failed to load notes from ${API_BASE_URL}. Please ensure the backend is running and accessible.`); // More informative error
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch notes when the component mounts
  useEffect(() => {
    fetchNotes();
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle adding a new note
  const handleAddNote = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!newNote.trim()) {
      setError("Note cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    const url = `${API_BASE_URL}/notes?text=${encodeURIComponent(newNote)}`;
    console.log(`Attempting to add note to: ${url}`); // Added for debugging
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // CORS Note: If you encounter CORS errors during local development
          // without Docker Compose, you might need to configure your backend
          // to allow requests from your React app's origin (e.g., http://localhost:3000).
          // For create-react-app, you can also add "proxy": "http://localhost:8000"
          // to your frontend's package.json to proxy API requests.
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedNote = await response.json();
      setNotes([...notes, addedNote]); // Add the new note to the existing list
      setNewNote(''); // Clear the input field
    } catch (err) {
      console.error("Failed to add note:", err);
      setError(`Failed to add note to ${API_BASE_URL}. Please try again.`); // More informative error
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a note
  const handleDeleteNote = async (id) => {
    setLoading(true);
    setError(null);
    const url = `${API_BASE_URL}/notes/${id}`;
    console.log(`Attempting to delete note from: ${url}`); // Added for debugging
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Filter out the deleted note from the list
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError(`Failed to delete note from ${API_BASE_URL}. Please try again.`); // More informative error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          My Notes
        </h1>

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            disabled={loading} // Disable input when loading
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading} // Disable button when loading
          >
            {loading && newNote ? 'Adding...' : 'Add Note'}
          </button>
        </form>

        {/* Loading indicator */}
        {loading && !error && notes.length === 0 && (
          <p className="text-center text-gray-600 text-lg">Loading notes...</p>
        )}

        {/* Notes List */}
        {notes.length === 0 && !loading && !error && (
          <p className="text-center text-gray-600 text-lg">No notes yet. Add one above!</p>
        )}

        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <span className="text-gray-800 text-lg flex-grow mr-4 break-words">
                {note.text}
              </span>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                disabled={loading} // Disable button when loading
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
