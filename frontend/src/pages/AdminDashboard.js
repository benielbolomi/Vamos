import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Mail,
  LogOut,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Products Management Component
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    image_url: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`)
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await axios.post(`${API}/upload`, formDataUpload, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image_url: response.data.url });
      toast.success('Image uploadée');
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()) : formData.sizes
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, data, { headers: getAuthHeader() });
        toast.success('Produit mis à jour');
      } else {
        await axios.post(`${API}/products`, data, { headers: getAuthHeader() });
        toast.success('Produit créé');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers: getAuthHeader() });
      toast.success('Produit supprimé');
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id,
      sizes: product.sizes,
      featured: product.featured,
      image_url: product.image_url
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      sizes: ['S', 'M', 'L', 'XL'],
      featured: false,
      image_url: ''
    });
  };

  return (
    <div data-testid="admin-products-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-[#0F172A]">Produits</h1>
        <button
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
          data-testid="add-product-btn"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#475569]">Chargement...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-[#F8FAFC]">
          <Package className="w-12 h-12 text-[#E2E8F0] mx-auto mb-4" />
          <p className="text-[#475569]">Aucun produit</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Vedette</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-12 h-12 bg-[#F8FAFC] overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#E2E8F0]">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category_name || '-'}</TableCell>
                  <TableCell>{product.price}$</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs ${product.featured ? 'bg-[#FCE7F3] text-[#0F172A]' : 'bg-[#F8FAFC] text-[#475569]'}`}>
                      {product.featured ? 'Oui' : 'Non'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => openEditDialog(product)}
                      className="p-2 text-[#475569] hover:text-[#0F172A] transition-colors"
                      data-testid={`edit-product-${product.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-[#475569] hover:text-red-500 transition-colors"
                      data-testid={`delete-product-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#E2E8F0] focus:border-[#0F172A] outline-none"
                required
                data-testid="product-name-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-[#E2E8F0] focus:border-[#0F172A] outline-none resize-none"
                rows={3}
                required
                data-testid="product-description-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">Prix ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] focus:border-[#0F172A] outline-none"
                  required
                  data-testid="product-price-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">Catégorie</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] focus:border-[#0F172A] outline-none"
                  required
                  data-testid="product-category-select"
                >
                  <option value="">Sélectionner</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Tailles (séparées par virgule)</label>
              <input
                type="text"
                value={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                className="w-full px-3 py-2 border border-[#E2E8F0] focus:border-[#0F172A] outline-none"
                placeholder="S, M, L, XL"
                data-testid="product-sizes-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Image</label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-cover" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Upload...' : 'Choisir une image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    data-testid="product-image-input"
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
                data-testid="product-featured-checkbox"
              />
              <label htmlFor="featured" className="text-sm text-[#0F172A]">Produit vedette</label>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#0F172A] text-white font-medium hover:bg-slate-800 transition-colors"
                data-testid="product-submit-btn"
              >
                {editingProduct ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Categories Management Component
function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory.id}`, formData, { headers: getAuthHeader() });
        toast.success('Catégorie mise à jour');
      } else {
        await axios.post(`${API}/categories`, formData, { headers: getAuthHeader() });
        toast.success('Catégorie créée');
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await axios.delete(`${API}/categories/${id}`, { headers: getAuthHeader() });
      toast.success('Catégorie supprimée');
      fetchCategories();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setIsDialogOpen(true);
  };

  return (
    <div data-testid="admin-categories-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-[#0F172A]">Catégories</h1>
        <button
          onClick={() => { setEditingCategory(null); setFormData({ name: '', description: '' }); setIsDialogOpen(true); }}
          className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
          data-testid="add-category-btn"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#475569]">Chargement...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-[#F8FAFC]">
          <FolderOpen className="w-12 h-12 text-[#E2E8F0] mx-auto mb-4" />
          <p className="text-[#475569]">Aucune catégorie</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white border border-[#E2E8F0] p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[#0F172A]">{category.name}</h3>
                <p className="text-sm text-[#475569]">{category.description || 'Pas de description'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditDialog(category)}
                  className="p-2 text-[#475569] hover:text-[#0F172A] transition-colors"
                  data-testid={`edit-category-${category.id}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-[#475569] hover:text-red-500 transition-colors"
                  data-testid={`delete-category-${category.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#E2E8F0] focus:border-[#0F172A] outline-none"
                required
                data-testid="category-name-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-[#E2E8F0] focus:border-[#0F172A] outline-none resize-none"
                rows={3}
                data-testid="category-description-input"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#0F172A] text-white font-medium hover:bg-slate-800 transition-colors"
                data-testid="category-submit-btn"
              >
                {editingCategory ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Messages Page Component
function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/contact`, { headers: getAuthHeader() });
      setMessages(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/contact/${id}/read`, {}, { headers: getAuthHeader() });
      fetchMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await axios.delete(`${API}/contact/${id}`, { headers: getAuthHeader() });
      toast.success('Message supprimé');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  return (
    <div data-testid="admin-messages-page">
      <h1 className="font-serif text-2xl text-[#0F172A] mb-6">Messages</h1>

      {loading ? (
        <div className="text-center py-12 text-[#475569]">Chargement...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-[#F8FAFC]">
          <Mail className="w-12 h-12 text-[#E2E8F0] mx-auto mb-4" />
          <p className="text-[#475569]">Aucun message</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white border border-[#E2E8F0] p-4 cursor-pointer hover:border-[#0F172A] transition-colors ${!message.read ? 'border-l-4 border-l-[#0F172A]' : ''}`}
              onClick={() => openMessage(message)}
              data-testid={`message-${message.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium ${!message.read ? 'text-[#0F172A]' : 'text-[#475569]'}`}>
                  {message.name}
                </h3>
                <span className="text-xs text-[#475569]">
                  {new Date(message.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-sm text-[#475569]">{message.email}</p>
              <p className="text-sm text-[#475569] mt-1 truncate">{message.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Message de {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-[#475569]">Email</p>
                <p className="text-[#0F172A]">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#475569]">Date</p>
                <p className="text-[#0F172A]">
                  {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#475569]">Message</p>
                <p className="text-[#0F172A] whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="flex gap-3 pt-4">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex-1 px-4 py-2 bg-[#0F172A] text-white font-medium text-center hover:bg-slate-800 transition-colors"
                >
                  Répondre par email
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-4 py-2 border border-red-500 text-red-500 font-medium hover:bg-red-50 transition-colors"
                  data-testid="delete-message-btn"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  const [stats, setStats] = useState({ products: 0, categories: 0, messages: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, messagesRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/contact`, { headers: getAuthHeader() })
      ]);
      setStats({
        products: productsRes.data.length,
        categories: categoriesRes.data.length,
        messages: messagesRes.data.filter(m => !m.read).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div data-testid="admin-dashboard-overview">
      <h1 className="font-serif text-2xl text-[#0F172A] mb-6">Tableau de bord</h1>
      
      <div className="grid sm:grid-cols-3 gap-6">
        <Link to="/admin/products" className="bg-white border border-[#E2E8F0] p-6 hover:border-[#0F172A] transition-colors">
          <Package className="w-8 h-8 text-[#0F172A] mb-4" />
          <p className="text-3xl font-semibold text-[#0F172A]">{stats.products}</p>
          <p className="text-[#475569]">Produits</p>
        </Link>
        <Link to="/admin/categories" className="bg-white border border-[#E2E8F0] p-6 hover:border-[#0F172A] transition-colors">
          <FolderOpen className="w-8 h-8 text-[#0F172A] mb-4" />
          <p className="text-3xl font-semibold text-[#0F172A]">{stats.categories}</p>
          <p className="text-[#475569]">Catégories</p>
        </Link>
        <Link to="/admin/messages" className="bg-white border border-[#E2E8F0] p-6 hover:border-[#0F172A] transition-colors">
          <Mail className="w-8 h-8 text-[#0F172A] mb-4" />
          <p className="text-3xl font-semibold text-[#0F172A]">{stats.messages}</p>
          <p className="text-[#475569]">Messages non lus</p>
        </Link>
      </div>
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-[#475569]">Chargement...</div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Produits' },
    { path: '/admin/categories', icon: FolderOpen, label: 'Catégories' },
    { path: '/admin/messages', icon: Mail, label: 'Messages' },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex" data-testid="admin-dashboard">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 admin-sidebar transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center p-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-[#0F172A]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round"/>
                <path d="M8 12h8M12 8v8" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 15v4M9 19h6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-white font-serif text-lg">Crois Seulement</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="text-white/60 text-sm mb-3 px-4">{user.email}</div>
          <button
            onClick={handleLogout}
            className="admin-nav-item w-full text-left hover:text-red-400"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
          <Link
            to="/"
            className="admin-nav-item w-full text-left mt-2"
            data-testid="view-site-btn"
          >
            <Eye className="w-5 h-5" />
            Voir le site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-[#0F172A]">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif text-lg text-[#0F172A]">Admin</span>
          <div className="w-6" />
        </header>

        <div className="p-6 lg:p-8">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="messages" element={<MessagesPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
