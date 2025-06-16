import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-[var(--primary)] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">CyberThreatSim</Link>
        {token && (
          <div className="space-x-4">
            <Link to="/simulation" className="text-white hover:text-[var(--secondary)]">Simulation</Link>
            <Link to="/dashboard" className="text-white hover:text-[var(--secondary)]">Dashboard</Link>
            <button onClick={handleLogout} className="text-white hover:text-[var(--secondary)]">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;