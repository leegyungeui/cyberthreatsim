import { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username: DOMPurify.sanitize(username),
        password: DOMPurify.sanitize(password)
      });
      setQrCode(response.data.qr_code);
      setIsRegistering(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  const handleVerify2FA = async () => {
    try {
      await axios.post('http://localhost:8000/verify-2fa', {
        username: DOMPurify.sanitize(username),
        code: DOMPurify.sanitize(code)
      });
      setIsRegistering(false);
      handleLogin();
    } catch (err) {
      setError(err.response?.data?.detail || '2FA verification failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/token', {
        username: DOMPurify.sanitize(username),
        password: DOMPurify.sanitize(password),
        code: DOMPurify.sanitize(code)
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{isRegistering ? 'Register' : 'Login'}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      {isRegistering && qrCode && (
        <div className="mb-4">
          <p>Scan this QR code with an authenticator app:</p>
          <img src={qrCode} alt="2FA QR Code" />
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="2FA Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      {isRegistering ? (
        <button
          onClick={handleVerify2FA}
          className="bg-[var(--primary)] text-white p-2 rounded"
        >
          Verify 2FA
        </button>
      ) : (
        <>
          <button
            onClick={handleLogin}
            className="bg-[var(--primary)] text-white p-2 rounded mr-2"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="bg-[var(--secondary)] text-white p-2 rounded"
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}

export default Login;