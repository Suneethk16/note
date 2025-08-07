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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          💕 Love Predictor 💕
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {result && (
          <div className="bg-pink-100 border border-pink-400 text-pink-700 px-4 py-3 rounded-lg relative mb-4">
            <h3 className="font-bold text-lg">💖 Love Prediction Result 💖</h3>
            <p className="text-xl mt-2">
              {result.boy_name} & {result.girl_name} have a <strong>{result.prediction_score}%</strong> love compatibility!
            </p>
          </div>
        )}

        <form onSubmit={handlePredict} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">👦 Boy Details</h3>
              <input
                type="text"
                name="boy_name"
                placeholder="Boy's Name"
                value={formData.boy_name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              />
              <input
                type="number"
                name="boy_age"
                placeholder="Boy's Age"
                value={formData.boy_age}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              />
              <input
                type="date"
                name="boy_dob"
                value={formData.boy_dob}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-pink-600">👧 Girl Details</h3>
              <input
                type="text"
                name="girl_name"
                placeholder="Girl's Name"
                value={formData.girl_name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                disabled={loading}
              />
              <input
                type="number"
                name="girl_age"
                placeholder="Girl's Age"
                value={formData.girl_age}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                disabled={loading}
              />
              <input
                type="date"
                name="girl_dob"
                value={formData.girl_dob}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400"
            disabled={loading}
          >
            {loading ? 'Predicting...' : '💕 Predict Love 💕'}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">Developed by <strong>Suneeth K</strong></p>
          <p className="text-xs">© 2025 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

export default App;