import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search, MapPin, Star, Clock,
  ChevronRight, ArrowUpRight, Filter, Users, ChevronDown,
  ArrowRight
} from 'lucide-react';

export default function ServicesPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services"); // New filter state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get("http://localhost:8000/api/admin/allprovider", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rawData = Array.isArray(res.data) ? res.data : res.data.providers || [];
        setProviders(rawData.filter(p => p.status === "approved"));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const categoriesList = ["All Services", ...new Set(providers.map(p => p.services?.[0]).filter(Boolean))];

  const filteredProviders = providers.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All Services" || p.services?.[0] === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const groupedProviders = filteredProviders.reduce((acc, p) => {
    const mainService = p.services?.[0] || "General Services";
    if (!acc[mainService]) acc[mainService] = [];
    acc[mainService].push(p);
    return acc;
  }, {});

  const displayCategories = Object.keys(groupedProviders);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold animate-pulse">Organizing Service Directory...</p>
    </div>
  );

  return (
    <div className="max-w-screen mx-auto px-6 py-10 pt-3">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Services</h1>
          <p className="text-slate-500 font-medium mt-2">Browse and compare verified service professionals.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-md shadow-sm appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 cursor-pointer transition-all"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              className="w-full pl-12 pr-4 py-3.5 rounded-md bg-white border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
              placeholder="Search provider name..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {displayCategories.length > 0 ? (
          displayCategories.map(category => (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <h2 className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                  {category}
                </h2>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Professional</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Experience</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rate</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50" >
                      {groupedProviders[category].map(p => (
                        <tr key={p._id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/servicedetails/${p._id}`);
                          }}>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4" >
                              <img
                                src={p.images?.[0]?.url || p.user?.profilePic || "https://via.placeholder.com/100"}
                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                                alt=""
                              />
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                                  By: {p.user?.firstName} {p.user?.lastName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock size={14} className="text-slate-400" />
                              <span className="text-sm font-bold">{p.experience} Years</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin size={14} className="text-indigo-500" />
                              <span className="text-sm font-bold">{p.city}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-lg font-black text-slate-900">₹{p.pricing.rate}</span>
                            <span className="text-[10px] text-slate-400 font-bold ml-1 italic">/{p.pricing.unit}</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => navigate(`/servicedetails/${p._id}`)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 rounded-md cursor-pointer text-xs font-black tracking-widest transition-all"
                            >
                              Details <ArrowRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No matching professionals</h3>
            <p className="text-slate-500">Try changing your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}