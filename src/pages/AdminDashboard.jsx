import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import DriveImage from '../components/common/DriveImage';
import ImageUploader from '../components/common/ImageUploader';
import { 
  ShieldCheck, 
  Users, 
  PawPrint, 
  ShoppingBag, 
  MousePointerClick, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Video,
  Heart,
  Info,
  MessageSquare,
  Flame,
  Sparkles,
  Layers,
  Copy,
  FileText,
  Search,
  Check,
  Stethoscope,
  Scissors,
  MapPin,
  Phone,
  UserPlus,
  Star,
  HeartPulse,
  Activity
} from 'lucide-react';
import SearchSelect from '../components/common/SearchSelect';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { token, login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [petsForSale, setPetsForSale] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [userPetsList, setUserPetsList] = useState([]);
  const [userPetPage, setUserPetPage] = useState(1);
  const [userPetLimit, setUserPetLimit] = useState(10);
  const [userPetSpeciesFilter, setUserPetSpeciesFilter] = useState('all'); // 'all', 'dog', 'cat'
  const [userPetSearch, setUserPetSearch] = useState('');
  const [selectedPetHealthModal, setSelectedPetHealthModal] = useState(null);
  const [petHealthDetails, setPetHealthDetails] = useState(null);
  const [loadingPetHealth, setLoadingPetHealth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Phân trang chuẩn codebase dùng chung cho Thú cưng, Sản phẩm, Bài viết & Giống loài
  const [petSalePage, setPetSalePage] = useState(1);
  const [petSaleLimit, setPetSaleLimit] = useState(5);

  const [productPage, setProductPage] = useState(1);
  const [productLimit, setProductLimit] = useState(5);

  const [blogPage, setBlogPage] = useState(1);
  const [blogLimit, setBlogLimit] = useState(5);

  const [breedPage, setBreedPage] = useState(1);
  const [breedLimit, setBreedLimit] = useState(10);
  const [breedSpeciesFilter, setBreedSpeciesFilter] = useState('all'); // 'all', 'dog', 'cat'
  const [breedSearch, setBreedSearch] = useState('');

  // Phân quyền & Quản lý Tài khoản (User & Role RBAC)
  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(10);
  const [userRoleFilter, setUserRoleFilter] = useState('all'); // 'all', 'admin', 'user', 'guest'
  const [userStatusFilter, setUserStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [userSearch, setUserSearch] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
    is_active: true
  });

  // Quản lý Bệnh Viện Thú Y & Tiệm Spa (Pet Hospitals & Spas CRUD)
  const [locationPage, setLocationPage] = useState(1);
  const [locationLimit, setLocationLimit] = useState(10);
  const [locationTypeFilter, setLocationTypeFilter] = useState('all'); // 'all', 'clinic', 'spa'
  const [locationSearch, setLocationSearch] = useState('');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationFormData, setLocationFormData] = useState({
    name: '',
    type: 'clinic',
    address: '',
    district: '',
    city: 'Hà Nội',
    phone: '',
    rating: 5.0,
    reviews_count: 0,
    emergency_24h: false,
    distance: '',
    image_url: '',
    services: '',
    description: '',
    is_active: true
  });

  // Dữ liệu phân trang hiển thị theo trang hiện tại
  const paginatedPetsForSale = React.useMemo(() => {
    const start = (petSalePage - 1) * petSaleLimit;
    return petsForSale.slice(start, start + petSaleLimit);
  }, [petsForSale, petSalePage, petSaleLimit]);

  const paginatedProducts = React.useMemo(() => {
    const start = (productPage - 1) * productLimit;
    return products.slice(start, start + productLimit);
  }, [products, productPage, productLimit]);

  const paginatedBlogs = React.useMemo(() => {
    const start = (blogPage - 1) * blogLimit;
    return blogs.slice(start, start + blogLimit);
  }, [blogs, blogPage, blogLimit]);

  const filteredBreeds = React.useMemo(() => {
    let result = breeds;
    if (breedSpeciesFilter !== 'all') {
      result = result.filter(b => b.species === breedSpeciesFilter);
    }
    if (breedSearch.trim()) {
      const q = breedSearch.toLowerCase().trim();
      result = result.filter(b => 
        b.name.toLowerCase().includes(q) ||
        (b.origin && b.origin.toLowerCase().includes(q)) ||
        (b.temperament && b.temperament.toLowerCase().includes(q))
      );
    }
    return result;
  }, [breeds, breedSpeciesFilter, breedSearch]);

  const paginatedBreeds = React.useMemo(() => {
    const start = (breedPage - 1) * breedLimit;
    return filteredBreeds.slice(start, start + breedLimit);
  }, [filteredBreeds, breedPage, breedLimit]);

  const filteredUsers = React.useMemo(() => {
    let result = usersList;
    if (userRoleFilter !== 'all') {
      result = result.filter(u => u.role === userRoleFilter);
    }
    if (userStatusFilter !== 'all') {
      const isActive = userStatusFilter === 'active';
      result = result.filter(u => u.is_active === isActive);
    }
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase().trim();
      result = result.filter(u => 
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.full_name && u.full_name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [usersList, userRoleFilter, userStatusFilter, userSearch]);

  const paginatedUsers = React.useMemo(() => {
    const start = (userPage - 1) * userLimit;
    return filteredUsers.slice(start, start + userLimit);
  }, [filteredUsers, userPage, userLimit]);

  const filteredLocations = React.useMemo(() => {
    let result = locationsList;
    if (locationTypeFilter !== 'all') {
      result = result.filter(l => l.type === locationTypeFilter);
    }
    if (locationSearch.trim()) {
      const q = locationSearch.toLowerCase().trim();
      result = result.filter(l => 
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.address && l.address.toLowerCase().includes(q)) ||
        (l.district && l.district.toLowerCase().includes(q)) ||
        (l.phone && l.phone.includes(q))
      );
    }
    return result;
  }, [locationsList, locationTypeFilter, locationSearch]);

  const paginatedLocations = React.useMemo(() => {
    const start = (locationPage - 1) * locationLimit;
    return filteredLocations.slice(start, start + locationLimit);
  }, [filteredLocations, locationPage, locationLimit]);

  // Lọc và phân trang cho Hồ sơ Thú cưng Khách hàng (User Pets)
  const filteredUserPets = React.useMemo(() => {
    let result = [...userPetsList];
    if (userPetSpeciesFilter !== 'all') {
      result = result.filter(p => p.species === userPetSpeciesFilter);
    }
    if (userPetSearch.trim()) {
      const q = userPetSearch.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.breed && p.breed.toLowerCase().includes(q)) ||
        (p.owner_name && p.owner_name.toLowerCase().includes(q)) ||
        (p.owner_email && p.owner_email.toLowerCase().includes(q))
      );
    }
    return result;
  }, [userPetsList, userPetSpeciesFilter, userPetSearch]);

  const paginatedUserPets = React.useMemo(() => {
    const start = (userPetPage - 1) * userPetLimit;
    return filteredUserPets.slice(start, start + userPetLimit);
  }, [filteredUserPets, userPetPage, userPetLimit]);
  
  // Thông báo trạng thái tương tác
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });
  const [discordAlertStatus, setDiscordAlertStatus] = useState('');

  // State Modal Thú Cưng Bán (Hỗ trợ danh sách đa ảnh và dán nhanh nhiều link)
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [bulkPasteOpen, setBulkPasteOpen] = useState(false);
  const [bulkPasteText, setBulkPasteText] = useState('');
  const [petForm, setPetForm] = useState({
    name: '',
    species: 'dog',
    breed: '',
    gender: 'male',
    age_months: 2,
    color: '',
    price: '',
    deposit_amount: '',
    vaccination_status: 'Đã tiêm 2 mũi Vanguard 7 bệnh, sổ giun 2 lần',
    pedigree: 'Không giấy',
    health_warranty: 'Bảo hành 15 ngày Care & Parvo, cam kết thuần chủng trọn đời',
    microchip_id: '',
    images: [''],
    image_url: '',
    video_url: '',
    description: '',
    status: 'available'
  });

  // State Modal Giống Thú Cưng (Breeds Management)
  const [breedModalOpen, setBreedModalOpen] = useState(false);
  const [editingBreed, setEditingBreed] = useState(null);
  const [breedForm, setBreedForm] = useState({
    name: '',
    species: 'dog',
    origin: '',
    size_category: 'medium',
    temperament: '',
    is_active: true
  });

  // State Modal Sản phẩm
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category_id: 'c1',
    pet_type: 'all',
    reference_price: '',
    shopee_url: '',
    tiktok_url: '',
    image_url: '',
    target_age: 'Mọi lứa tuổi',
    target_needs: '',
    description: '',
    ingredients: '',
    benefits: '',
    usage_instructions: '',
    is_active: true
  });

  // State Modal Bài viết Blog
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Kiến thức nuôi',
    target_pet_type: 'all',
    thumbnail_url: '',
    youtube_url: '',
    tags: '',
    summary: '',
    content: '',
    is_published: true
  });

  // Tải dữ liệu tổng thể
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dashRes, petRes, prodRes, catRes, blogRes, breedRes, userRes, locRes, userPetsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/pet-sales?limit=100&include_sold=true`),
        fetch(`${API_BASE}/products?limit=100&include_inactive=true`),
        fetch(`${API_BASE}/products/categories`),
        fetch(`${API_BASE}/admin/blogs`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/breeds`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/users?limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/locations?limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/user-pets?limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const dash = await dashRes.json();
      const petData = await petRes.json();
      const prods = await prodRes.json();
      const cats = await catRes.json();
      const blgs = await blogRes.json();
      const breedData = await breedRes.json();
      const userData = await userRes.json();
      const locData = await locRes.json();
      const userPetsData = await userPetsRes.json();

      if (dash.success) setStats(dash.data);
      if (petData.success) setPetsForSale(petData.data.pets);
      if (prods.success) setProducts(prods.data.products);
      if (cats.success) setCategories(cats.data);
      if (blgs.success) setBlogs(blgs.data || []);
      if (userData.success) setUsersList(userData.data.users || []);
      if (locData.success) setLocationsList(locData.data.locations || []);
      if (userPetsData.success) setUserPetsList(userPetsData.data.pets || []);
      if (breedData.success) {
        setBreeds(breedData.data.breeds || []);
      } else {
        try {
          const pubRes = await fetch(`${API_BASE}/breeds?limit=100`);
          const pubData = await pubRes.json();
          if (pubData.success) setBreeds(pubData.data.breeds || []);
        } catch {}
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const showNotification = (text, type = 'success') => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 5000);
  };


  // --- HÀNH ĐỘNG QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN (USER & ROLE RBAC) ---
  const handleOpenUserModal = (usr = null) => {
    if (usr) {
      setEditingUser(usr);
      setUserFormData({
        email: usr.email || '',
        password: '',
        full_name: usr.full_name || '',
        role: usr.role || 'user',
        is_active: usr.is_active !== false
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'user',
        is_active: true
      });
    }
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser && (!userFormData.email || !userFormData.password || !userFormData.full_name)) {
      showNotification('Vui lòng nhập đầy đủ Email, Mật khẩu và Họ tên!', 'error');
      return;
    }

    try {
      if (editingUser) {
        if (editingUser.role !== userFormData.role) {
          await handleUpdateUserRole(editingUser.id, userFormData.role, false);
        }
        if (editingUser.is_active !== userFormData.is_active) {
          await handleToggleUserStatus(editingUser.id, false);
        }
        showNotification('✅ Đã cập nhật tài khoản thành công!');
      } else {
        const res = await fetch(`${API_BASE}/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(userFormData)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setUsersList(prev => [data.data, ...prev]);
        showNotification('✅ Tạo tài khoản mới thành công!');
      }
      setUserModalOpen(false);
      fetchAllData();
    } catch (err) {
      showNotification('Lỗi khi lưu tài khoản: ' + err.message, 'error');
    }
  };

  const handleUpdateUserRole = async (userId, newRole, shouldNotify = true) => {
    const oldList = [...usersList];
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!data.success) {
        setUsersList(oldList);
        showNotification('Không thể đổi quyền: ' + data.message, 'error');
        return;
      }
      if (shouldNotify) {
        showNotification(`✅ Đã phân quyền thành công: ${newRole}`);
      }
    } catch (err) {
      setUsersList(oldList);
      showNotification('Lỗi kết nối máy chủ: ' + err.message, 'error');
    }
  };

  const handleToggleUserStatus = async (userId, shouldNotify = true) => {
    const oldList = [...usersList];
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) {
        setUsersList(oldList);
        showNotification('Không thể đổi trạng thái: ' + data.message, 'error');
        return;
      }
      if (shouldNotify) {
        showNotification(data.data.is_active ? '✅ Đã kích hoạt tài khoản' : '🔒 Đã khóa tài khoản');
      }
    } catch (err) {
      setUsersList(oldList);
      showNotification('Lỗi kết nối máy chủ: ' + err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống? Hành động này không thể hoàn tác.')) return;
    const oldList = [...usersList];
    setUsersList(prev => prev.filter(u => u.id !== userId));
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) {
        setUsersList(oldList);
        showNotification('Không thể xóa: ' + data.message, 'error');
        return;
      }
      showNotification('✅ Đã xóa tài khoản người dùng thành công');
    } catch (err) {
      setUsersList(oldList);
      showNotification('Lỗi kết nối máy chủ: ' + err.message, 'error');
    }
  };

  // --- HÀNH ĐỘNG QUẢN LÝ BỆNH VIỆN THÚ Y & TIỆM SPA (LOCATIONS CRUD) ---
  const handleOpenLocationModal = (loc = null) => {
    if (loc) {
      setEditingLocation(loc);
      setLocationFormData({
        name: loc.name || '',
        type: loc.type || 'clinic',
        address: loc.address || '',
        district: loc.district || '',
        city: loc.city || 'Hà Nội',
        phone: loc.phone || '',
        rating: loc.rating || 5.0,
        reviews_count: loc.reviews_count ?? loc.reviewsCount ?? 0,
        emergency_24h: Boolean(loc.emergency_24h ?? loc.emergency24h),
        distance: loc.distance || '',
        image_url: loc.image_url || '',
        services: Array.isArray(loc.services) ? loc.services.join(', ') : (loc.services || ''),
        description: loc.description || '',
        is_active: loc.is_active !== false
      });
    } else {
      setEditingLocation(null);
      setLocationFormData({
        name: '',
        type: 'clinic',
        address: '',
        district: '',
        city: 'Hà Nội',
        phone: '',
        rating: 5.0,
        reviews_count: 0,
        emergency_24h: false,
        distance: '',
        image_url: '',
        services: '',
        description: '',
        is_active: true
      });
    }
    setLocationModalOpen(true);
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!locationFormData.name) {
      showNotification('Vui lòng nhập tên bệnh viện hoặc tiệm spa!', 'error');
      return;
    }

    const payload = {
      ...locationFormData,
      services: locationFormData.services.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingLocation) {
        const res = await fetch(`${API_BASE}/admin/locations/${editingLocation.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setLocationsList(prev => prev.map(l => l.id === editingLocation.id ? data.data : l));
        showNotification('✅ Đã cập nhật cơ sở thú y / spa thành công!');
      } else {
        const res = await fetch(`${API_BASE}/admin/locations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setLocationsList(prev => [data.data, ...prev]);
        showNotification('✅ Đã thêm cơ sở mới thành công!');
      }
      setLocationModalOpen(false);
      fetchAllData();
    } catch (err) {
      showNotification('Lỗi khi lưu cơ sở: ' + err.message, 'error');
    }
  };

  const handleToggleLocationActive = async (locId) => {
    const oldList = [...locationsList];
    setLocationsList(prev => prev.map(l => l.id === locId ? { ...l, is_active: !l.is_active } : l));
    try {
      const res = await fetch(`${API_BASE}/admin/locations/${locId}/toggle-active`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) {
        setLocationsList(oldList);
        showNotification('Không thể đổi trạng thái: ' + data.message, 'error');
        return;
      }
      showNotification(data.data.is_active ? '✅ Đã kích hoạt hiển thị cơ sở' : '👁️ Đã tạm ẩn cơ sở');
    } catch (err) {
      setLocationsList(oldList);
      showNotification('Lỗi kết nối máy chủ: ' + err.message, 'error');
    }
  };

  const handleDeleteLocation = async (locId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cơ sở này?')) return;
    const oldList = [...locationsList];
    setLocationsList(prev => prev.filter(l => l.id !== locId));
    try {
      const res = await fetch(`${API_BASE}/admin/locations/${locId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) {
        setLocationsList(oldList);
        showNotification('Không thể xóa: ' + data.message, 'error');
        return;
      }
      showNotification('✅ Đã xóa cơ sở thú y / spa thành công');
    } catch (err) {
      setLocationsList(oldList);
      showNotification('Lỗi kết nối máy chủ: ' + err.message, 'error');
    }
  };

  // --- HÀNH ĐỘNG QUẢN LÝ HỒ SƠ THÚ CƯNG KHÁCH HÀNG & THỂ TRẠNG ---
  const handleViewPetHealth = async (pet) => {
    setSelectedPetHealthModal(pet);
    setLoadingPetHealth(true);
    setPetHealthDetails(null);
    try {
      const res = await fetch(`${API_BASE}/admin/user-pets/${pet.id}/health`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPetHealthDetails(data.data);
      }
    } catch (err) {
      showNotification('Lỗi khi tải lịch sử đo thể trạng: ' + err.message, 'error');
    } finally {
      setLoadingPetHealth(false);
    }
  };

  const handleDeleteUserPet = async (petId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hồ sơ thú cưng này của khách hàng?')) return;
    const oldList = [...userPetsList];
    setUserPetsList(prev => prev.filter(p => p.id !== petId));
    try {
      const res = await fetch(`${API_BASE}/admin/user-pets/${petId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) {
        setUserPetsList(oldList);
        showNotification('Không thể xóa hồ sơ: ' + data.message, 'error');
        return;
      }
      showNotification('✅ Đã xóa hồ sơ thú cưng thành công!');
    } catch (err) {
      setUserPetsList(oldList);
      showNotification('Lỗi kết nối máy chủ: ' + err.message, 'error');
    }
  };

  // --- HÀNH ĐỘNG QUẢN LÝ THÚ CƯNG BÁN (CRUD & ĐA ẢNH) ---
  const handleOpenPetModal = (pet = null) => {
    setBulkPasteOpen(false);
    setBulkPasteText('');
    if (pet) {
      setEditingPet(pet);
      const petImages = Array.isArray(pet.images) && pet.images.length > 0 
        ? pet.images 
        : (pet.image_url ? [pet.image_url] : ['']);

      setPetForm({
        name: pet.name || '',
        species: pet.species || 'dog',
        breed: pet.breed || '',
        gender: pet.gender || 'male',
        age_months: pet.age_months || 2,
        color: pet.color || '',
        price: pet.price || '',
        deposit_amount: pet.deposit_amount || '',
        vaccination_status: pet.vaccination_status || 'Đã tiêm 2 mũi Vanguard 7 bệnh, sổ giun 2 lần',
        pedigree: pet.pedigree || 'Không giấy',
        health_warranty: pet.health_warranty || 'Bảo hành 15 ngày Care & Parvo, cam kết thuần chủng trọn đời',
        microchip_id: pet.microchip_id || '',
        images: petImages,
        image_url: petImages[0] || '',
        video_url: pet.video_url || '',
        description: pet.description || '',
        status: pet.status || 'available'
      });
    } else {
      setEditingPet(null);
      setPetForm({
        name: '',
        species: 'dog',
        breed: '',
        gender: 'male',
        age_months: 2,
        color: '',
        price: '',
        deposit_amount: '',
        vaccination_status: 'Đã tiêm 2 mũi Vanguard 7 bệnh, sổ giun 2 lần',
        pedigree: 'Không giấy',
        health_warranty: 'Bảo hành 15 ngày Care & Parvo, cam kết thuần chủng trọn đời',
        microchip_id: '',
        images: [''],
        image_url: '',
        video_url: '',
        description: '',
        status: 'available'
      });
    }
    setPetModalOpen(true);
  };

  const handleAddImageRow = () => {
    setPetForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleUpdateImage = (index, value) => {
    setPetForm(prev => {
      const nextImages = [...prev.images];
      nextImages[index] = value;
      return {
        ...prev,
        images: nextImages,
        image_url: nextImages.find(u => u && u.trim()) || ''
      };
    });
  };

  const handleRemoveImage = (index) => {
    setPetForm(prev => {
      let nextImages = prev.images.filter((_, i) => i !== index);
      if (nextImages.length === 0) nextImages = [''];
      return {
        ...prev,
        images: nextImages,
        image_url: nextImages.find(u => u && u.trim()) || ''
      };
    });
  };

  const handleSetCoverImage = (index) => {
    setPetForm(prev => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: [selected, ...rest],
        image_url: selected
      };
    });
  };

  const handleApplyBulkPaste = () => {
    if (!bulkPasteText.trim()) return;
    const urls = bulkPasteText
      .split(/[\n,;]+/)
      .map(s => s.trim())
      .filter(s => s.startsWith('http://') || s.startsWith('https://') || s.length > 20); // Drive ID hoặc URL
    if (urls.length === 0) {
      showNotification('Không tìm thấy link ảnh hợp lệ', 'error');
      return;
    }
    setPetForm(prev => {
      const existing = prev.images.filter(img => img && img.trim());
      const combined = Array.from(new Set([...existing, ...urls]));
      return {
        ...prev,
        images: combined.length > 0 ? combined : [''],
        image_url: combined[0] || ''
      };
    });
    setBulkPasteText('');
    setBulkPasteOpen(false);
    showNotification(`Đã thêm thành công ${urls.length} link ảnh vào bộ sưu tập!`);
  };

  const handleSavePet = async (e) => {
    e.preventDefault();
    if (!petForm.name || !petForm.price || !petForm.breed) {
      showNotification('Vui lòng điền Tên bé, Giống loài và Giá bán!', 'error');
      return;
    }

    try {
      const validImages = petForm.images
        .map(u => (u ? u.trim() : ''))
        .filter(u => u.length > 0);
      if (validImages.length === 0 && petForm.image_url.trim()) {
        validImages.push(petForm.image_url.trim());
      }

      const parsePrice = (v) => {
        if (!v) return 0;
        const cleaned = String(v).replace(/[^0-9]/g, '');
        return parseInt(cleaned, 10) || 0;
      };

      const payload = {
        name: petForm.name.trim(),
        species: petForm.species,
        breed: petForm.breed.trim(),
        gender: petForm.gender,
        age_months: parseInt(petForm.age_months, 10) || 2,
        color: petForm.color.trim(),
        price: parsePrice(petForm.price),
        deposit_amount: parsePrice(petForm.deposit_amount),
        vaccination_status: petForm.vaccination_status.trim(),
        pedigree: petForm.pedigree,
        health_warranty: petForm.health_warranty.trim(),
        microchip_id: petForm.microchip_id ? petForm.microchip_id.trim() : null,
        images: validImages,
        video_url: petForm.video_url.trim() || null,
        description: petForm.description.trim(),
        status: petForm.status
      };

      const url = editingPet 
        ? `${API_BASE}/admin/pet-sales/${editingPet.id}`
        : `${API_BASE}/admin/pet-sales`;
      const method = editingPet ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingPet 
            ? '✅ Đã cập nhật thông tin bé thú cưng thành công!' 
            : '🎉 Đã đăng bán bé thú cưng mới! Khách hàng sẽ thấy ngay tại trang Mua Thú Cưng.'
        );
        setPetModalOpen(false);
        if (data.data) {
          if (editingPet) {
            setPetsForSale(prev => prev.map(p => p.id === data.data.id ? data.data : p));
          } else {
            setPetsForSale(prev => [data.data, ...prev.filter(p => p.id !== data.data.id)]);
          }
        }
        fetchAllData();
      } else {
        showNotification(data.message || 'Lỗi khi lưu thông tin bé cưng', 'error');
      }
    } catch {
      showNotification('Không thể kết nối đến máy chủ', 'error');
    }
  };

  // --- HÀNH ĐỘNG QUẢN LÝ GIỐNG THÚ CƯNG (BREEDS) ---
  const handleOpenBreedModal = (breed = null) => {
    if (breed) {
      setEditingBreed(breed);
      setBreedForm({
        name: breed.name || '',
        species: breed.species || 'dog',
        origin: breed.origin || '',
        size_category: breed.size_category || 'medium',
        temperament: breed.temperament || '',
        is_active: breed.is_active !== false
      });
    } else {
      setEditingBreed(null);
      setBreedForm({
        name: '',
        species: breedSpeciesFilter !== 'all' ? breedSpeciesFilter : 'dog',
        origin: '',
        size_category: 'medium',
        temperament: '',
        is_active: true
      });
    }
    setBreedModalOpen(true);
  };

  const handleSaveBreed = async (e) => {
    e.preventDefault();
    if (!breedForm.name.trim()) {
      showNotification('Vui lòng nhập tên giống chó/mèo!', 'error');
      return;
    }

    try {
      const payload = {
        name: breedForm.name.trim(),
        species: breedForm.species,
        origin: breedForm.origin.trim(),
        size_category: breedForm.size_category,
        temperament: breedForm.temperament.trim(),
        is_active: breedForm.is_active
      };

      const url = editingBreed 
        ? `${API_BASE}/admin/breeds/${editingBreed.id}`
        : `${API_BASE}/admin/breeds`;
      const method = editingBreed ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingBreed 
            ? '✅ Đã cập nhật giống thú cưng thành công!' 
            : '🎉 Đã thêm giống thú cưng mới vào từ điển hệ thống!'
        );
        setBreedModalOpen(false);
        if (data.data) {
          if (editingBreed) {
            setBreeds(prev => prev.map(b => b.id === data.data.id ? data.data : b));
          } else {
            setBreeds(prev => [data.data, ...prev.filter(b => b.id !== data.data.id)]);
          }
        }
        fetchAllData();
      } else {
        showNotification(data.message || 'Lỗi khi lưu giống thú cưng', 'error');
      }
    } catch {
      showNotification('Không thể kết nối đến máy chủ', 'error');
    }
  };

  const handleToggleBreedActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/breeds/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message || 'Đã cập nhật trạng thái hiển thị');
        setBreeds(prev => prev.map(b => b.id === id ? { ...b, is_active: !currentStatus } : b));
        fetchAllData();
      } else {
        showNotification(data.message || 'Lỗi cập nhật trạng thái', 'error');
      }
    } catch {
      showNotification('Lỗi khi đổi trạng thái giống', 'error');
    }
  };

  const handleDeleteBreed = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa giống "${name}" khỏi từ điển không?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/breeds/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Đã xóa giống "${name}" thành công!`);
        setBreeds(prev => prev.filter(b => b.id !== id));
        fetchAllData();
      } else {
        showNotification(data.message || 'Lỗi khi xóa giống', 'error');
      }
    } catch {
      showNotification('Không thể kết nối đến máy chủ', 'error');
    }
  };

  const handleTogglePetStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/pet-sales/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message || 'Đã cập nhật trạng thái bé thú cưng');
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi đổi trạng thái bé cưng', 'error');
    }
  };

  const handleDeletePet = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bé "${name}" khỏi danh sách mở bán?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/pet-sales/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🗑️ Đã xóa bé cưng khỏi danh sách mở bán!');
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi xóa bé cưng', 'error');
    }
  };

  // --- HÀNH ĐỘNG QUẢN LÝ SẢN PHẨM (CRUD) ---
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name || '',
        brand: prod.brand || '',
        category_id: prod.category_id || 'c1',
        pet_type: prod.pet_type || 'all',
        reference_price: prod.reference_price || '',
        shopee_url: prod.shopee_url || '',
        tiktok_url: prod.tiktok_url || '',
        image_url: prod.images?.[0] || '',
        target_age: prod.target_age || 'Mọi lứa tuổi',
        target_needs: prod.target_needs || '',
        description: prod.description || '',
        ingredients: prod.ingredients || '',
        benefits: prod.benefits || '',
        usage_instructions: prod.usage_instructions || '',
        is_active: prod.is_active !== undefined ? prod.is_active : true
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        brand: '',
        category_id: categories[0]?.id || 'c1',
        pet_type: 'all',
        reference_price: '',
        shopee_url: '',
        tiktok_url: '',
        image_url: '',
        target_age: 'Mọi lứa tuổi',
        target_needs: '',
        description: '',
        ingredients: '',
        benefits: '',
        usage_instructions: '',
        is_active: true
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const parsePrice = (v) => {
        if (!v) return 0;
        const cleaned = String(v).replace(/[^0-9]/g, '');
        return parseInt(cleaned, 10) || 0;
      };

      const payload = {
        ...productForm,
        reference_price: parsePrice(productForm.reference_price),
        images: productForm.image_url ? [productForm.image_url] : []
      };

      const url = editingProduct 
        ? `${API_BASE}/admin/products/${editingProduct.id}`
        : `${API_BASE}/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingProduct 
            ? '✅ Đã cập nhật sản phẩm thành công! Khách hàng tại trang Cửa hàng sẽ thấy ngay thông tin mới.' 
            : '✅ Đã thêm sản phẩm mới vào hệ thống! Sản phẩm đã xuất hiện trên trang Cửa hàng của khách.'
        );
        setProductModalOpen(false);
        if (data.data) {
          if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === data.data.id ? data.data : p));
          } else {
            setProducts(prev => [data.data, ...prev.filter(p => p.id !== data.data.id)]);
          }
        }
        fetchAllData();
      } else {
        showNotification(data.message || 'Lỗi khi lưu sản phẩm', 'error');
      }
    } catch {
      showNotification('Không thể kết nối đến máy chủ', 'error');
    }
  };

  const handleToggleProductActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}/toggle-active`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          currentStatus 
            ? '👁️‍🗨️ Đã ẩn sản phẩm khỏi trang khách hàng.' 
            : '🌟 Đã hiển thị lại sản phẩm trên trang khách hàng.'
        );
        setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi đổi trạng thái hiển thị sản phẩm', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${name}" khỏi kho?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🗑️ Đã xóa sản phẩm khỏi hệ thống!');
        setProducts(prev => prev.filter(p => p.id !== id));
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi xóa sản phẩm', 'error');
    }
  };

  // --- HÀNH ĐỘNG QUẢN LÝ BLOG (CRUD) ---
  const handleOpenBlogModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title || '',
        category: blog.category || 'Kiến thức nuôi',
        target_pet_type: blog.target_pet_type || 'all',
        thumbnail_url: blog.thumbnail_url || '',
        youtube_url: blog.youtube_url || '',
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
        summary: blog.summary || '',
        content: blog.content || '',
        is_published: blog.is_published !== undefined ? blog.is_published : true
      });
    } else {
      setEditingBlog(null);
      setBlogForm({
        title: '',
        category: 'Kiến thức nuôi',
        target_pet_type: 'all',
        thumbnail_url: '',
        youtube_url: '',
        tags: '',
        summary: '',
        content: '',
        is_published: true
      });
    }
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()) : []
      };

      const url = editingBlog 
        ? `${API_BASE}/admin/blogs/${editingBlog.id}`
        : `${API_BASE}/admin/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingBlog 
            ? '✅ Đã cập nhật bài viết thành công! Khách hàng tại trang Cẩm nang sẽ thấy nội dung mới.' 
            : '✅ Đã đăng bài viết mới thành công! Khách hàng có thể đọc và xem video YouTube ngay lập tức.'
        );
        setBlogModalOpen(false);
        if (data.data) {
          if (editingBlog) {
            setBlogs(prev => prev.map(b => b.id === data.data.id ? data.data : b));
          } else {
            setBlogs(prev => [data.data, ...prev.filter(b => b.id !== data.data.id)]);
          }
        }
        fetchAllData();
      } else {
        showNotification(data.message || 'Lỗi khi lưu bài viết', 'error');
      }
    } catch {
      showNotification('Không thể kết nối đến máy chủ', 'error');
    }
  };

  const handleToggleBlogPublish = async (id, currentPublished) => {
    try {
      const res = await fetch(`${API_BASE}/admin/blogs/${id}/toggle-publish`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          currentPublished 
            ? '📝 Đã chuyển bài viết về dạng Bản nháp (khách hàng không thấy nữa).' 
            : '🚀 Đã xuất bản bài viết lên trang Cẩm nang của khách hàng!'
        );
        setBlogs(prev => prev.map(b => b.id === id ? { ...b, is_published: !currentPublished } : b));
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi đổi trạng thái bài viết', 'error');
    }
  };

  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🗑️ Đã xóa bài viết thành công!');
        setBlogs(prev => prev.filter(b => b.id !== id));
        fetchAllData();
      }
    } catch {
      showNotification('Lỗi khi xóa bài viết', 'error');
    }
  };

  // Test Discord Alert theo 3 mức độ màu sắc: Đỏ (Lỗi), Vàng (Cảnh báo), Xanh nước biển (Message)
  const handleTriggerDiscordAlert = async (level = 'error') => {
    const levelMeta = {
      error: { name: 'Lỗi Hệ Thống (Màu Đỏ 🔴)', bg: 'bg-rose-50 border-rose-200 text-rose-800' },
      warning: { name: 'Cảnh Báo (Màu Vàng 🟡)', bg: 'bg-amber-50 border-amber-200 text-amber-800' },
      message: { name: 'Thông Điệp / Message (Màu Xanh Nước Biển 🔵)', bg: 'bg-sky-50 border-sky-200 text-sky-800' }
    };
    const meta = levelMeta[level] || levelMeta.error;

    setDiscordAlertStatus({ text: `Đang gửi tín hiệu ${meta.name} sang Discord...`, bg: meta.bg });
    try {
      const res = await fetch(`${API_BASE}/errors/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          message: `[TEST PHÂN BIỆT MÀU SẮC] Thử nghiệm gửi ${meta.name} từ trang Quản Trị Pet Paw`,
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
      const data = await res.json();
      if (data.success) {
        setDiscordAlertStatus({
          text: `✅ Đã gửi thành công ${meta.name} sang kênh Discord bot! Hãy kiểm tra tin nhắn trong Discord.`,
          bg: meta.bg
        });
      }
    } catch {
      setDiscordAlertStatus({ text: 'Đã gửi thông báo sang Discord.', bg: meta.bg });
    }
  };

  // Cấu hình cột Thú Cưng Bán cho DataTable
  const petColumns = [
    {
      key: 'images',
      title: 'Ảnh bé',
      width: '70px',
      render: (val, row) => (
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
          <DriveImage src={val?.[0]} alt={row.name} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      key: 'name',
      title: 'Tên bé & Giống loài',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block leading-snug">{val}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
              row.species === 'cat' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' : 'bg-amber-50 text-amber-800 border border-amber-200/60'
            }`}>
              {row.species === 'cat' ? 'Mèo' : 'Chó'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{row.breed}</span>
          </div>
        </div>
      )
    },
    {
      key: 'gender',
      title: 'Giới tính & Tuổi',
      width: '130px',
      render: (_, row) => (
        <div className="text-xs">
          <span className={`font-bold ${row.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
            {row.gender === 'female' ? '♀ Bé Cái' : '♂ Bé Đực'}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">{row.age_months} tháng • {row.color || 'Màu tiêu chuẩn'}</p>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Giá bán & Cọc',
      width: '140px',
      render: (val, row) => (
        <div>
          <span className="font-black text-amber-600 text-xs block">{Number(val).toLocaleString('vi-VN')} đ</span>
          {row.deposit_amount > 0 ? (
            <span className="text-[10px] text-slate-400 font-medium">Cọc: {Number(row.deposit_amount).toLocaleString('vi-VN')} đ</span>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">Không yêu cầu cọc</span>
          )}
        </div>
      )
    },
    {
      key: 'vaccination_status',
      title: 'Sức khỏe & Phả hệ',
      width: '180px',
      render: (_, row) => (
        <div className="text-[11px] space-y-1">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
              {row.pedigree || 'Không giấy'}
            </span>
            {row.microchip_id && (
              <span className="px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-800 font-bold text-[10px] border border-sky-200" title={`Microchip: ${row.microchip_id}`}>
                Microchip
              </span>
            )}
          </div>
          <p className="text-slate-500 text-[10px] line-clamp-1" title={row.vaccination_status}>{row.vaccination_status}</p>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: '150px',
      render: (val, row) => {
        const statuses = [
          { id: 'available', label: '🟢 Đang tìm chủ' },
          { id: 'reserved', label: '🟡 Đã nhận cọc' },
          { id: 'sold', label: '⚪ Đã về nhà mới' }
        ];
        return (
          <select
            value={val || 'available'}
            onChange={(e) => handleTogglePetStatus(row.id, e.target.value)}
            className="text-[11px] font-bold py-1.5 px-2 rounded-xl bg-white border border-slate-200 shadow-2xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none cursor-pointer"
          >
            {statuses.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        );
      }
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '110px',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/buy-pets/${row.id}`}
            target="_blank"
            title="Xem chi tiết bé trên web khách"
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleOpenPetModal(row)}
            title="Chỉnh sửa thông tin bé"
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeletePet(row.id, row.name)}
            title="Xóa bé khỏi danh sách bán"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Cấu hình cột Sản phẩm cho DataTable
  const productColumns = [
    {
      key: 'images',
      title: 'Ảnh',
      width: '60px',
      render: (val, row) => (
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <DriveImage src={val?.[0]} alt={row.name} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      key: 'name',
      title: 'Tên sản phẩm & Thương hiệu',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block line-clamp-1">{val}</span>
          <span className="text-[11px] text-slate-400">{row.brand || 'Pet Paw'}</span>
        </div>
      )
    },
    {
      key: 'pet_type',
      title: 'Dành cho',
      width: '80px',
      render: (val) => (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
          {val === 'cat' ? 'Mèo' : val === 'dog' ? 'Chó' : 'Tất cả'}
        </span>
      )
    },
    {
      key: 'reference_price',
      title: 'Giá tham khảo',
      width: '120px',
      render: (val) => <span className="font-bold text-amber-600 text-xs">{Number(val).toLocaleString('vi-VN')} đ</span>
    },
    {
      key: 'is_active',
      title: 'Trạng thái Web khách',
      width: '130px',
      render: (val) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          val !== false 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>{val !== false ? 'Hiển thị' : 'Đang ẩn'}</span>
        </span>
      )
    },
    {
      key: 'links',
      title: 'Affiliate Links',
      width: '120px',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.shopee_url && (
            <a href={row.shopee_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#EE4D2D] font-bold hover:underline">
              Shopee
            </a>
          )}
          {row.tiktok_url && (
            <a href={row.tiktok_url} target="_blank" rel="noreferrer" className="text-[11px] text-slate-800 font-bold hover:underline">
              TikTok
            </a>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '140px',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenProductModal(row)}
            title="Chỉnh sửa sản phẩm"
            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleToggleProductActive(row.id, row.is_active !== false)}
            title={row.is_active !== false ? 'Ẩn khỏi web khách hàng' : 'Hiển thị lên web khách hàng'}
            className={`p-1.5 rounded-lg transition-colors ${
              row.is_active !== false 
                ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700' 
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            {row.is_active !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleDeleteProduct(row.id, row.name)}
            title="Xóa sản phẩm"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to={`/products/${row.slug}`}
            target="_blank"
            title="Xem trang hiển thị khách hàng"
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )
    }
  ];

  // Cấu hình cột Bài viết cho DataTable
  const blogColumns = [
    {
      key: 'thumbnail_url',
      title: 'Ảnh đại diện',
      width: '70px',
      render: (val, row) => (
        <div className="w-12 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <img src={val || '/Logo_Pet_Paw.jpg'} alt={row.title} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      key: 'title',
      title: 'Tiêu đề & Chuyên mục',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block line-clamp-1">{val}</span>
          <span className="text-[11px] text-amber-600 font-semibold">{row.category}</span>
        </div>
      )
    },
    {
      key: 'target_pet_type',
      title: 'Loài',
      width: '70px',
      render: (val) => (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
          {val === 'cat' ? 'Mèo' : val === 'dog' ? 'Chó' : 'Tất cả'}
        </span>
      )
    },
    {
      key: 'views_count',
      title: 'Lượt xem',
      width: '80px',
      render: (val) => <span className="font-semibold text-slate-600 text-xs">{val || 0}</span>
    },
    {
      key: 'is_published',
      title: 'Trạng thái Web khách',
      width: '130px',
      render: (val) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          val 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{val ? 'Đã xuất bản' : 'Bản nháp'}</span>
        </span>
      )
    },
    {
      key: 'youtube_url',
      title: 'Video YouTube',
      width: '110px',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-bold hover:underline">
          <Video className="w-3.5 h-3.5" />
          <span>Có Video</span>
        </a>
      ) : (
        <span className="text-[11px] text-slate-400">Không có</span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '140px',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenBlogModal(row)}
            title="Chỉnh sửa bài viết"
            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleToggleBlogPublish(row.id, row.is_published)}
            title={row.is_published ? 'Chuyển về Bản nháp (ẩn khỏi khách)' : 'Xuất bản bài viết cho khách hàng xem'}
            className={`p-1.5 rounded-lg transition-colors ${
              row.is_published 
                ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700' 
                : 'text-amber-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            {row.is_published ? <CheckCircle2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleDeleteBlog(row.id, row.title)}
            title="Xóa bài viết"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to={`/blogs/${row.slug}`}
            target="_blank"
            title="Xem trên trang Cẩm nang khách hàng"
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      )
    }
  ];

  // Cấu hình cột Giống Thú Cưng cho DataTable
  const breedColumns = [
    {
      key: 'name',
      title: 'Tên giống & Phân loài',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block leading-snug">{val}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
              row.species === 'cat' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' : 'bg-amber-50 text-amber-800 border border-amber-200/60'
            }`}>
              {row.species === 'cat' ? '🐱 Mèo' : '🐶 Chó'}
            </span>
            {row.origin && <span className="text-[11px] text-slate-400 font-medium">Nguồn gốc: {row.origin}</span>}
          </div>
        </div>
      )
    },
    {
      key: 'size_category',
      title: 'Kích thước vóc dáng',
      width: '140px',
      render: (val) => {
        const labels = {
          toy: 'Toy / Siêu nhỏ',
          small: 'Nhỏ (<10kg)',
          medium: 'Vừa (10-25kg)',
          large: 'Lớn (>25kg)'
        };
        return <span className="text-xs text-slate-600 font-medium">{labels[val] || val || 'Vừa'}</span>;
      }
    },
    {
      key: 'temperament',
      title: 'Tính cách đặc trưng',
      render: (val) => <span className="text-xs text-slate-500 line-clamp-2">{val || 'Chưa cập nhật'}</span>
    },
    {
      key: 'is_active',
      title: 'Trạng thái',
      width: '130px',
      render: (val, row) => (
        <button
          onClick={() => handleToggleBreedActive(row.id, val)}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
            val !== false 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
          }`}
          title="Nhấp để bật/tắt hiển thị trong gợi ý"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${val !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>{val !== false ? 'Kích hoạt' : 'Tạm ẩn'}</span>
        </button>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '100px',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenBreedModal(row)}
            title="Chỉnh sửa giống"
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteBreed(row.id, row.name)}
            title="Xóa giống"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Cấu hình cột Tài khoản & Phân quyền cho DataTable
  const userColumns = [
    {
      key: 'full_name',
      title: 'Tài khoản & Người dùng',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-extrabold text-sm shrink-0 overflow-hidden">
            {row.avatar_url ? (
              <img src={row.avatar_url} alt={row.full_name} className="w-full h-full object-cover" />
            ) : (
              (row.full_name || row.email || 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <span>{row.full_name || 'Chưa đặt tên'}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Vai trò & Phân quyền',
      render: (val, row) => {
        const roleLabels = {
          admin: { label: 'Quản trị viên (Admin)', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
          user: { label: 'Thành viên (User)', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
          guest: { label: 'Khách vãng lai (Guest)', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
        };
        const conf = roleLabels[val] || roleLabels.user;
        return (
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${conf.bg}`}>
              {conf.label}
            </span>
            <select
              value={val || 'user'}
              onChange={(e) => handleUpdateUserRole(row.id, e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 hover:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>
        );
      }
    },
    {
      key: 'is_active',
      title: 'Trạng thái tài khoản',
      width: '140px',
      render: (val, row) => (
        <button
          onClick={() => handleToggleUserStatus(row.id)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            val !== false
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
          }`}
          title="Bấm để khóa / mở khóa tài khoản"
        >
          {val !== false ? <CheckCircle2 className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{val !== false ? 'Hoạt động' : 'Đã khóa'}</span>
        </button>
      )
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      width: '120px',
      render: (val) => (
        <span className="text-xs text-slate-500 font-medium">
          {val ? new Date(val).toLocaleDateString('vi-VN') : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '100px',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenUserModal(row)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title="Chỉnh sửa thông tin"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Xóa tài khoản"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Cấu hình cột Hồ sơ Thú cưng Khách hàng cho DataTable
  const userPetColumns = [
    {
      key: 'name',
      title: 'Thú cưng',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-extrabold text-sm shrink-0 overflow-hidden">
            {row.avatar_url ? (
              <DriveImage src={row.avatar_url} alt={val} className="w-full h-full object-cover" />
            ) : (
              <PawPrint className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <span>{val}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-semibold">
                {row.gender === 'male' ? 'Đực' : row.gender === 'female' ? 'Cái' : 'Chưa rõ'}
              </span>
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
              {row.species === 'cat' ? '🐱 Mèo' : '🐶 Chó'} • {row.breed}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'owner',
      title: 'Chủ sở hữu (Khách hàng)',
      render: (_, row) => (
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-slate-800">{row.owner_name || 'Khách hàng'}</div>
          <div className="text-[11px] text-slate-400">{row.owner_email || '—'}</div>
        </div>
      )
    },
    {
      key: 'age_weight',
      title: 'Tuổi & Cân nặng',
      render: (_, row) => (
        <div className="space-y-0.5 text-xs">
          <div className="text-slate-600 font-medium">
            {row.age_months ? `${row.age_months} tháng tuổi` : 'Chưa rõ tuổi'}
          </div>
          <div className="font-bold text-amber-600">
            {row.latest_weight ? `${row.latest_weight} kg` : (row.initial_weight ? `${row.initial_weight} kg` : '—')}
          </div>
        </div>
      )
    },
    {
      key: 'health_records_count',
      title: 'Số lần đo thể trạng',
      width: '150px',
      render: (val) => (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
          {val || 0} lần ghi nhận
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'Ngày tạo hồ sơ',
      width: '130px',
      render: (val) => (
        <span className="text-xs text-slate-500 font-medium">
          {val ? new Date(val).toLocaleDateString('vi-VN') : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '100px',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleViewPetHealth(row)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title="Xem chi tiết thể trạng & chỉ số"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUserPet(row.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Xóa hồ sơ thú cưng"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Cấu hình cột Bệnh viện & Tiệm Spa cho DataTable
  const locationColumns = [
    {
      key: 'name',
      title: 'Cơ sở & Phân loại',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-extrabold text-sm shrink-0 overflow-hidden">
            {row.image_url ? (
              <DriveImage src={row.image_url} alt={val} className="w-full h-full object-cover" />
            ) : row.type === 'clinic' ? (
              <Stethoscope className="w-5 h-5 text-rose-500" />
            ) : (
              <Scissors className="w-5 h-5 text-teal-500" />
            )}
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <span>{val}</span>
              {(row.emergency_24h || row.emergency24h) && (
                <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded-md animate-pulse">
                  24/7
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
              <span className={`px-2 py-0.2 rounded-md font-extrabold text-[10px] ${
                row.type === 'clinic' ? 'bg-rose-50 text-rose-700' : 'bg-teal-50 text-teal-700'
              }`}>
                {row.type === 'clinic' ? '🏥 Phòng khám thú y' : '✂️ Spa & Grooming'}
              </span>
              <span>•</span>
              <span className="font-medium text-slate-400">{row.district || row.city || 'Hà Nội'}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'address',
      title: 'Địa chỉ & Hotline',
      render: (val, row) => (
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-slate-700 line-clamp-1">{val || 'Chưa cập nhật'}</div>
          <div className="text-[11px] font-bold text-amber-700">{row.phone || 'Chưa có SĐT'}</div>
        </div>
      )
    },
    {
      key: 'rating',
      title: 'Đánh giá',
      width: '120px',
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{val || 5.0}</span>
          </div>
          <span className="text-[11px] text-slate-400">({row.reviews_count ?? row.reviewsCount ?? 0})</span>
        </div>
      )
    },
    {
      key: 'services',
      title: 'Dịch vụ tiêu biểu',
      render: (val) => {
        const servList = Array.isArray(val)
          ? val
          : (typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : []);
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {servList.slice(0, 3).map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                {s}
              </span>
            ))}
            {servList.length > 3 && (
              <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold">
                +{servList.length - 3}
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'is_active',
      title: 'Trạng thái Web khách',
      width: '130px',
      render: (val, row) => (
        <button
          onClick={() => handleToggleLocationActive(row.id)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            val !== false
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
          }`}
          title="Bấm để ẩn / hiện trên trang khách"
        >
          {val !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{val !== false ? 'Hiển thị' : 'Tạm ẩn'}</span>
        </button>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '100px',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenLocationModal(row)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title="Chỉnh sửa cơ sở"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteLocation(row.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Xóa cơ sở"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const clickData = [
    { name: 'Shopee', clicks: stats?.summary?.shopeeClicks ?? 0, fill: '#EE4D2D' },
    { name: 'TikTok Shop', clicks: stats?.summary?.tiktokClicks ?? 0, fill: '#1e293b' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <span>Khu Vực Quản Trị Hệ Thống (Admin Portal)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý tập trung các sản phẩm, bài viết và cấu hình hiển thị trực tiếp đến khách hàng của Pet Paw
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAllData}
            title="Làm mới dữ liệu"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Đồng bộ dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Thông báo tương tác (Feedback Banner) */}
      {feedbackMessage.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in ${
          feedbackMessage.type === 'error' 
            ? 'bg-rose-50 border border-rose-200 text-rose-800' 
            : feedbackMessage.type === 'info'
            ? 'bg-sky-50 border border-sky-200 text-sky-800'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex flex-wrap items-center gap-2.5">
            <span>{feedbackMessage.text}</span>
            {feedbackMessage.text.includes('Phiên đăng nhập') && (
              <button
                type="button"
                onClick={handleReLoginAdmin}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-extrabold shadow-sm cursor-pointer transition-all active:scale-95"
              >
                Đăng nhập lại Admin
              </button>
            )}
          </div>
          <button onClick={() => setFeedbackMessage({ type: '', text: '' })} className="underline text-xs ml-4 cursor-pointer shrink-0">
            Đóng
          </button>
        </div>
      )}


      {/* --- TAB PHÂN QUYỀN & QUẢN LÝ TÀI KHOẢN --- */}
      {currentTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <span>Phân Quyền & Quản Lý Tài Khoản (User & Role RBAC)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý danh sách tài khoản, phân quyền linh hoạt (Admin / User / Guest) và kiểm soát trạng thái kích hoạt trực tiếp từ hệ thống.
              </p>
            </div>
            
            <button
              onClick={() => handleOpenUserModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm tài khoản mới</span>
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Vai trò:</span>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'admin', label: '👑 Quản trị viên' },
                { id: 'user', label: '👤 Thành viên' },
                { id: 'guest', label: '🌐 Khách vãng lai' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setUserRoleFilter(f.id);
                    setUserPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    userRoleFilter === f.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                placeholder="Tìm theo email, họ tên..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <DataTable
            columns={userColumns}
            data={paginatedUsers}
            isLoading={loading}
            emptyMessage="Không tìm thấy tài khoản người dùng nào."
            pagination={{
              currentPage: userPage,
              totalPages: Math.ceil(filteredUsers.length / userLimit) || 1,
              totalItems: filteredUsers.length,
              limit: userLimit,
              onPageChange: (p) => setUserPage(p),
              onLimitChange: (l) => {
                setUserLimit(l);
                setUserPage(1);
              }
            }}
          />
        </div>
      )}

      {/* --- TAB HỒ SƠ THÚ CƯNG KHÁCH HÀNG & THỂ TRẠNG --- */}
      {currentTab === 'user-pets' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-amber-500" />
                <span>Quản Lý Hồ Sơ Thú Cưng & Thể Trạng Khách Hàng</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm soát toàn bộ hồ sơ thú cưng được khách hàng tạo, theo dõi lịch sử đo chỉ số cân nặng, thể trạng BCS và cảnh báo sức khỏe.
              </p>
            </div>
            
            <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 text-amber-900 rounded-xl text-xs font-bold self-start sm:self-auto">
              🐾 Tổng cộng: <span className="font-extrabold">{userPetsList.length}</span> hồ sơ
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Loài:</span>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'dog', label: '🐶 Chó' },
                { id: 'cat', label: '🐱 Mèo' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setUserPetSpeciesFilter(f.id);
                    setUserPetPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    userPetSpeciesFilter === f.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userPetSearch}
                onChange={(e) => {
                  setUserPetSearch(e.target.value);
                  setUserPetPage(1);
                }}
                placeholder="Tìm tên bé, giống, chủ nuôi..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <DataTable
            columns={userPetColumns}
            data={paginatedUserPets}
            isLoading={loading}
            emptyMessage="Không tìm thấy hồ sơ thú cưng nào của khách hàng."
            pagination={{
              currentPage: userPetPage,
              totalPages: Math.ceil(filteredUserPets.length / userPetLimit) || 1,
              totalItems: filteredUserPets.length,
              limit: userPetLimit,
              onPageChange: (p) => setUserPetPage(p),
              onLimitChange: (l) => {
                setUserPetLimit(l);
                setUserPetPage(1);
              }
            }}
          />
        </div>
      )}

      {/* --- TAB BỆNH VIỆN THÚ Y & TIỆM SPA --- */}
      {currentTab === 'locations' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-amber-500" />
                <span>Quản Lý Bệnh Viện Thú Y & Tiệm Spa Grooming</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý các bệnh viện thú y cấp cứu 24/7 và cơ sở spa, grooming hiển thị trực tiếp trên trang khách hàng (/nearby).
              </p>
            </div>
            
            <button
              onClick={() => handleOpenLocationModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm cơ sở mới</span>
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Phân loại:</span>
              {[
                { id: 'all', label: 'Tất cả cơ sở' },
                { id: 'clinic', label: '🏥 Bệnh viện / Phòng khám' },
                { id: 'spa', label: '✂️ Tiệm Spa & Grooming' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setLocationTypeFilter(f.id);
                    setLocationPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    locationTypeFilter === f.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => {
                  setLocationSearch(e.target.value);
                  setLocationPage(1);
                }}
                placeholder="Tìm tên cơ sở, địa chỉ, hotline..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <DataTable
            columns={locationColumns}
            data={paginatedLocations}
            isLoading={loading}
            emptyMessage="Không tìm thấy cơ sở thú y hoặc spa nào phù hợp."
            pagination={{
              currentPage: locationPage,
              totalPages: Math.ceil(filteredLocations.length / locationLimit) || 1,
              totalItems: filteredLocations.length,
              limit: locationLimit,
              onPageChange: (p) => setLocationPage(p),
              onLimitChange: (l) => {
                setLocationLimit(l);
                setLocationPage(1);
              }
            }}
          />
        </div>
      )}

      {/* --- TAB 1: TỔNG QUAN HỆ THỐNG --- */}
      {currentTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* 5 Cards thống kê chính */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs flex items-center gap-4 bg-gradient-to-br from-white to-amber-50/50">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <PawPrint className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Bé thú cưng mở bán</span>
                <h3 className="text-2xl font-black text-slate-900">{petsForSale.length} bé</h3>
                <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                  {petsForSale.filter(p => p.status === 'available').length} đang tìm chủ
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Người dùng đăng ký</span>
                <h3 className="text-2xl font-black text-slate-900">{stats?.summary?.totalUsers ?? 0}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Hồ sơ cá nhân nuôi</span>
                <h3 className="text-2xl font-black text-slate-900">{stats?.summary?.totalPets ?? 0}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Sản phẩm phụ kiện</span>
                <h3 className="text-2xl font-black text-slate-900">{products.length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Lượt click Affiliate</span>
                <h3 className="text-2xl font-black text-slate-900">{stats?.summary?.totalAffiliateClicks ?? 0}</h3>
              </div>
            </div>
          </div>

          {/* Biểu đồ thống kê chuyển đổi click Shopee vs TikTok Shop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Thống kê lượt click chuyển đổi theo Nền tảng (Shopee vs. TikTok Shop)
                </h2>
                <span className="text-[11px] text-slate-400">Tự động tích lũy</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clickData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="clicks" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">Tác vụ Quản trị Nhanh</h2>
              <div className="space-y-2.5 text-xs">
                <button
                  onClick={() => {
                    setSearchParams({ tab: 'pet-sales' });
                    handleOpenPetModal();
                  }}
                  className="w-full p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center justify-between shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PawPrint className="w-4 h-4 text-slate-950" />
                    <span>Đăng bán thú cưng mới</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-950 bg-amber-400/80 px-2 py-0.5 rounded-lg uppercase">Cốt lõi web</span>
                </button>

                <button
                  onClick={() => {
                    setSearchParams({ tab: 'products' });
                    handleOpenProductModal();
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-between border border-slate-200/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-slate-600" />
                    <span>Thêm sản phẩm phụ kiện</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">Shopee / TikTok</span>
                </button>

                <button
                  onClick={() => {
                    setSearchParams({ tab: 'blogs' });
                    handleOpenBlogModal();
                  }}
                  className="w-full p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold flex items-center justify-between border border-sky-200/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Đăng bài cẩm nang & Video</span>
                  </span>
                  <span className="text-[11px] font-normal text-sky-700">Xuất bản tức thì</span>
                </button>

                <Link
                  to="/buy-pets"
                  target="_blank"
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-between border border-slate-200/60 transition-colors block"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>Xem Trang Mua Thú Cưng</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Mở tab mới</span>
                </Link>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium leading-relaxed">
                Mọi thao tác Đăng thú cưng, Sửa giá, Cập nhật trạng thái cọc hoặc bán đều đồng bộ ngay lập tức tới trang của người dùng.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: QUẢN LÝ THÚ CƯNG BÁN (PET SALES CỐT LÕI) --- */}
      {currentTab === 'pet-sales' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-amber-500" />
                <span>Kho Thú Cưng Mở Bán (Chó Mèo Cảnh Thuần Chủng)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nghiệp vụ cốt lõi Pet Paw: Quản lý danh sách các bé cún, bé mèo cảnh thuần chủng đang tìm chủ, cập nhật sổ tiêm và trạng thái cọc / bàn giao.
              </p>
            </div>
            
            <button
              onClick={() => handleOpenPetModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng bán thú cưng mới</span>
            </button>
          </div>

          <DataTable
            columns={petColumns}
            data={paginatedPetsForSale}
            isLoading={loading}
            emptyMessage="Chưa có bé thú cưng nào được đăng bán. Bấm '+ Đăng bán thú cưng mới' để thêm bé cưng đầu tiên."
            pagination={{
              currentPage: petSalePage,
              totalPages: Math.ceil(petsForSale.length / petSaleLimit) || 1,
              totalItems: petsForSale.length,
              limit: petSaleLimit,
              onPageChange: (p) => setPetSalePage(p),
              onLimitChange: (l) => {
                setPetSaleLimit(l);
                setPetSalePage(1);
              }
            }}
          />
        </div>
      )}

      {/* --- TAB: QUẢN LÝ GIỐNG CHÓ & MÈO (BREEDS CATALOG) --- */}
      {currentTab === 'breeds' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Từ Điển Giống Chó & Mèo Cảnh (Pet Breeds Catalog)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý danh sách các giống chó và mèo thuần chủng để phục vụ chọn nhanh khi đăng bán thú cưng và gợi ý giống phù hợp cho khách hàng.
              </p>
            </div>
            
            <button
              onClick={() => handleOpenBreedModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm giống mới</span>
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 mr-1">Phân loại:</span>
              {[
                { id: 'all', label: 'Tất cả giống' },
                { id: 'dog', label: '🐶 Chó cảnh' },
                { id: 'cat', label: '🐱 Mèo cảnh' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setBreedSpeciesFilter(f.id);
                    setBreedPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    breedSpeciesFilter === f.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={breedSearch}
                onChange={(e) => {
                  setBreedSearch(e.target.value);
                  setBreedPage(1);
                }}
                placeholder="Tìm tên giống, tính cách, nguồn gốc..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <DataTable
            columns={breedColumns}
            data={paginatedBreeds}
            isLoading={loading}
            emptyMessage="Không tìm thấy giống thú cưng nào phù hợp với bộ lọc."
            pagination={{
              currentPage: breedPage,
              totalPages: Math.ceil(filteredBreeds.length / breedLimit) || 1,
              totalItems: filteredBreeds.length,
              limit: breedLimit,
              onPageChange: (p) => setBreedPage(p),
              onLimitChange: (l) => {
                setBreedLimit(l);
                setBreedPage(1);
              }
            }}
          />
        </div>
      )}

      {/* --- TAB 2: QUẢN LÝ SẢN PHẨM AFFILIATE --- */}
      {currentTab === 'products' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Kho Sản Phẩm & Liên Kết Affiliate
              </h2>
              <p className="text-xs text-slate-500">
                Quản lý các mặt hàng hiển thị tại trang Cửa hàng (`/products`) của khách hàng.
              </p>
            </div>
            
            <button
              onClick={() => handleOpenProductModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm sản phẩm mới</span>
            </button>
          </div>

          <DataTable
            columns={productColumns}
            data={paginatedProducts}
            isLoading={loading}
            emptyMessage="Chưa có sản phẩm nào trong kho"
            pagination={{
              currentPage: productPage,
              totalPages: Math.ceil(products.length / productLimit) || 1,
              totalItems: products.length,
              limit: productLimit,
              onPageChange: (p) => setProductPage(p),
              onLimitChange: (l) => {
                setProductLimit(l);
                setProductPage(1);
              }
            }}
          />
        </div>
      )}

      {/* --- TAB 3: QUẢN LÝ CẨM NANG BLOG & VIDEO --- */}
      {currentTab === 'blogs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Quản Lý Bài Viết Cẩm Nang & Nhúng Video YouTube
              </h2>
              <p className="text-xs text-slate-500">
                Tạo và chỉnh sửa bài viết hướng dẫn chăm sóc, video YouTube hiển thị tại trang Cẩm nang (`/blogs`) của khách hàng.
              </p>
            </div>
            
            <button
              onClick={() => handleOpenBlogModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Viết bài mới</span>
            </button>
          </div>

          <DataTable
            columns={blogColumns}
            data={paginatedBlogs}
            isLoading={loading}
            emptyMessage="Chưa có bài viết nào"
            pagination={{
              currentPage: blogPage,
              totalPages: Math.ceil(blogs.length / blogLimit) || 1,
              totalItems: blogs.length,
              limit: blogLimit,
              onPageChange: (p) => setBlogPage(p),
              onLimitChange: (l) => {
                setBlogLimit(l);
                setBlogPage(1);
              }
            }}
          />
        </div>
      )}


      {/* --- TAB 4: GIÁM SÁT HỆ THỐNG & DISCORD ALERT --- */}
      {currentTab === 'discord' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            
            {/* Header tab */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Hệ Thống Giám Sát & Phân Loại Cảnh Báo Discord Thời Gian Thực</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mọi sự cố hoặc thông điệp đều được tự động phân loại màu sắc và gửi ngay tức thì về kênh Discord quản trị viên.
                </p>
              </div>

              {/* 3 Nút kích hoạt theo đúng 3 màu: Đỏ (Lỗi), Vàng (Cảnh báo), Xanh nước biển (Message) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleTriggerDiscordAlert('error')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                  title="Gửi thử nghiệm lỗi màu đỏ"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>1. Lỗi (Màu Đỏ 🔴)</span>
                </button>

                <button
                  onClick={() => handleTriggerDiscordAlert('warning')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                  title="Gửi thử nghiệm cảnh báo màu vàng"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>2. Cảnh Báo (Màu Vàng 🟡)</span>
                </button>

                <button
                  onClick={() => handleTriggerDiscordAlert('message')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                  title="Gửi thử nghiệm tin nhắn màu xanh nước biển"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>3. Mess (Xanh Nước Biển 🔵)</span>
                </button>
              </div>
            </div>

            {/* Thông báo trạng thái gửi thử nghiệm */}
            {discordAlertStatus && (
              <div className={`p-4 border rounded-2xl text-xs font-bold animate-fade-in flex items-center justify-between shadow-xs ${
                typeof discordAlertStatus === 'object' ? discordAlertStatus.bg : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <span>{typeof discordAlertStatus === 'object' ? discordAlertStatus.text : discordAlertStatus}</span>
                <button onClick={() => setDiscordAlertStatus(null)} className="text-xs underline ml-4 cursor-pointer">Đóng</button>
              </div>
            )}

            {/* 3 Thẻ giải thích chuẩn 3 màu sắc */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Thẻ 1: Lỗi - Màu Đỏ */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
                    1. Lỗi Hệ Thống (Màu Đỏ)
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Áp dụng khi xảy ra ngoại lệ nghiêm trọng: lỗi 500, lỗi crash server, lỗi cú pháp hoặc ngoại lệ chưa bắt được ở React component.
                </p>
                <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                  Mã màu Discord: #ED4245
                </span>
              </div>

              {/* Thẻ 2: Cảnh báo - Màu Vàng */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                    2. Cảnh Báo (Màu Vàng)
                  </span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Áp dụng cho các trường hợp dữ liệu bất thường, cảnh báo sắp hết hạn, lỗi xác thực 401/403 hoặc yêu cầu kiểm tra nội bộ.
                </p>
                <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                  Mã màu Discord: #FEE75C
                </span>
              </div>

              {/* Thẻ 3: Tin nhắn - Màu Xanh Nước Biển */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
                  <span className="text-xs font-extrabold text-sky-900 uppercase tracking-wider">
                    3. Mess / Tin Nhắn (Xanh Nước Biển)
                  </span>
                </div>
                <p className="text-[11px] text-sky-700 leading-relaxed">
                  Áp dụng cho thông báo sự kiện, tin nhắn hệ thống, khởi động dịch vụ, đồng bộ dữ liệu hoặc cập nhật hoạt động người dùng.
                </p>
                <span className="inline-block px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[10px] font-bold">
                  Mã màu Discord: #00A8FC
                </span>
              </div>
            </div>

            {/* Trạng thái kết nối dịch vụ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Cơ Sở Dữ Liệu Hệ Thống:</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Đã kết nối bảo mật</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Thông tin kết nối được lưu trữ an toàn trong biến môi trường máy chủ (.env) và được bảo vệ theo tiêu chuẩn bảo mật nội bộ.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Hệ Thống Cảnh Báo Discord Bot:</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Webhook sẵn sàng hoạt động</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tự động phát hiện ngoại lệ và gửi cảnh báo tới kênh quản trị viên riêng tư, thông tin kênh và webhook được bảo mật tuyệt đối.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL ĐĂNG / SỬA THÚ CƯNG MỞ BÁN --- */}
      <Modal
        isOpen={petModalOpen}
        onClose={() => setPetModalOpen(false)}
        title={editingPet ? 'Chỉnh Sửa Thông Tin Bé Thú Cưng' : 'Đăng Bán Bé Thú Cưng Mới'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSavePet} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Tên gọi thân mật của bé <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={petForm.name}
                onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                placeholder="VD: Bé Corgi Pembroke Vàng Trắng Mặt Cười"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Loài thú cưng</label>
              <select
                value={petForm.species}
                onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="dog">🐶 Chó cảnh</option>
                <option value="cat">🐱 Mèo cảnh</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Giống loài cụ thể <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                species={petForm.species}
                value={petForm.breed}
                onChange={(val) => setPetForm({ ...petForm, breed: val })}
                placeholder="Tìm kiếm và chọn giống thú cưng..."
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Giới tính</label>
              <select
                value={petForm.gender}
                onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="male">♂ Bé Đực</option>
                <option value="female">♀ Bé Cái</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Độ tuổi (Tháng tuổi)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={petForm.age_months}
                onChange={(e) => setPetForm({ ...petForm, age_months: e.target.value })}
                placeholder="VD: 2"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Màu sắc lông</label>
              <input
                type="text"
                value={petForm.color}
                onChange={(e) => setPetForm({ ...petForm, color: e.target.value })}
                placeholder="VD: Vàng trắng, Bicolor, Nâu đỏ, Silver Shaded..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Giá bán chính thức (VNĐ) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={petForm.price}
                onChange={(e) => setPetForm({ ...petForm, price: e.target.value })}
                placeholder="VD: 12500000 hoặc 12.500.000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Số tiền đặt cọc giữ chỗ (VNĐ)</label>
              <input
                type="text"
                inputMode="numeric"
                value={petForm.deposit_amount}
                onChange={(e) => setPetForm({ ...petForm, deposit_amount: e.target.value })}
                placeholder="VD: 2000000 hoặc 2.000.000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Giấy chứng nhận phả hệ</label>
              <select
                value={petForm.pedigree}
                onChange={(e) => setPetForm({ ...petForm, pedigree: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="Không giấy">Không giấy (Thuần chủng không phả)</option>
                <option value="VKA">VKA (Hiệp hội Chó giống Việt Nam)</option>
                <option value="WCF">WCF (Hiệp hội Mèo thế giới)</option>
                <option value="TICA">TICA (The International Cat Association)</option>
                <option value="FCI">FCI (Liên đoàn Nuôi chó Quốc tế)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mã vi mạch Microchip (Nếu có)</label>
              <input
                type="text"
                value={petForm.microchip_id}
                onChange={(e) => setPetForm({ ...petForm, microchip_id: e.target.value })}
                placeholder="VD: MC-98514100234"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Trạng thái mở bán</label>
              <select
                value={petForm.status}
                onChange={(e) => setPetForm({ ...petForm, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="available">🟢 Đang tìm chủ (Available)</option>
                <option value="reserved">🟡 Đã nhận cọc (Reserved)</option>
                <option value="sold">⚪ Đã về nhà mới (Sold)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Tình trạng tiêm chủng & Sổ giun</label>
              <input
                type="text"
                value={petForm.vaccination_status}
                onChange={(e) => setPetForm({ ...petForm, vaccination_status: e.target.value })}
                placeholder="VD: Đã tiêm 2 mũi Vanguard 7 bệnh, sổ giun 2 lần"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Chính sách cam kết bảo hành sức khỏe</label>
              <input
                type="text"
                value={petForm.health_warranty}
                onChange={(e) => setPetForm({ ...petForm, health_warranty: e.target.value })}
                placeholder="VD: Bảo hành 30 ngày Care & Parvo, hỗ trợ bác sĩ thú y trọn đời"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            {/* Tải ảnh lên trực tiếp (Multer -> Sharp WebP -> Cloudflare R2) */}
            <div className="sm:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
              <ImageUploader
                images={petForm.images}
                onChange={(newImages) => setPetForm({ ...petForm, images: newImages })}
                multiple={true}
                maxFiles={10}
                folder="pets"
                label="Bộ sưu tập ảnh bé cưng (Tự động nén WebP ~90% & Lưu Cloudflare R2)"
              />

              {/* Tùy chọn dự phòng: Nhập link ảnh thủ công nếu có */}
              <div className="pt-2 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setBulkPasteOpen(!bulkPasteOpen)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-amber-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{bulkPasteOpen ? '▲ Đóng công cụ dán link thủ công' : '▼ Bạn có sẵn link ảnh ngoài? Nhấn để dán thủ công'}</span>
                </button>

                {bulkPasteOpen && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-amber-200/80 shadow-xs space-y-2 animate-fade-in">
                    <span className="font-bold text-amber-900 text-[11px] block">
                      Dán danh sách link ảnh (mỗi dòng 1 link hoặc phân cách bởi dấu phẩy):
                    </span>
                    <textarea
                      rows={3}
                      value={bulkPasteText}
                      onChange={(e) => setBulkPasteText(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setBulkPasteOpen(false)}
                        className="px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyBulkPaste}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Áp dụng link ảnh
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Link video chơi đùa thực tế (YouTube / CDN)</label>
              <input
                type="url"
                value={petForm.video_url}
                onChange={(e) => setPetForm({ ...petForm, video_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Mô tả đặc điểm tính cách & thói quen</label>
              <textarea
                rows={3}
                value={petForm.description}
                onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
                placeholder="Mô tả độ quấn chủ, thói quen ăn uống, khả năng đi vệ sinh đúng chỗ của bé..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setPetModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {editingPet ? 'Lưu cập nhật bé' : 'Đăng bán bé ngay'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL THÊM / SỬA GIỐNG THÚ CƯNG --- */}
      <Modal
        isOpen={breedModalOpen}
        onClose={() => setBreedModalOpen(false)}
        title={editingBreed ? 'Chỉnh Sửa Giống Thú Cưng' : 'Thêm Giống Thú Cưng Mới'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveBreed} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tên giống thú cưng <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={breedForm.name}
              onChange={(e) => setBreedForm({ ...breedForm, name: e.target.value })}
              placeholder="VD: Corgi Pembroke, Mèo Ragdoll, Golden Retriever..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Loài</label>
              <select
                value={breedForm.species}
                onChange={(e) => setBreedForm({ ...breedForm, species: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="dog">🐶 Chó cảnh</option>
                <option value="cat">🐱 Mèo cảnh</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Vóc dáng / Kích thước</label>
              <select
                value={breedForm.size_category}
                onChange={(e) => setBreedForm({ ...breedForm, size_category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="toy">Toy / Siêu nhỏ</option>
                <option value="small">Nhỏ (&lt;10kg)</option>
                <option value="medium">Vừa (10-25kg)</option>
                <option value="large">Lớn (&gt;25kg)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Nguồn gốc xuất xứ</label>
            <input
              type="text"
              value={breedForm.origin}
              onChange={(e) => setBreedForm({ ...breedForm, origin: e.target.value })}
              placeholder="VD: Xứ Wales (Vương quốc Anh), Scotland, Nga, Pháp..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tính cách & Đặc điểm nhận dạng</label>
            <textarea
              rows={2}
              value={breedForm.temperament}
              onChange={(e) => setBreedForm({ ...breedForm, temperament: e.target.value })}
              placeholder="VD: Thông minh, năng động, thân thiện với trẻ nhỏ, chân ngắn mông tim..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none"
            />
          </div>


          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="breed_is_active"
              checked={breedForm.is_active}
              onChange={(e) => setBreedForm({ ...breedForm, is_active: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <label htmlFor="breed_is_active" className="font-bold text-slate-700 cursor-pointer">
              Kích hoạt và cho phép chọn trong hệ thống
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setBreedModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md shadow-amber-500/20 cursor-pointer transition-all"
            >
              {editingBreed ? 'Cập nhật' : 'Thêm giống'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL THÊM / SỬA SẢN PHẨM --- */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới Vào Hệ Thống'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="VD: Hạt Royal Canin British Shorthair..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Thương hiệu</label>
              <input
                type="text"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                placeholder="VD: Royal Canin, Me-O, SmartHeart..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Danh mục</label>
              <select
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dành cho loài</label>
              <select
                value={productForm.pet_type}
                onChange={(e) => setProductForm({ ...productForm, pet_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="all">Tất cả (Chó & Mèo)</option>
                <option value="cat">Mèo</option>
                <option value="dog">Chó</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Giá tham khảo (VNĐ)</label>
              <input
                type="text"
                inputMode="numeric"
                value={productForm.reference_price}
                onChange={(e) => setProductForm({ ...productForm, reference_price: e.target.value })}
                placeholder="VD: 255000 hoặc 255.000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Link Affiliate Shopee</label>
              <input
                type="url"
                value={productForm.shopee_url}
                onChange={(e) => setProductForm({ ...productForm, shopee_url: e.target.value })}
                placeholder="https://shopee.vn/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Link Affiliate TikTok Shop</label>
              <input
                type="url"
                value={productForm.tiktok_url}
                onChange={(e) => setProductForm({ ...productForm, tiktok_url: e.target.value })}
                placeholder="https://www.tiktok.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              images={productForm.image_url}
              onChange={(url) => setProductForm({ ...productForm, image_url: url })}
              multiple={false}
              folder="products"
              label="Ảnh sản phẩm (Tự động nén WebP ~90% & Lưu Cloudflare R2)"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mô tả sản phẩm</label>
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Mô tả công dụng, đối tượng sử dụng..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="product_is_active"
              checked={productForm.is_active}
              onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <label htmlFor="product_is_active" className="font-bold text-slate-800 cursor-pointer">
              Kích hoạt hiển thị ngay trên website khách hàng (Cửa hàng)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setProductModalOpen(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm mới'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL THÊM / SỬA BÀI VIẾT BLOG --- */}
      <Modal
        isOpen={blogModalOpen}
        onClose={() => setBlogModalOpen(false)}
        title={editingBlog ? 'Chỉnh Sửa Bài Viết Cẩm Nang' : 'Tạo Bài Viết Cẩm Nang Mới'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Tiêu đề bài viết *</label>
            <input
              type="text"
              required
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              placeholder="VD: Top 5 Giống Chó Thông Minh Nhất..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Chuyên mục</label>
              <input
                type="text"
                value={blogForm.category}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                placeholder="VD: Sức khỏe & Dinh dưỡng, Kiến thức chọn giống..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dành cho loài</label>
              <select
                value={blogForm.target_pet_type}
                onChange={(e) => setBlogForm({ ...blogForm, target_pet_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="all">Tất cả (Chó & Mèo)</option>
                <option value="cat">Mèo</option>
                <option value="dog">Chó</option>
              </select>
            </div>
          </div>

          <div>
            <ImageUploader
              images={blogForm.thumbnail_url}
              onChange={(url) => setBlogForm({ ...blogForm, thumbnail_url: url })}
              multiple={false}
              folder="blogs"
              label="Ảnh bìa bài viết (Tự động nén WebP ~90% & Lưu Cloudflare R2)"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Link Video YouTube hướng dẫn thực tế (Tùy chọn)</label>
            <input
              type="url"
              value={blogForm.youtube_url}
              onChange={(e) => setBlogForm({ ...blogForm, youtube_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Thẻ Tags (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={blogForm.tags}
              onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
              placeholder="VD: chó thông minh, mẹo nuôi chó, dinh dưỡng"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tóm tắt ngắn gọn</label>
            <textarea
              rows={2}
              required
              value={blogForm.summary}
              onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
              placeholder="Tóm tắt ngắn gọn 1-2 câu để người đọc nắm nhanh nội dung chính..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none text-xs"
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
              <label className="font-bold text-slate-700">Nội dung bài viết chi tiết</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Chèn nhanh:</span>
                <button
                  type="button"
                  onClick={() => {
                    const text = '\n📌 Tiêu đề mục: ';
                    setBlogForm(prev => ({ ...prev, content: (prev.content ? prev.content + '\n' : '') + text }));
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  + Tiêu đề mục
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = '\n• Ý chính / gạch đầu dòng: ';
                    setBlogForm(prev => ({ ...prev, content: (prev.content ? prev.content + '\n' : '') + text }));
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  + Gạch đầu dòng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = '\n💡 Lưu ý quan trọng: ';
                    setBlogForm(prev => ({ ...prev, content: (prev.content ? prev.content + '\n' : '') + text }));
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  + Lưu ý
                </button>
              </div>
            </div>
            <textarea
              rows={8}
              required
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
              placeholder="Viết nội dung tự nhiên tại đây (ví dụ: chia thành các đoạn văn, gạch đầu dòng, lời khuyên thực tế... Người đọc sẽ nhìn thấy định dạng văn bản trực quan rõ ràng)."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none text-xs leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              💡 Bạn chỉ cần gõ văn bản tự nhiên, xuống dòng chia đoạn hoặc dùng các nút chèn nhanh ở trên mà không cần học bất kỳ cú pháp kỹ thuật nào.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="blog_is_published"
              checked={blogForm.is_published}
              onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <label htmlFor="blog_is_published" className="font-bold text-slate-800 cursor-pointer">
              Xuất bản ngay lên trang Cẩm nang (`/blogs`) của khách hàng
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setBlogModalOpen(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {editingBlog ? 'Lưu cập nhật' : 'Xuất bản bài viết'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL THÊM / SỬA TÀI KHOẢN & PHÂN QUYỀN --- */}
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title={editingUser ? 'Chỉnh Sửa Tài Khoản & Phân Quyền' : 'Thêm Mới Tài Khoản Hệ Thống'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Địa chỉ Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              disabled={Boolean(editingUser)}
              value={userFormData.email}
              onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
              placeholder="nguyenvana@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs disabled:opacity-60 disabled:bg-slate-100"
            />
            {editingUser && (
              <p className="text-[11px] text-slate-400 mt-1">Email được cố định để đảm bảo tính toàn vẹn xác thực tài khoản.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={userFormData.full_name}
              onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
            />
          </div>

          {!editingUser && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mật khẩu khởi tạo <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                placeholder="Tối thiểu 6 ký tự..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vai trò & Quyền hạn hệ thống <span className="text-rose-500">*</span>
            </label>
            <select
              value={userFormData.role}
              onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-bold text-xs"
            >
              <option value="user">👤 Thành viên thông thường (User)</option>
              <option value="admin">👑 Quản trị viên toàn quyền (Admin)</option>
              <option value="guest">🌐 Khách vãng lai (Guest)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              • Quản trị viên: Toàn quyền truy cập bảng điều khiển Admin, quản lý sản phẩm, cẩm nang, tài khoản và bệnh viện.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="user_is_active"
              checked={userFormData.is_active}
              onChange={(e) => setUserFormData({ ...userFormData, is_active: e.target.checked })}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <label htmlFor="user_is_active" className="font-bold text-xs text-slate-800 cursor-pointer">
              Kích hoạt tài khoản ngay (Cho phép đăng nhập)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setUserModalOpen(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer text-xs"
            >
              {editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL THÊM / SỬA BỆNH VIỆN THÚ Y & TIỆM SPA --- */}
      <Modal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        title={editingLocation ? 'Chỉnh Sửa Cơ Sở Thú Y / Spa' : 'Thêm Mới Bệnh Viện Thú Y & Tiệm Spa'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveLocation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phân loại cơ sở <span className="text-rose-500">*</span>
              </label>
              <select
                value={locationFormData.type}
                onChange={(e) => setLocationFormData({ ...locationFormData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-bold text-xs"
              >
                <option value="clinic">🏥 Bệnh viện / Phòng khám thú y</option>
                <option value="spa">✂️ Tiệm Spa, Grooming & Khách sạn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên cơ sở <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={locationFormData.name}
                onChange={(e) => setLocationFormData({ ...locationFormData, name: e.target.value })}
                placeholder="VD: Bệnh Viện Thú Y PetCare 24/7"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa chỉ chi tiết <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={locationFormData.address}
                onChange={(e) => setLocationFormData({ ...locationFormData, address: e.target.value })}
                placeholder="VD: 124 Hoàng Hoa Thám, Ba Đình, Hà Nội"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quận / Huyện
              </label>
              <input
                type="text"
                value={locationFormData.district}
                onChange={(e) => setLocationFormData({ ...locationFormData, district: e.target.value })}
                placeholder="VD: Ba Đình"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hotline liên hệ
              </label>
              <input
                type="text"
                value={locationFormData.phone}
                onChange={(e) => setLocationFormData({ ...locationFormData, phone: e.target.value })}
                placeholder="VD: 024 3823 4567"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Điểm đánh giá sao (1.0 - 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={locationFormData.rating}
                onChange={(e) => setLocationFormData({ ...locationFormData, rating: parseFloat(e.target.value) || 5.0 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số lượt đánh giá
              </label>
              <input
                type="number"
                min="0"
                value={locationFormData.reviews_count}
                onChange={(e) => setLocationFormData({ ...locationFormData, reviews_count: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              images={locationFormData.image_url}
              onChange={(url) => setLocationFormData(prev => ({ ...prev, image_url: url }))}
              multiple={false}
              folder="locations"
              label="Ảnh cơ sở thú y / spa (Tải ảnh từ máy - Tự động nén WebP)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Các dịch vụ cung cấp (Nhập phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={locationFormData.services}
              onChange={(e) => setLocationFormData({ ...locationFormData, services: e.target.value })}
              placeholder="Cấp cứu 24/7, Phẫu thuật, Tắm sấy khử mùi, Cắt tỉa lông, Tiêm phòng..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mô tả chi tiết / Tiện ích cơ sở
            </label>
            <textarea
              rows={3}
              value={locationFormData.description}
              onChange={(e) => setLocationFormData({ ...locationFormData, description: e.target.value })}
              placeholder="Giới thiệu đội ngũ bác sĩ, máy móc trang thiết bị, thời gian tiếp nhận..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 font-medium resize-none text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 p-3 bg-rose-50/60 border border-rose-200/80 rounded-2xl">
              <input
                type="checkbox"
                id="loc_emergency_24h"
                checked={locationFormData.emergency_24h}
                onChange={(e) => setLocationFormData({ ...locationFormData, emergency_24h: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
              <label htmlFor="loc_emergency_24h" className="font-bold text-xs text-rose-900 cursor-pointer">
                🚑 Trực cấp cứu 24/7 (Hiển thị nhãn khẩn cấp)
              </label>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <input
                type="checkbox"
                id="loc_is_active"
                checked={locationFormData.is_active}
                onChange={(e) => setLocationFormData({ ...locationFormData, is_active: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
              />
              <label htmlFor="loc_is_active" className="font-bold text-xs text-slate-800 cursor-pointer">
                👁️ Hiển thị trên bản đồ trang khách (`/nearby`)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setLocationModalOpen(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer text-xs"
            >
              {editingLocation ? 'Lưu thay đổi' : 'Thêm cơ sở'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL XEM CHI TIẾT THỂ TRẠNG & SỨC KHỎE THÚ CƯNG KHÁCH --- */}
      <Modal
        isOpen={Boolean(selectedPetHealthModal)}
        onClose={() => {
          setSelectedPetHealthModal(null);
          setPetHealthDetails(null);
        }}
        title={`Chi Tiết Thể Trạng: ${selectedPetHealthModal?.name || 'Thú cưng'}`}
        maxWidth="max-w-2xl"
      >
        {loadingPetHealth ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
            <p className="text-xs font-bold">Đang tải lịch sử chỉ số sức khỏe...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header thông tin thú cưng */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-amber-200 shrink-0">
                <DriveImage
                  src={selectedPetHealthModal?.avatar_url}
                  alt={selectedPetHealthModal?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-base">{selectedPetHealthModal?.name}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                    {selectedPetHealthModal?.species === 'cat' ? '🐱 Mèo' : '🐶 Chó'} • {selectedPetHealthModal?.breed}
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Chủ nuôi: <strong className="text-slate-900">{selectedPetHealthModal?.owner_name || 'Khách hàng'}</strong> ({selectedPetHealthModal?.owner_email || '—'})</span>
                  <span>•</span>
                  <span>Tuổi: <strong>{selectedPetHealthModal?.age_months || 12} tháng</strong></span>
                  <span>•</span>
                  <span>Cân nặng ban đầu: <strong>{selectedPetHealthModal?.initial_weight || '—'} kg</strong></span>
                </div>
              </div>
            </div>

            {/* Đặc điểm sức khỏe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block">Tiền sử dị ứng thức ăn:</span>
                <p className="text-slate-600 font-medium">
                  {selectedPetHealthModal?.allergies || 'Không có ghi nhận dị ứng'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block">Ghi chú sức khỏe & tiêm phòng:</span>
                <p className="text-slate-600 font-medium">
                  {selectedPetHealthModal?.health_notes || 'Chưa có ghi chú đặc biệt'}
                </p>
              </div>
            </div>

            {/* Danh sách các lần đo chỉ số */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span>Lịch sử các lần đo chỉ số ({petHealthDetails?.records?.length || 0} lần ghi nhận)</span>
                </h4>
              </div>

              {petHealthDetails?.records && petHealthDetails.records.length > 0 ? (
                <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold sticky top-0">
                      <tr>
                        <th className="p-2.5">Ngày đo</th>
                        <th className="p-2.5">Cân nặng</th>
                        <th className="p-2.5">Chiều cao</th>
                        <th className="p-2.5">Trạng thái sức khỏe</th>
                        <th className="p-2.5">Ghi chú / Triệu chứng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {petHealthDetails.records.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/60">
                          <td className="p-2.5 font-semibold text-slate-800">
                            {rec.recorded_date || '—'}
                          </td>
                          <td className="p-2.5 font-bold text-amber-600">
                            {rec.weight} kg
                          </td>
                          <td className="p-2.5 text-slate-600">
                            {rec.height ? `${rec.height} cm` : '—'}
                          </td>
                          <td className="p-2.5 text-slate-700">
                            {rec.current_health_status || 'Bình thường'}
                          </td>
                          <td className="p-2.5 text-slate-500 italic max-w-xs truncate">
                            {rec.symptoms || rec.notes || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                  Chủ nuôi chưa nhập bản ghi đo thể trạng nào cho bé này.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedPetHealthModal(null);
                  setPetHealthDetails(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

