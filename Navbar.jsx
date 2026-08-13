import { Link, useNavigate } from "react-router-dom";
import { ScanLine, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-tight">
          <ScanLine className="w-5 h-5 text-signal" strokeWidth={2.5} />
          Check Way AI
        </Link>

        {user ? (
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/dashboard" className="hover:text-signal transition-colors">Dashboard</Link>
            <Link to="/upload" className="hover:text-signal transition-colors">Upload</Link>
            <Link to="/matcher" className="hover:text-signal transition-colors">Job Matcher</Link>
            <span className="text-line">|</span>
            <span className="text-muted">{user.name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-1 text-muted hover:text-clay transition-colors focus-ring rounded"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/login" className="hover:text-signal transition-colors">Sign in</Link>
            <Link
              to="/register"
              className="bg-ink text-paper px-4 py-2 rounded-full hover:bg-signal transition-colors"
            >
              Get started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
