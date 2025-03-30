import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import EcoSplitLogo from '../ui/eco-split-logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { 
  Menu,
  Plus,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Receipts', href: '/receipts' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <EcoSplitLogo size="sm" className="mr-2" />
              <span className="text-xl font-bold text-gray-900">EcoSplit</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              {user && navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium ${
                    location === link.href
                      ? 'text-green-800 font-semibold'
                      : 'text-gray-700 hover:text-green-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side navigation items */}
          <div className="flex items-center">
            {user ? (
              <>
                <Button 
                  size="sm" 
                  className="hidden sm:flex mr-4 bg-green-800 hover:bg-green-700"
                  onClick={() => window.location.href = '/upload'}
                >
                  <Plus className="h-4 w-4 mr-1" /> New Receipt
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary-light text-primary-dark">
                          {getInitials(user.name || user.username)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = '/upload'}>
                        Upload Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = '/leaderboard'}>
                        Leaderboard
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="border-green-800 text-green-800 hover:bg-green-50">Log in</Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-green-800 hover:bg-green-700">Sign up</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on state */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2 text-base font-medium ${
                        location === link.href
                          ? 'text-green-800 font-semibold'
                          : 'text-gray-700 hover:text-green-800'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/upload"
                    className="block px-3 py-2 text-base font-medium text-green-800 hover:text-green-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Upload Receipt
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-3 py-2 text-base font-medium text-green-800 hover:text-green-700"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="block px-3 py-2 text-base font-medium text-green-800 hover:text-green-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth"
                    className="block px-3 py-2 text-base font-medium text-green-800 hover:text-green-700 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
