import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = "243814773188";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const openWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite avoir des informations sur vos services de couture.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#E2E8F0]" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0F172A] flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl font-serif">V</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg md:text-xl font-semibold text-[#0F172A] leading-tight">VAMOS</h1>
              <p className="text-[10px] md:text-xs text-[#475569] tracking-widest uppercase">Couture</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link text-sm font-medium tracking-wide transition-colors ${
                  isActive(link.href) ? 'text-[#0F172A]' : 'text-[#475569] hover:text-[#0F172A]'
                }`}
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* WhatsApp Button - Desktop */}
          <button
            onClick={openWhatsApp}
            className="hidden md:flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2.5 text-sm font-medium transition-colors"
            data-testid="whatsapp-header-btn"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#0F172A]"
            data-testid="mobile-menu-btn"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E8F0] fade-in">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 text-base font-medium ${
                  isActive(link.href) ? 'text-[#0F172A] bg-[#FCE7F3]' : 'text-[#475569]'
                }`}
                data-testid={`mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { openWhatsApp(); setIsMenuOpen(false); }}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 font-medium"
              data-testid="mobile-whatsapp-btn"
            >
              <MessageCircle className="w-5 h-5" />
              Contacter via WhatsApp
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
