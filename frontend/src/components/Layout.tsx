import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Stethoscope, Home, Upload, History, Info, MessageSquare, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Medimind AI</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" isActive={isActive('/')} />
              <NavLink to="/upload" icon={<Upload className="h-5 w-5" />} text="Upload" isActive={isActive('/upload')} />
              <NavLink to="/history" icon={<History className="h-5 w-5" />} text="History" isActive={isActive('/history')} />
              <NavLink to="/about" icon={<Info className="h-5 w-5" />} text="About" isActive={isActive('/about')} />
              <NavLink to="/contact" icon={<MessageSquare className="h-5 w-5" />} text="Contact" isActive={isActive('/contact')} />
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
      isActive
        ? 'border-b-2 border-blue-500 text-gray-900'
        : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`}
  >
    {icon}
    <span className="ml-2">{text}</span>
  </Link>
);

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 PneumoDetect. For educational purposes only. Not for medical diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
}