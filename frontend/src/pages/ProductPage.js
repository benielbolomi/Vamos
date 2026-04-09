import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle, ChevronLeft, Minus, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const WHATSAPP_NUMBER = "243814773188";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes && response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Bonjour, je souhaite commander ce produit.\n\nProduit: ${product.name}\nPrix: ${product.price}$\nTaille: ${selectedSize}\nQuantité: ${quantity}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const placeholderImage = "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-[#475569]">Chargement...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <p className="text-[#475569] text-lg mb-4">Produit non trouvé</p>
          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 text-[#0F172A] font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-testid="product-page">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-[#F8FAFC] py-4 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-[#475569] hover:text-[#0F172A]">Accueil</Link>
            <span className="text-[#475569]">/</span>
            <Link to="/boutique" className="text-[#475569] hover:text-[#0F172A]">Boutique</Link>
            <span className="text-[#475569]">/</span>
            <span className="text-[#0F172A]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12 md:py-16 flex-1" data-testid="product-details">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image */}
            <div className="aspect-[3/4] bg-[#F8FAFC] overflow-hidden">
              <img
                src={product.image_url || placeholderImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = placeholderImage; }}
                data-testid="product-image"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-xs text-[#475569] uppercase tracking-widest mb-2">
                {product.category_name || 'Couture'}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-[#0F172A] mb-4" data-testid="product-name">
                {product.name}
              </h1>
              <p className="text-2xl text-[#0F172A] font-medium mb-6" data-testid="product-price">
                {product.price}$
              </p>
              <p className="text-[#475569] leading-relaxed mb-8" data-testid="product-description">
                {product.description}
              </p>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-[#0F172A] mb-3">Taille</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 border text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'bg-[#0F172A] text-white border-[#0F172A]'
                            : 'border-[#E2E8F0] text-[#0F172A] hover:border-[#0F172A]'
                        }`}
                        data-testid={`size-${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-sm font-medium text-[#0F172A] mb-3">Quantité</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center hover:border-[#0F172A] transition-colors"
                    data-testid="quantity-decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center" data-testid="quantity-value">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-[#E2E8F0] flex items-center justify-center hover:border-[#0F172A] transition-colors"
                    data-testid="quantity-increase"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 text-lg font-medium transition-colors"
                data-testid="whatsapp-order-btn"
              >
                <MessageCircle className="w-6 h-6" />
                Commander via WhatsApp
              </button>

              {/* Info */}
              <div className="mt-8 pt-8 border-t border-[#E2E8F0]">
                <p className="text-sm text-[#475569] leading-relaxed">
                  <strong className="text-[#0F172A]">Note :</strong> Cliquez sur le bouton WhatsApp pour passer votre commande. 
                  Nous vous répondrons rapidement pour confirmer les détails et le mode de livraison.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
