import React, { useState } from 'react';

function App() {
  const [person1Name, setPerson1Name] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://notes-backend-312n.onrender.com';

  // List of seating positions
  const seatingPositions = [
    "69",
    "Doggy Style",
    "Missionary",
    "Face-Off",
    "Stand and Deliver",
    "Pearly Gates",
    "The Socket",
    "happy Baby",
  ];

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!person1Name.trim() || !person2Name.trim()) {
      setError("Please enter both names.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boy_name: person1Name,
          boy_age: 25,
          boy_dob: '1999-01-01',
          girl_name: person2Name,
          girl_age: 23,
          girl_dob: '2001-01-01'
        }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const prediction = await response.json();
      
      // Use prediction score to select seating position
      const positionIndex = prediction.prediction_score % seatingPositions.length;
      const selectedPosition = seatingPositions[positionIndex];
      
      setResult({
        ...prediction,
        seating_position: selectedPosition
      });
      
    } catch (err) {
      console.error("Failed to predict:", err);
      setError("Failed to predict sex position. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Best Sex Position Predictor</h1>
          <p className="text-gray-600">Find the best Sex Position!</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
            <h3 className="font-bold text-xl mb-4 text-blue-800">🎯 Perfect Sex Position</h3>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {result.boy_name} & {result.girl_name}
              </p>
              <div className="bg-red-500 text-white text-2xl font-bold mb-2 px-4 py-3 rounded-lg border-2 border-red-600 shadow-lg">
                {result.seating_position}
              </div>
              <p className="text-sm text-gray-600">
                Compatibility Score: {result.prediction_score}%
              </p>
            </div>
            <p className="text-sm text-blue-700">
              This sex arrangement will create the perfect atmosphere for you both! 🌟
            </p>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Partner 1</label>
            <input
              type="text"
              placeholder="Enter partner 1's name"
              value={person1Name}
              onChange={(e) => setPerson1Name(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Partner 2</label>
            <input
              type="text"
              placeholder="Enter partner 2's name"
              value={person2Name}
              onChange={(e) => setPerson2Name(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? 'Finding Best Sex...' : 'Find Best Sex Position'}
          </button>
        </form>



        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Developed by <strong>Suneeth K</strong></p>
          <p>© 2025 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

export default App;