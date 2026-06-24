import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, User, LogOut, Zap } from 'lucide-react';
import { useState } from 'react';

export function MainNav() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const navigationLinks = {
    EMPLOYEE: [
      { label: 'Dashboard', href: '/employee/dashboard' },
      { label: 'My Competencies', href: '/employee/competencies' },
      { label: 'My Learning', href: '/employee/learning' },
      { label: 'Certifications', href: '/employee/certifications' },
      { label: 'Gamification', href: '/employee/gamification' },
    ],
    SUPERVISOR: [
      { label: 'Dashboard', href: '/supervisor/dashboard' },
      { label: 'Team', href: '/supervisor/team' },
      { label: 'Reports', href: '/supervisor/reports' },
    ],
    ADMIN: [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Competencies', href: '/admin/competencies' },
      { label: 'Courses', href: '/admin/courses' },
      { label: 'Certifications', href: '/admin/certifications' },
      { label: 'Reports', href: '/admin/reports' },
    ],
    LD_LEAD: [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Competencies', href: '/admin/competencies' },
      { label: 'Learning Paths', href: '/admin/learning-paths' },
      { label: 'Reports', href: '/admin/reports' },
    ],
  };

  const links = role ? navigationLinks[role] || [] : [];

  return (
    <nav className="border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">iEvolve</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Notifications + User Menu */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-foreground hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground hidden sm:inline">
                      {user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-2">
            {links.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
