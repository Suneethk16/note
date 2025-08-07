import React, { useState } from 'react';

function App() {
  const [userName, setUserName] = useState('');
  const [crushNames, setCrushNames] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://notes-backend-312n.onrender.com';

  const handleCrushNameChange = (index, value) => {
    const newCrushNames = [...crushNames];
    newCrushNames[index] = value;
    setCrushNames(newCrushNames);
  };

  const addMoreCrushField = () => {
    setCrushNames([...crushNames, '']);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError("Please enter your name.");
      return;
    }
    
    const validCrushNames = crushNames.filter(name => name.trim() !== '');
    if (validCrushNames.length === 0) {
      setError("Please enter at least one crush name.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const allResults = [];
      
      for (const crushName of validCrushNames) {
        const response = await fetch(`${API_BASE_URL}/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            boy_name: userName,
            boy_age: 25,
            boy_dob: '1999-01-01',
            girl_name: crushName,
            girl_age: 23,
            girl_dob: '2001-01-01'
          }),
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const prediction = await response.json();
        allResults.push(prediction);
      }
      
      allResults.sort((a, b) => b.prediction_score - a.prediction_score);
      setResults(allResults);
      
    } catch (err) {
      console.error("Failed to predict:", err);
      setError("Failed to predict love compatibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💕 Love Match Finder</h1>
          <p className="text-gray-600">Find your best match!</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg mb-3 text-center">💖 Your Matches</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className={`p-3 rounded-lg ${index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {index === 0 && '👑 '}{result.girl_name}
                    </span>
                    <span className="font-bold text-pink-600">{result.prediction_score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Your Crushes</label>
            <div className="space-y-3">
              {crushNames.map((crushName, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Crush ${index + 1} name`}
                  value={crushName}
                  onChange={(e) => handleCrushNameChange(index, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  disabled={loading}
                />
              ))}
              
              <button
                type="button"
                onClick={addMoreCrushField}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300"
                disabled={loading}
              >
                + Add Another Crush
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? 'Finding Your Match...' : '💕 Find My Best Match'}
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