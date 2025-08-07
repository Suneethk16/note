import React, { useState, useEffect } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-300 text-2xl animate-bounce">💖</div>
        <div className="absolute top-20 right-20 text-red-300 text-3xl animate-pulse">💕</div>
        <div className="absolute bottom-20 left-20 text-purple-300 text-2xl animate-bounce">💝</div>
        <div className="absolute bottom-10 right-10 text-pink-400 text-xl animate-pulse">💗</div>
        <div className="absolute top-1/2 left-1/4 text-yellow-300 text-lg animate-bounce">✨</div>
        <div className="absolute top-1/3 right-1/3 text-pink-200 text-2xl animate-pulse">🌟</div>
      </div>
      
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-pink-200 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-2">
            💕 Love Predictor 💕
          </h1>
          <p className="text-gray-600 text-lg font-medium">Discover your love compatibility! ✨</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg relative mb-4 shadow-md" role="alert">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <div>
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-l-4 border-pink-500 text-pink-800 px-6 py-4 rounded-lg relative mb-6 shadow-lg">
            <div className="text-center">
              <h3 className="font-bold text-xl mb-2">💖 Love Prediction Result 💖</h3>
              <div className="bg-white/80 rounded-full p-4 inline-block mb-2">
                <span className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text">
                  {result.prediction_score}%
                </span>
              </div>
              <p className="text-lg font-medium">
                <span className="text-blue-600 font-bold">{result.boy_name}</span> & <span className="text-pink-600 font-bold">{result.girl_name}</span> have amazing love compatibility!
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200">
              <h3 className="text-xl font-bold text-blue-700 text-center flex items-center justify-center">
                👦 <span className="ml-2">Boy Details</span>
              </h3>
              <input
                type="text"
                name="boy_name"
                placeholder="Boy's Name"
                value={formData.boy_name}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white/80"
                disabled={loading}
              />
              <input
                type="number"
                name="boy_age"
                placeholder="Boy's Age"
                value={formData.boy_age}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white/80"
                disabled={loading}
              />
              <input
                type="date"
                name="boy_dob"
                value={formData.boy_dob}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 bg-white/80"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-4 bg-gradient-to-br from-pink-50 to-rose-100 p-6 rounded-2xl border border-pink-200">
              <h3 className="text-xl font-bold text-pink-700 text-center flex items-center justify-center">
                👧 <span className="ml-2">Girl Details</span>
              </h3>
              <input
                type="text"
                name="girl_name"
                placeholder="Girl's Name"
                value={formData.girl_name}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/80"
                disabled={loading}
              />
              <input
                type="number"
                name="girl_age"
                placeholder="Girl's Age"
                value={formData.girl_age}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/80"
                disabled={loading}
              />
              <input
                type="date"
                name="girl_dob"
                value={formData.girl_dob}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 bg-white/80"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 hover:from-pink-600 hover:via-purple-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Predicting Love...
              </span>
            ) : '💕 Predict Love Compatibility 💕'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-4 border border-gray-300">
            <p className="text-gray-700 font-semibold">✨ Developed by <span className="text-purple-600 font-bold">Suneeth K</span> ✨</p>
            <p className="text-gray-600 text-sm mt-1">© 2025 All Rights Reserved 💖</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;