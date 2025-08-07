import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState([]);
  const [userName, setUserName] = useState('');
  const [crushNames, setCrushNames] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://notes-backend-312n.onrender.com';

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      console.error("Failed to fetch predictions:", err);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleCrushNameChange = (index, value) => {
    const newCrushNames = [...crushNames];
    newCrushNames[index] = value;
    setCrushNames(newCrushNames);
  };

  const addMoreCrushField = () => {
    setCrushNames([...crushNames, '']);
  };

  const removeCrushField = (index) => {
    if (crushNames.length > 1) {
      const newCrushNames = crushNames.filter((_, i) => i !== index);
      setCrushNames(newCrushNames);
    }
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
            boy_age: 25, // Default age
            boy_dob: '1999-01-01', // Default DOB
            girl_name: crushName,
            girl_age: 23, // Default age
            girl_dob: '2001-01-01' // Default DOB
          }),
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const prediction = await response.json();
        allResults.push(prediction);
      }
      
      // Sort by prediction score (highest first)
      allResults.sort((a, b) => b.prediction_score - a.prediction_score);
      setResults(allResults);
      setPredictions([...predictions, ...allResults]);
      
    } catch (err) {
      console.error("Failed to predict:", err);
      setError("Failed to predict love compatibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-10 left-10 text-pink-300 text-2xl sm:text-4xl float-animation heart-beat">💖</div>
        <div className="absolute top-20 right-20 text-red-300 text-3xl sm:text-5xl float-animation heart-beat" style={{animationDelay: '0.5s'}}>💕</div>
        <div className="absolute bottom-20 left-20 text-purple-300 text-2xl sm:text-4xl float-animation heart-beat" style={{animationDelay: '1s'}}>💝</div>
        <div className="absolute bottom-10 right-10 text-pink-400 text-xl sm:text-3xl float-animation heart-beat" style={{animationDelay: '1.5s'}}>💗</div>
        <div className="absolute top-1/2 left-1/4 text-yellow-300 text-xl sm:text-3xl float-animation" style={{animationDelay: '2s'}}>✨</div>
        <div className="absolute top-1/3 right-1/3 text-pink-200 text-2xl sm:text-4xl float-animation" style={{animationDelay: '2.5s'}}>🌟</div>
      </div>
      
      <div className="glass-effect p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl relative z-10 mx-2">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold neon-text mb-2 sm:mb-4 heart-beat">
            💕 Love Match Finder 💕
          </h1>
          <p className="text-white text-sm sm:text-lg lg:text-xl font-semibold">Find your best love match from your crushes! ✨</p>
        </div>

        {error && (
          <div className="bg-red-500/30 backdrop-blur-sm border-2 border-red-400 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl relative mb-4 sm:mb-6 shadow-lg" role="alert">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl mr-2 sm:mr-3">⚠️</span>
              <div>
                <strong className="font-bold text-sm sm:text-lg">Error!</strong>
                <span className="block text-xs sm:text-base mt-1">{error}</span>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="glass-effect border-2 border-pink-400 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-2xl relative mb-6 sm:mb-8 shadow-2xl pulse-glow">
            <div className="text-center">
              <h3 className="font-bold text-lg sm:text-2xl mb-4 neon-text heart-beat">💖 Your Best Matches 💖</h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className={`p-4 rounded-xl ${index === 0 ? 'bg-yellow-500/30 border-2 border-yellow-400' : 'bg-white/20'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {index === 0 && <span className="text-2xl mr-2">👑</span>}
                        <span className="font-bold text-lg">
                          {userName} 💕 {result.girl_name}
                        </span>
                      </div>
                      <div className="text-2xl font-bold neon-text">
                        {result.prediction_score}%
                      </div>
                    </div>
                    {index === 0 && (
                      <p className="text-yellow-200 text-sm mt-2 font-semibold">🏆 Best Match!</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Your Name - Left Side */}
            <div className="space-y-4 sm:space-y-6 bg-white/20 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-400">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center flex items-center justify-center">
                😊 <span className="ml-2 sm:ml-3">Your Name</span>
              </h3>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Enter Your Name</label>
                <input
                  type="text"
                  placeholder="Your name here..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-3 sm:p-4 border-2 border-blue-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-lg font-medium"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Crush Names - Right Side */}
            <div className="space-y-4 sm:space-y-6 bg-white/20 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-pink-400">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center flex items-center justify-center">
                💕 <span className="ml-2 sm:ml-3">Your Crushes</span>
              </h3>
              
              <div className="space-y-3">
                {crushNames.map((crushName, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label className="block text-white text-xs font-semibold mb-1">Crush #{index + 1}</label>
                      <input
                        type="text"
                        placeholder={`Crush ${index + 1} name...`}
                        value={crushName}
                        onChange={(e) => handleCrushNameChange(index, e.target.value)}
                        className="w-full p-2 sm:p-3 border-2 border-pink-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-500 text-sm font-medium"
                        disabled={loading}
                      />
                    </div>
                    {crushNames.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCrushField(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200"
                        disabled={loading}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addMoreCrushField}
                  className="w-full bg-pink-500/30 hover:bg-pink-500/50 text-white font-semibold py-2 px-4 rounded-lg border-2 border-pink-300 transition-all duration-200"
                  disabled={loading}
                >
                  ➕ Add Another Crush
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full glass-effect border-2 border-pink-400 text-white font-bold py-4 sm:py-6 px-6 sm:px-8 rounded-2xl sm:rounded-3xl shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-pink-300 text-base sm:text-xl pulse-glow neon-text"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white mr-3 sm:mr-4"></div>
                Finding Your Best Match...
              </span>
            ) : '💕 Find My Best Love Match 💕'}
          </button>
        </form>

        <div className="mt-6 sm:mt-10 text-center">
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-purple-400">
            <p className="text-white text-sm sm:text-lg font-bold neon-text">✨ Developed by <span className="text-yellow-300">Suneeth K</span> ✨</p>
            <p className="text-white/80 text-xs sm:text-base mt-1 sm:mt-2">© 2025 All Rights Reserved 💖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;