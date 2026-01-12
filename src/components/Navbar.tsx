import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  LayoutDashboard, 
  Briefcase, 
  Upload, 
  Plus, 
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/upload', label: 'Upload Resume', icon: Upload },
    { path: '/matches', label: 'Job Matches', icon: Briefcase },
  ];

  // Add admin route if user is admin
  if (user?.role === 'ADMIN') {
    navItems.push({ path: '/admin/jobs', label: 'Manage Jobs', icon: Plus });
  }

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
            <FileText className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline gradient-text">Resume Analyzer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
              {user?.role === 'ADMIN' && (
                <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  Admin
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <hr className="my-2" />
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
