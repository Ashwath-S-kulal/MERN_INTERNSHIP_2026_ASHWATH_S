import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search, MapPin, Star, Zap, ArrowRight,
  Clock, ShieldCheck, Navigation, Filter, X, CheckCircle2,
  ToolCase,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ServiceExplorer() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get("http://localhost:8000/api/user/getallservices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ["All", ...new Set(services.map(s => s.services?.[0]).filter(Boolean))];

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.services?.[0] === selectedCategory;
    const matchesPrice = s.hourlyRate <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  });



  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Marketplace</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-20 font-sans mt-20">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 py-6 px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="relative group">
              <div className="absolute"></div>
              <h1 className="relative flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Marketplace</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter sm:text-4xl">
                  Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Services</span>
                </span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row flex-1 max-w-3xl w-full gap-3 bg-white p-2 rounded-[24px] border border-slate-100">
              <div className="relative min-w-[160px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === "All" ? "All Services" : cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Filter size={14} />
                </div>
              </div>

              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:bg-white transition-all outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 bg-slate-900 px-5 py-3 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Max Price</span>
                  <span className="text-xs font-black text-white leading-none">₹{priceRange}</span>
                </div>
                <input
                  type="range" min="100" max="2000" step="50" value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-20 accent-blue-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((s) => (
            <div key={s._id} className="group bg-white rounded-md border border-slate-100 p-3 shadow-md hover:border-blue-200 hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-md bg-slate-100">
                <img
                  onClick={() => navigate(`/service/${s._id}`)}
                  src={s.images?.[0]?.url || "https://images.unsplash.com/photo-1581578731522-745d05db9ad0?q=80&w=800"}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-blue-600 text-[9px] font-black uppercase tracking-widest shadow-sm">
                    {s.services?.[0] || "General"}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-white text-xs font-black">
                  ₹{s.hourlyRate}/hr
                </div>
              </div>

              <div className="px-2 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={s.user?.profilePic || `https://ui-avatars.com/api/?name=${s.user?.firstName}`}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                    alt="avatar"
                  />
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-none truncate max-w-[180px]">{s.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                      {s.user?.firstName} {s.user?.lastName}
                    </p>
                  </div>
                  
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 h-8">
                  {s.bio || "Quality service provider available for your tasks."}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <MapPin size={12} className="text-blue-500" />
                    <span className="text-[9px] font-bold truncate uppercase">{s.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <Clock size={12} className="text-blue-500" />
                    <span className="text-[9px] font-bold uppercase">{s.experience}Y Exp.</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/service/${s._id}`)}
                  className="w-full py-4 bg-slate-900 text-white rounded-md font-black text-[10px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95 group/btn mt-auto"
                >
                  Book Service
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-bold">No services found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}