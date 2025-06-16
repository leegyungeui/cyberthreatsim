import { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

function Simulation() {
  const [threatType, setThreatType] = useState('ddos');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSimulate = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/simulate',
        { threat_type: DOMPurify.sanitize(threatType) },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setResult(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Simulation failed');
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Threat Simulation</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <select
          value={threatType}
          onChange={(e) => setThreatType(e.target.value)}
          className="border p-2"
        >
          <option value="ddos">DDoS</option>
          <option value="phishing">Phishing</option>
          <option value="sql_injection">SQL Injection</option>
        </select>
      </div>
      <button
        onClick={handleSimulate}
        className="bg-[var(--primary)] text-white p-2 rounded"
      >
        Run Simulation
      </button>
      {result && (
        <div className="mt-4">
          <p>Threat Type: {result.threat_type}</p>
          <p>Success: {result.success ? 'Yes' : 'No'}</p>
          <p>Score: {result.score}</p>
          <p>Log: {result.log}</p>
        </div>
      )}
    </div>
  );
}

export default Simulation;