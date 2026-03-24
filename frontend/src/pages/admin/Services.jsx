import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wrench, 
  User, 
  Search, 
  Clock, 
  ShieldCheck,
  MapPin,
  CircleDollarSign,
  Briefcase,
  ChevronRight,
  Hammer
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
        const data = Array.isArray(res.data) ? res.data : res.data.providers || [];
        setProviders(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  // GROUPING LOGIC: Map by Service Title
  const groupedData = providers.reduce((acc, provider) => {
    if (provider.services && Array.isArray(provider.services)) {
      provider.services.forEach((s) => {
        const title = s.title || "General Service";
        if (!acc[title]) acc[title] = [];
        
        acc[title].push({
          ...provider,
          currentService: s // Attach specific service stats to this provider entry
        });
      });
    }
    return acc;
  }, {});

  const serviceTitles = Object.keys(groupedData).filter(title => 
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Filtering Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Service <span className="text-orange-600">Directory</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            {serviceTitles.length} Unique Categories Identified
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by service name..." 
            className="w-full md:w-80 bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-6 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-sm font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-16">
        {serviceTitles.map((serviceName) => (
          <section key={serviceName} className="relative">
            {/* SERVICE TITLE HEADER */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <Hammer size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">
                {serviceName}
              </h2>
              <div className="flex-1 h-[2px] bg-slate-100 ml-4 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {groupedData[serviceName].length} PROVIDERS
              </span>
            </div>

            {/* PROVIDERS GRID UNDER THIS SERVICE */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groupedData[serviceName].map((provider) => (
                <div 
                  key={provider._id} 
                  className="group bg-white rounded-[2rem] border border-slate-100 p-6 hover:border-orange-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Provider Avatar */}
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                      <User size={28} />
                    </div>
                    
                    {/* Provider Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-slate-900 truncate uppercase tracking-tighter text-lg">
                          {provider.user?.firstName || "Anonymous"}
                        </h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${provider.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                          {provider.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {provider.city || "Brahmavara"}
                      </p>
                    </div>
                  </div>

                  {/* Specific Service Stats for this Provider */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Experience</p>
                      <p className="text-sm font-black text-slate-700">{provider.currentService.experience} Years</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Hourly Rate</p>
                      <p className="text-sm font-black text-orange-600">₹{provider.currentService.hourlyRate}</p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {provider.hasTools && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" title="Has Tools"></span>
                      )}
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {provider.hasTools ? 'Equipped' : 'Standard'}
                      </span>
                    </div>
                    <button className="text-[10px] font-black text-slate-900 uppercase tracking-tighter flex items-center gap-1 hover:text-orange-600 transition-colors group/btn">
                      View Profile <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {serviceTitles.length === 0 && (
        <div className="bg-white rounded-[3rem] py-20 text-center border-2 border-dashed border-slate-100">
          <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-slate-400 font-black uppercase tracking-widest">No matching services found</h3>
        </div>
      )}
    </div>
  );
}