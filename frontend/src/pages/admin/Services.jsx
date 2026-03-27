import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, Search, MapPin,
  Briefcase, CheckCircle2, AlertCircle,
  Info,
  Clock,
  Globe
} from 'lucide-react';

export default function ServicesPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/allprovider", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rawData = Array.isArray(res.data) ? res.data : res.data.providers || [];
        const approvedOnly = rawData.filter(provider => provider.status === "approved");

        setProviders(approvedOnly);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  const groupedData = providers.reduce((acc, provider) => {
    if (provider.services && Array.isArray(provider.services)) {
      provider.services.forEach((serviceItem) => {
        const categoryName = serviceItem || "General Service";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(provider);
      });
    }
    return acc;
  }, {});

  const serviceCategories = Object.keys(groupedData).filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-sm font-medium">Loading verified services...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-0">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Service Directory</h1>
          <p className="text-slate-500 mt-1">Contact local professionals verified by our team.</p>
        </div>

        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search service types..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        {serviceCategories.map((catName) => (
          <div key={catName}>
            <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-200 pb-4">
              <Briefcase className="text-blue-600" size={20} />
              <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">
                {catName}
              </h2>
              <span className="ml-auto text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase">
                {groupedData[catName].length} Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {groupedData[catName].map((p) => (
                <div key={p._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-white px-2 py-1 rounded border border-slate-100">
                      {p.services?.[0] || "General"}
                    </span>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 size={14} />
                      <span className="text-[10px] font-bold uppercase">Verified</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 overflow-hidden">
                        {p.user?.profilePic ? (
                          <img src={p.user.profilePic} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{p.title}</h3>
                        <p className="text-xs text-slate-500 font-medium truncate">
                          By {p.user?.firstName} {p.user?.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 bg-slate-50 p-3 rounded-lg">
                      <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-2">
                        {p.bio ? p.bio : "Professional service provider."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                          <Clock size={14} className="text-slate-400" /> {p.experience} Years
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hourly Rate</p>
                        <p className="text-lg font-black text-slate-900">₹{p.hourlyRate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Range</p>
                        <p className="text-sm font-bold text-slate-800">{p.serviceRadius} KM</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Tools</p>
                        <p className={`text-xs font-bold ${p.hasTools ? 'text-blue-600' : 'text-slate-400'}`}>
                          {p.hasTools ? "Equipped" : "Standard"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Globe size={12} className="text-slate-400" />
                        {p.languages && p.languages.length > 0 ? (
                          p.languages.map((lang, idx) => (
                            <span key={idx} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                              {lang}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No languages listed</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                          const isAvailable = p.availability?.some(d => d.startsWith(day));
                          return (
                            <span
                              key={day}
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${isAvailable
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-300'
                                }`}
                            >
                              {day}
                            </span>
                          );
                        })}
                      </div>
                    </div>


                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-start gap-2 text-slate-500">
                        <MapPin size={14} className="mt-0.5 text-blue-500 shrink-0" />
                        <div className="text-[11px] font-medium leading-tight">
                          <p className="text-slate-800 font-bold">{p.city}</p>
                          <p className="text-slate-400 truncate">{p.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {serviceCategories.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
          <AlertCircle size={40} className="mx-auto text-slate-200 mb-3" />
          <h3 className="text-slate-900 font-bold">No verified services found</h3>
          <p className="text-slate-500 text-sm">We couldn't find any approved providers for your search.</p>
        </div>
      )}
    </div>
  );
}