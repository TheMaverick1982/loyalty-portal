import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, LayoutDashboard, Users, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://d1w7312wesee68.cloudfront.net/JKPqHUL7GdKSyi-G6LR9EhlfohDfs3qh65AEqsiceP4/ext:webp/quality:85/preset:xxl/plain/s3://toast-sites-resources-prod/restaurantImages/c5d6157e-2088-4c91-8e49-f281d8b5d3b9/c7eea070-b357-474e-8905-fd3199ca6ce6-0" 
              alt="Logo" 
              className="h-8 object-contain"
            />
          </Link>

          {user.status === 'approved' && (
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Loyalty Lookup
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-medium leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile nav indicator */}
      {user.status === 'approved' && (
        <div className="md:hidden flex border-t border-border overflow-x-auto">
          <Link 
            to="/" 
            className="flex-1 py-3 text-sm font-medium text-center text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary transition-all flex justify-center items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Lookup
          </Link>
          {user.role === 'admin' && (
            <Link 
              to="/admin" 
              className="flex-1 py-3 text-sm font-medium text-center text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary transition-all flex justify-center items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
