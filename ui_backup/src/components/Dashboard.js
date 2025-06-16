import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load dashboard');
      }
    };
    fetchData();
  }, []);

  const handleReport = async () => {
    try {
      const response = await axios.get('http://localhost:8000/report', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const blob = new Blob([response.data.html_content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.html';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to download report');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <div>
          <p>Total Simulations: {data.total_simulations}</p>
          <p>Successful Simulations: {data.successful_simulations}</p>
          <p>Failed Simulations: {data.failed_simulations}</p>
          <h2 className="text-xl font-bold mt-4">Logs</h2>
          <ul>
            {data.logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
          <button
            onClick={handleReport}
            className="bg-[var(--primary)] text-white p-2 rounded mt-4"
          >
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;