import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search, MapPin, Star, ChevronRight,
  Sparkles, Home, Clock, Zap, SlidersHorizontal,
  ChevronDown,
  Layers,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ServiceExplorer() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000); // Default high value

  const navigate = useNavigate();


  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get("http://localhost:8000/api/user/getallservices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchServices();
  }, []);


  const categories = ["All", ...new Set(services.map(s => s.category).filter(Boolean))];
  const cities = ["All", ...new Set(services.map(s => s.city).filter(Boolean))];


  const filteredServices = services.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const currentPrice = s.pricing?.rate || s.hourlyRate || 0;
    const matchesSearch =
      s.title?.toLowerCase().includes(searchLower) ||
      s.services?.some(svc => svc.toLowerCase().includes(searchLower));
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesCity = selectedCity === "All" || s.city === selectedCity;
    const matchesPrice = currentPrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesCity && matchesPrice;
  });


  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedCity("All");
    setMaxPrice(10000);
    setSearchTerm("");
  };


  const getSectionData = (categoryName) => {
    return filteredServices.filter(s => s.category === categoryName).slice(0, 4);
  };


  const newArrivals = [...filteredServices].reverse().slice(0, 4);


  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute w-16 h-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <h2 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.4em] animate-pulse">
            Syncing Marketplace
          </h2>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>

        <p className="absolute bottom-10 text-[8px] font-black text-slate-200 uppercase tracking-widest">
          Establishing Secure Connection...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 mt-16">
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-2xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-slate-100/50 p-2 rounded-[24px] border border-slate-200/30">

            <div className="relative min-w-[180px] group">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 z-10" size={14} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 appearance-none cursor-pointer outline-none shadow-sm group-hover:ring-2 group-hover:ring-blue-500/10 transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>

            <div className="relative min-w-[160px] group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors z-10" size={14} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 appearance-none cursor-pointer outline-none shadow-sm"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city === "All" ? "Everywhere" : city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>

            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input
                type="text"
                value={searchTerm}
                placeholder="Search services, skills, or names..."
                className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-xl text-xs font-bold outline-none shadow-sm placeholder:text-slate-300"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="hidden lg:flex items-center gap-4 bg-white px-5 py-2.5 rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all">
              <div className="flex flex-col min-w-[70px]">
                <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Max Budget</span>
                <span className="text-[11px] font-black text-slate-900 leading-none">₹{maxPrice}</span>
              </div>
              <input
                type="range" min="100" max="10000" step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {(selectedCategory !== "All" || selectedCity !== "All" || searchTerm !== "") && (
              <button
                onClick={resetFilters}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>


      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-20">
        {filteredServices.length > 0 ? (
          <>
            {selectedCategory === "All" && searchTerm === "" ? (
              <>
                <ServiceSection
                  title="New Arrivals"
                  subtitle="Recently Joined Experts"
                  icon={<Sparkles size={18} className="text-amber-500" />}
                  data={newArrivals}
                  navigate={navigate}
                />

                <ServiceSection
                  title="Home Services"
                  subtitle="Top Rated in Cleaning & Fixes"
                  icon={<Home size={18} className="text-blue-500" />}
                  data={getSectionData("Home Services")}
                  navigate={navigate}
                />
              </>
            ) : null}

            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {selectedCategory === "All" ? "Explore Marketplace" : `${selectedCategory} Experts`}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Handpicked Professionals</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-15">
                {filteredServices.map(s => (
                  <SmallServiceCard key={s._id} service={s} navigate={navigate} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="py-40 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-black text-slate-900 uppercase">No Matches Found</h3>
            <p className="text-xs font-bold text-slate-400 mt-2">Try adjusting your price range or switching locations.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSelectedCity("All"); setMaxPrice(10000); setSearchTerm(""); }}
              className="mt-6 text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-600 pb-1"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}


function ServiceSection({ title, subtitle, icon, data, navigate }) {
  if (data.length === 0) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map(s => (
          <ServiceCard key={s._id} service={s} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function SmallServiceCard({ service, navigate }) {
  return (
    <div onClick={() => navigate(`/service/${service._id}`)} className="group cursor-pointer">
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-100">
        <img src={service.images?.[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-black shadow-sm">
          ₹{service.pricing?.rate}<span className="text-slate-400"> /{service.pricing?.unit || 'hr'}</span>
        </div>
      </div>
      <h4 className="text-xs font-black text-slate-900 truncate">{service.title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{service.city}</p>
    </div>
  );
}

function ServiceCard({ service, navigate }) {
  return (
    <div
      onClick={() => navigate(`/service/${service._id}`)}
      className="group bg-white border border-slate-100 rounded-[24px] p-3 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer"
    >
      <div className="relative h-44 rounded-[18px] overflow-hidden mb-4">
        <img
          src={service.images?.[0]?.url || "https://images.unsplash.com/photo-1581578731522-745d05db9ad0?q=80&w=800"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={service.title}
        />
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-black">
          ₹{service.pricing?.rate} <span className="text-slate-400">/{service.pricing?.unit || 'hr'}</span>
        </div>
      </div>

      <div className="px-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{service.category}</span>
          <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px]">
            <Star size={10} fill="currentColor" /> 4.9
          </div>
        </div>
        <h3 className="text-sm font-black text-slate-900 mb-1 truncate">{service.title}</h3>
        <div className="flex items-center gap-1 text-slate-400">
          <MapPin size={10} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">{service.city}</span>
        </div>
      </div>
    </div>
  );
}