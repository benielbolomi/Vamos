import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = "243814773188";

export default function ProductCard({ product }) {
  const openWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(
      `Bonjour, je souhaite commander ce produit.\n\nProduit: ${product.name}\nPrix: ${product.price}$`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const placeholderImage = "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=500&fit=crop";

  return (
    <Link
      to={`/produit/${product.id}`}
      className="group block bg-white"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="overflow-hidden aspect-[3/4] bg-[#F8FAFC] mb-4 relative">
        <img
          src={product.image_url || placeholderImage}
          alt={product.name}
          className="w-full h-full object-cover product-image-zoom"
          onError={(e) => { e.target.src = placeholderImage; }}
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-[#FCE7F3] text-[#0F172A] text-xs px-3 py-1 font-medium uppercase tracking-wide">
            Vedette
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-[#475569] uppercase tracking-widest">
          {product.category_name || 'Couture'}
        </p>
        <h3 className="font-serif text-lg text-[#0F172A] group-hover:text-[#475569] transition-colors">
          {product.name}
        </h3>
        <p className="text-[#0F172A] font-medium">{product.price}$</p>
        
        {/* WhatsApp Button */}
        <button
          onClick={openWhatsApp}
          className="mt-3 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 text-sm font-medium transition-colors"
          data-testid={`whatsapp-btn-${product.id}`}
        >
          <MessageCircle className="w-4 h-4" />
          Commander
        </button>
      </div>
    </Link>
  );
}
