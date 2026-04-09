import { useState } from 'react';
import axios from 'axios';
import { MessageCircle, Phone, Mail, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const WHATSAPP_NUMBER = "243814773188";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message envoyé avec succès !');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite avoir des informations sur vos services.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid="contact-page">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-[#F8FAFC] py-12 md:py-16" data-testid="contact-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[#475569] text-sm uppercase tracking-widest mb-3">Contact</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#0F172A] mb-4">
              Contactez-nous
            </h1>
            <p className="text-[#475569] leading-relaxed">
              Nous sommes là pour répondre à toutes vos questions. N'hésitez pas à nous contacter !
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 flex-1" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#0F172A] mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Votre nom"
                    data-testid="contact-name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="votre@email.com"
                    data-testid="contact-email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#0F172A] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="form-input resize-none"
                    placeholder="Votre message..."
                    data-testid="contact-message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white py-3.5 font-medium transition-colors disabled:opacity-50"
                  data-testid="contact-submit"
                >
                  {loading ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#0F172A] mb-6">
                Nos coordonnées
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FCE7F3] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0F172A] mb-1">Adresse</h3>
                    <p className="text-[#475569]">
                      Av/ Sama n° 32<br />
                      Q/Ngombankikusa, C/Ngaliema<br />
                      Kinshasa, RDC<br />
                      <span className="text-sm">RÉF: Arrêt Molende</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FCE7F3] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0F172A] mb-1">Téléphone</h3>
                    <p className="text-[#475569]">+243 814 773 188</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FCE7F3] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0F172A] mb-1">Email</h3>
                    <p className="text-[#475569]">lufarangae@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-[#0F172A] p-6 md:p-8">
                <h3 className="font-serif text-xl text-white mb-3">
                  Préférez WhatsApp ?
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Contactez-nous directement sur WhatsApp pour une réponse plus rapide.
                </p>
                <button
                  onClick={openWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 font-medium transition-colors"
                  data-testid="contact-whatsapp-btn"
                >
                  <MessageCircle className="w-5 h-5" />
                  Ouvrir WhatsApp
                </button>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-medium text-[#0F172A] mb-4">Suivez-nous</h3>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/croisseulement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#F8FAFC] hover:bg-[#FCE7F3] flex items-center justify-center transition-colors"
                    data-testid="contact-instagram"
                  >
                    <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://tiktok.com/@ussenimode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#F8FAFC] hover:bg-[#FCE7F3] flex items-center justify-center transition-colors"
                    data-testid="contact-tiktok"
                  >
                    <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
