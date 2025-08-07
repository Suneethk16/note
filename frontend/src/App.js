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
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-300 text-4xl float-animation heart-beat">💖</div>
        <div className="absolute top-20 right-20 text-red-300 text-5xl float-animation heart-beat" style={{animationDelay: '0.5s'}}>💕</div>
        <div className="absolute bottom-20 left-20 text-purple-300 text-4xl float-animation heart-beat" style={{animationDelay: '1s'}}>💝</div>
        <div className="absolute bottom-10 right-10 text-pink-400 text-3xl float-animation heart-beat" style={{animationDelay: '1.5s'}}>💗</div>
        <div className="absolute top-1/2 left-1/4 text-yellow-300 text-3xl float-animation" style={{animationDelay: '2s'}}>✨</div>
        <div className="absolute top-1/3 right-1/3 text-pink-200 text-4xl float-animation" style={{animationDelay: '2.5s'}}>🌟</div>
        <div className="absolute top-3/4 left-1/2 text-purple-200 text-2xl float-animation" style={{animationDelay: '3s'}}>💫</div>
      </div>
      
      <div className="glass-effect p-10 rounded-3xl shadow-2xl w-full max-w-4xl relative z-10 sparkle">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold neon-text mb-4 heart-beat">
            💕 Love Predictor 💕
          </h1>
          <p className="text-white text-xl font-semibold">Discover your magical love compatibility! ✨</p>
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-400 text-white px-6 py-4 rounded-2xl relative mb-6 shadow-lg pulse-glow" role="alert">
            <div className="flex items-center">
              <span className="text-2xl mr-3 heart-beat">⚠️</span>
              <div>
                <strong className="font-bold text-lg">Error!</strong>
                <span className="block text-base mt-1">{error}</span>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="glass-effect border-2 border-pink-400 text-white px-8 py-6 rounded-2xl relative mb-8 shadow-2xl pulse-glow">
            <div className="text-center">
              <h3 className="font-bold text-2xl mb-4 neon-text heart-beat">💖 Love Prediction Result 💖</h3>
              <div className="bg-white/30 backdrop-blur-sm rounded-full p-6 inline-block mb-4 pulse-glow">
                <span className="text-5xl font-bold text-white neon-text">
                  {result.prediction_score}%
                </span>
              </div>
              <p className="text-xl font-bold">
                <span className="text-blue-300 neon-text">{result.boy_name}</span> 
                <span className="text-pink-300 mx-3">💕</span> 
                <span className="text-pink-300 neon-text">{result.girl_name}</span>
              </p>
              <p className="text-lg mt-2 text-white/90">have amazing love compatibility!</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 glass-effect p-8 rounded-3xl border-2 border-blue-400 sparkle">
              <h3 className="text-2xl font-bold text-white text-center flex items-center justify-center neon-text">
                👦 <span className="ml-3">Boy Details</span>
              </h3>
              <input
                type="text"
                name="boy_name"
                placeholder="Boy's Name"
                value={formData.boy_name}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 text-lg font-semibold"
                disabled={loading}
              />
              <input
                type="number"
                name="boy_age"
                placeholder="Boy's Age"
                value={formData.boy_age}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 text-lg font-semibold"
                disabled={loading}
              />
              <input
                type="date"
                name="boy_dob"
                value={formData.boy_dob}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 text-lg font-semibold"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-6 glass-effect p-8 rounded-3xl border-2 border-pink-400 sparkle">
              <h3 className="text-2xl font-bold text-white text-center flex items-center justify-center neon-text">
                👧 <span className="ml-3">Girl Details</span>
              </h3>
              <input
                type="text"
                name="girl_name"
                placeholder="Girl's Name"
                value={formData.girl_name}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-500 transition-all duration-300 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 text-lg font-semibold"
                disabled={loading}
              />
              <input
                type="number"
                name="girl_age"
                placeholder="Girl's Age"
                value={formData.girl_age}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-500 transition-all duration-300 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 text-lg font-semibold"
                disabled={loading}
              />
              <input
                type="date"
                name="girl_dob"
                value={formData.girl_dob}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-500 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 text-lg font-semibold"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full glass-effect border-2 border-pink-400 text-white font-bold py-6 px-8 rounded-3xl shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 text-xl pulse-glow sparkle neon-text"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-4"></div>
                Predicting Love Magic...
              </span>
            ) : '💕 Predict Love Compatibility 💕'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <div className="glass-effect rounded-3xl p-6 border-2 border-purple-400 sparkle">
            <p className="text-white text-lg font-bold neon-text">✨ Developed by <span className="text-yellow-300">Suneeth K</span> ✨</p>
            <p className="text-white/80 text-base mt-2">© 2025 All Rights Reserved 💖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;