// components/navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import WalletConnectButton from "./WalletConnectButton";
import { useEffect, useState } from "react";
import { Leaf, Menu, X, LogOut, UserPlus, Zap } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/30 animate-pulse">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
        CarbonCred
      </span>
    </div>
  );

  const NavLink = ({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) => (
    <Link 
      to={to} 
      className={`relative text-gray-300 hover:text-purple-400 transition-all duration-300 text-sm font-medium group ${className}`}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );

  return (
    <nav className={`w-full z-50 transition-all duration-500 ${
      scrollY > 10 
        ? 'bg-slate-950/90 backdrop-blur-2xl border-b border-purple-500/20 shadow-2xl shadow-purple-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/MyEmission">My Emissions</NavLink>
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/emission">Emission</NavLink>
            <NavLink to="/sandbox">Sandbox</NavLink>
            <NavLink to="/admin">Admin</NavLink>
            <NavLink to="/mint">Mint</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/hehe">Hehe</NavLink>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
          <NavLink to="/profile">Profile</NavLink>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="group flex items-center space-x-2 text-red-400 hover:text-red-300 transition-all duration-300 text-sm font-medium"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/authform" 
                className="group flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-all duration-300 text-sm font-medium"
              >
                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Register</span>
              </Link>
            )}
            <div className="relative">
              <WalletConnectButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden relative z-10 p-2 rounded-lg bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 hover:bg-purple-600/30 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-purple-400" />
            ) : (
              <Menu className="w-5 h-5 text-purple-400" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4">
            <div className="bg-slate-950/95 backdrop-blur-2xl rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-500/20 p-6">
              <div className="flex flex-col space-y-4">
                {/* Mobile Navigation Links */}
                <div className="grid grid-cols-2 gap-3">
                  <NavLink to="/" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                    Home
                  </NavLink>
                  <NavLink to="/MyEmission" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                    My Emissions
                  </NavLink>
                  <NavLink to="/marketplace" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                    Marketplace
                  </NavLink>
                  <NavLink to="/emission" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                    Emission
                  </NavLink>
                  <NavLink to="/sandbox" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                    Sandbox
                  </NavLink>
                  <NavLink to="/admin" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                    Admin
                  </NavLink>
                  <NavLink to="/admin69" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                    Mint
                  </NavLink>
                  <NavLink to="/dashboard" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                    Dashboard
                  </NavLink>
                </div>

                <NavLink to="/hehe" className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 text-center">
                  Hehe
                </NavLink>

                {/* Mobile Auth/Wallet Section */}
                <div className="border-t border-purple-500/20 pt-4 space-y-3">
                  {isLoggedIn ? (
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <Link 
                      to="/authform" 
                      className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-indigo-900/30 hover:bg-indigo-800/40 text-gray-300 hover:text-purple-400 transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                    </Link>
                  )}
                  
                  <div className="flex justify-center">
                    <WalletConnectButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animated Background Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 opacity-30"></div>
    </nav>
  );
};

export default Navbar;