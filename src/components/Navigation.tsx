'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
    { name: 'Blog', href: '/blog' },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
      if (typeof window !== 'undefined') {
        window.location.href = `/${href}`;
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background border-b border-border'
            : 'bg-background/80'
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-sm font-medium tracking-tight">
            Animesh Pandey
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map(link =>
              link.href.startsWith('#') ? (
                <a
                  key={link.name}
                  href={isHomePage ? link.href : `/${link.href}`}
                  className="nav-link"
                  onClick={e => handleSectionNavigation(e, link.href)}
                >
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} href={link.href} className="nav-link">
                  {link.name}
                </Link>
              )
            )}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-background z-40 flex flex-col pt-20 px-5 transition-all duration-300 ease-in-out transform md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col space-y-4">
          {navLinks.map(link =>
            link.href.startsWith('#') ? (
              <a
                key={link.name}
                href={isHomePage ? link.href : `/${link.href}`}
                className="text-2xl font-display font-medium tracking-tight py-3 border-b border-border"
                onClick={e => {
                  setMobileMenuOpen(false);
                  handleSectionNavigation(e, link.href);
                }}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-display font-medium tracking-tight py-3 border-b border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
