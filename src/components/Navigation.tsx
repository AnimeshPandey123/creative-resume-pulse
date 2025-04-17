
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Moon, Sun, BookOpen } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
    { name: 'Blog', href: '/blog', icon: BookOpen },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation for section links when not on homepage
  const handleSectionNavigation = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#') && !isHomePage) {
      e.preventDefault();
      window.location.href = `/${href}`;
    }
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' 
        : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display font-bold text-lg md:text-xl">
          Animesh Pandey
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <a 
                key={link.name} 
                href={isHomePage ? link.href : `/${link.href}`} 
                className="nav-link"
                onClick={(e) => handleSectionNavigation(e, link.href)}
              >
                {link.name}
              </a>
            ) : (
              <Link key={link.name} to={link.href} className="nav-link flex items-center gap-1">
                {link.icon && <link.icon size={16} />}
                {link.name}
              </Link>
            )
          ))}
          <button 
            onClick={toggleTheme} 
            className="ml-4 p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={toggleTheme} 
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="p-2 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        'fixed inset-0 bg-white dark:bg-gray-900 z-40 flex flex-col pt-20 px-4 transition-all duration-300 ease-in-out transform md:hidden',
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <a 
                key={link.name} 
                href={isHomePage ? link.href : `/${link.href}`}
                className="text-xl py-2 px-4 border-b border-border flex items-center gap-2"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleSectionNavigation(e, link.href);
                }}
              >
                {link.icon && <link.icon size={18} />}
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-xl py-2 px-4 border-b border-border flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon && <link.icon size={18} />}
                {link.name}
              </Link>
            )
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
