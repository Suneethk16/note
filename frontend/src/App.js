import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState([]);
  const [formData, setFormData] = useState({
    boy_name: '',
    boy_age: '',
    boy_dob: '',
    girl_name: '',
    girl_age: '',
    girl_dob: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!formData.boy_name || !formData.girl_name || !formData.boy_age || !formData.girl_age || !formData.boy_dob || !formData.girl_dob) {
      setError("All fields are required.");
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
          ...formData,
          boy_age: parseInt(formData.boy_age),
          girl_age: parseInt(formData.girl_age)
        }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const prediction = await response.json();
      setResult(prediction);
      setPredictions([...predictions, prediction]);
      setFormData({
        boy_name: '',
        boy_age: '',
        boy_dob: '',
        girl_name: '',
        girl_age: '',
        girl_dob: ''
      });
    } catch (err) {
      console.error("Failed to predict:", err);
      setError("Failed to predict love compatibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated Background Elements - Hidden on mobile for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-10 left-10 text-pink-300 text-2xl sm:text-4xl float-animation heart-beat">💖</div>
        <div className="absolute top-20 right-20 text-red-300 text-3xl sm:text-5xl float-animation heart-beat" style={{animationDelay: '0.5s'}}>💕</div>
        <div className="absolute bottom-20 left-20 text-purple-300 text-2xl sm:text-4xl float-animation heart-beat" style={{animationDelay: '1s'}}>💝</div>
        <div className="absolute bottom-10 right-10 text-pink-400 text-xl sm:text-3xl float-animation heart-beat" style={{animationDelay: '1.5s'}}>💗</div>
        <div className="absolute top-1/2 left-1/4 text-yellow-300 text-xl sm:text-3xl float-animation" style={{animationDelay: '2s'}}>✨</div>
        <div className="absolute top-1/3 right-1/3 text-pink-200 text-2xl sm:text-4xl float-animation" style={{animationDelay: '2.5s'}}>🌟</div>
      </div>
      
      <div className="glass-effect p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl relative z-10 mx-2">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold neon-text mb-2 sm:mb-4 heart-beat">
            💕 Love Predictor 💕
          </h1>
          <p className="text-white text-sm sm:text-lg lg:text-xl font-semibold">Discover your magical love compatibility! ✨</p>
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

        {result && (
          <div className="glass-effect border-2 border-pink-400 text-white px-4 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-2xl relative mb-6 sm:mb-8 shadow-2xl pulse-glow">
            <div className="text-center">
              <h3 className="font-bold text-lg sm:text-2xl mb-3 sm:mb-4 neon-text heart-beat">💖 Love Prediction Result 💖</h3>
              <div className="bg-white/30 backdrop-blur-sm rounded-full p-4 sm:p-6 inline-block mb-3 sm:mb-4 pulse-glow">
                <span className="text-3xl sm:text-5xl font-bold text-white neon-text">
                  {result.prediction_score}%
                </span>
              </div>
              <p className="text-base sm:text-xl font-bold">
                <span className="text-blue-300 neon-text">{result.boy_name}</span> 
                <span className="text-pink-300 mx-2 sm:mx-3">💕</span> 
                <span className="text-pink-300 neon-text">{result.girl_name}</span>
              </p>
              <p className="text-sm sm:text-lg mt-2 text-white/90">have amazing love compatibility!</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Boy Details */}
            <div className="space-y-4 sm:space-y-6 bg-white/20 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-400">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center flex items-center justify-center">
                👦 <span className="ml-2 sm:ml-3">Boy Details</span>
              </h3>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="boy_name"
                  placeholder="Enter boy's name"
                  value={formData.boy_name}
                  onChange={handleInputChange}
                  className="w-full p-3 sm:p-4 border-2 border-blue-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-lg font-medium"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Age</label>
                <input
                  type="number"
                  name="boy_age"
                  placeholder="Enter age"
                  min="1"
                  max="100"
                  value={formData.boy_age}
                  onChange={handleInputChange}
                  className="w-full p-3 sm:p-4 border-2 border-blue-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-lg font-medium"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="boy_dob"
                  value={formData.boy_dob}
                  onChange={handleInputChange}
                  className="w-full p-3 sm:p-4 border-2 border-blue-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 bg-white text-gray-800 text-sm sm:text-lg font-medium"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Girl Details */}
            <div className="space-y-4 sm:space-y-6 bg-white/20 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-pink-400">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center flex items-center justify-center">
                👧 <span className="ml-2 sm:ml-3">Girl Details</span>
              </h3>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="girl_name"
                  placeholder="Enter girl's name"
                  value={formData.girl_name}
                  onChange={handleInputChange}
                  className="w-full p-3 sm:p-4 border-2 border-pink-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-pink-400 focus:border-pink-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-lg font-medium"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Age</label>
                <input
                  type="number"
                  name="girl_age"
                  placeholder="Enter age"
                  min="1"
                  max="100"
                  value={formData.girl_age}
                  onChange={handleInputChange}
                  className="w-full p-3 sm:p-4 border-2 border-pink-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-pink-400 focus:border-pink-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-500 text-sm sm:text-lg font-medium"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="girl_dob"
                  value={formData.girl_dob}
                  onChange={handleInputChange}
                  className="w-full p-3 sm:p-4 border-2 border-pink-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-pink-400 focus:border-pink-500 transition-all duration-300 bg-white text-gray-800 text-sm sm:text-lg font-medium"
                  disabled={loading}
                />
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
                Predicting Love Magic...
              </span>
            ) : '💕 Predict Love Compatibility 💕'}
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