import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle, ArrowRight, Scissors } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const WHATSAPP_NUMBER = "243814773188";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setFeaturedProducts(response.data.slice(0, 9));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const openWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite avoir des informations sur vos services de couture.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid="home-page">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://static.prod-images.emergentagent.com/jobs/8270ccea-dddf-4cf1-97cf-2426f86ce23a/images/70ed9a7d88128a73036dbac823de170541a36327b3e955991d7f15b4136b2969.png"
            alt="VAMOS Couture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 to-[#0F172A]/40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <p className="text-[#FCE7F3] text-sm uppercase tracking-widest mb-4 fade-in">
              Centre de Formation Professionnelle
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-tight mb-6 fade-in">
              Crois Seulement
              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2 text-white/80">
                Maison de Couture
              </span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed fade-in">
              Découvrez l'art de la couture africaine. Des créations uniques, faites sur mesure avec passion et savoir-faire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 fade-in">
              <Link
                to="/boutique"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0F172A] px-8 py-3.5 font-medium hover:bg-[#FCE7F3] transition-colors"
                data-testid="hero-shop-btn"
              >
                Voir la boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 font-medium hover:bg-[#128C7E] transition-colors"
                data-testid="hero-whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5" />
                Contactez-nous
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]" data-testid="about-snippet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#475569] text-sm uppercase tracking-widest mb-3">Notre histoire</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#0F172A] mb-6">
                L'excellence de la couture congolaise
              </h2>
              <p className="text-[#475569] leading-relaxed mb-6">
                Dirigé par M. Ramazani Usseni, VAMOS est un centre de formation professionnelle dédié à l'art de la couture. 
                Nous créons des vêtements sur mesure qui célèbrent la richesse de la mode africaine tout en offrant une formation 
                de qualité aux futurs couturiers.
              </p>
              <Link
                to="/a-propos"
                className="inline-flex items-center gap-2 text-[#0F172A] font-medium hover:gap-3 transition-all"
                data-testid="about-link"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://customer-assets.emergentagent.com/job_atelier-couture-4/artifacts/e24ik5nw_IMG-20260409-WA0032.jpg"
                alt="VAMOS Centre de Formation"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#0F172A] p-6 hidden md:block">
                <Scissors className="w-8 h-8 text-[#FCE7F3]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24" data-testid="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-[#475569] text-sm uppercase tracking-widest mb-3">Collection</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#0F172A]">
                Nos créations vedettes
              </h2>
            </div>
            <Link
              to="/boutique"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#0F172A] font-medium hover:gap-3 transition-all"
              data-testid="view-all-products"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#E2E8F0] mb-4"></div>
                  <div className="h-3 bg-[#E2E8F0] w-20 mb-2"></div>
                  <div className="h-5 bg-[#E2E8F0] w-32 mb-2"></div>
                  <div className="h-4 bg-[#E2E8F0] w-16"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#F8FAFC]">
              <Scissors className="w-12 h-12 text-[#E2E8F0] mx-auto mb-4" />
              <p className="text-[#475569]">Les produits vedettes arrivent bientôt.</p>
              <Link
                to="/boutique"
                className="mt-4 inline-flex items-center gap-2 text-[#0F172A] font-medium"
              >
                Voir la boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#0F172A]" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
            Prêt à créer votre tenue sur mesure ?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Contactez-nous via WhatsApp pour discuter de vos projets de couture. 
            Nous sommes là pour transformer vos idées en réalité.
          </p>
          <button
            onClick={openWhatsApp}
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-10 py-4 text-lg font-medium hover:bg-[#128C7E] transition-colors"
            data-testid="cta-whatsapp-btn"
          >
            <MessageCircle className="w-6 h-6" />
            Démarrer une conversation
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
