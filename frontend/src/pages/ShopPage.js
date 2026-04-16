import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`)
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col" data-testid="shop-page">
      <Header />
      
      {/* Page Header */}
      <section className="bg-[#F8FAFC] py-12 md:py-16" data-testid="shop-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[#475569] text-sm uppercase tracking-widest mb-3">Collection</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#0F172A] mb-4">
              Notre Boutique
            </h1>
            <p className="text-[#475569] leading-relaxed">
              Découvrez nos créations uniques. Chaque pièce est confectionnée avec soin et peut être personnalisée selon vos désirs.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-[#E2E8F0]" data-testid="shop-filters">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] focus:border-[#0F172A] outline-none transition-colors"
                data-testid="search-input"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-[#475569] mr-2 hidden md:block" />
              <button
                onClick={() => setSelectedCategory('all')}
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                data-testid="category-all"
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  data-testid={`category-${cat.id}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16 flex-1" data-testid="products-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#E2E8F0] mb-4"></div>
                  <div className="h-3 bg-[#E2E8F0] w-20 mb-2"></div>
                  <div className="h-5 bg-[#E2E8F0] w-32 mb-2"></div>
                  <div className="h-4 bg-[#E2E8F0] w-16"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <p className="text-[#475569] text-sm mb-6">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#475569] text-lg mb-2">Aucun produit trouvé</p>
              <p className="text-[#475569]/70">
                {searchQuery ? 'Essayez une autre recherche' : 'Les produits arrivent bientôt'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
