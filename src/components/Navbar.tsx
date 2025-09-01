'use client';

import { useState } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Logo className="h-10 w-10" />
              <span className="text-xl font-bold text-gray-900">Pharmarapide</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('commander')}
                className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50"
              >
                Commander
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50"
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-all duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

            {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-sm border-t border-gray-100">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-green-600 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-green-50 w-full text-left"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('commander')}
              className="text-gray-700 hover:text-green-600 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-green-50 w-full text-left"
            >
              Commander
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-green-600 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-green-50 w-full text-left"
            >
              À propos
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-green-600 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-green-50 w-full text-left"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 