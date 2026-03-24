import { useEffect, useState } from "react";
import axios from "axios";
import { 
  CheckCircle, XCircle, Mail, MapPin, Briefcase, 
  Globe, Wrench, Navigation, Clock, AlertCircle 
} from "lucide-react";

export default function AdminProviderRequests() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending', 'approved', or 'rejected'
  
  const token = localStorage.getItem("accessToken");

  const fetchProviders = async () => {
    try {
      setLoading(true);
      // Ensure this endpoint matches your backend route for "all" providers
      const res = await axios.get("http://localhost:8000/api/admin/allprovider", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProviders(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProviders(); }, []);


  const handleApprove = async (id, newStatus) => {
    // Basic confirmation for rejection
    if (newStatus === 'rejected' && !window.confirm("Are you sure you want to reject this applicant?")) return;

    try {
      setActionId(id); // Start loading state for this specific card
      
      // Hit the unified endpoint we created in the backend
      await axios.patch(`http://localhost:8000/api/admin/approve/${id}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from list with a smooth exit
      setProviders((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setActionId(null);
    }
  };

    const handleReject = async (id, newStatus) => {
    // Basic confirmation for rejection
    if (newStatus === 'rejected' && !window.confirm("Are you sure you want to reject this applicant?")) return;

    try {
      setActionId(id); // Start loading state for this specific card
      
      // Hit the unified endpoint we created in the backend
      await axios.patch(`http://localhost:8000/api/admin/reject/${id}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from list with a smooth exit
      setProviders((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setActionId(null);
    }
  };
  
  const filteredProviders = providers.filter(p => p.status === activeTab);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-slate-500 font-medium animate-pulse">Loading provider database...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto p-4">
      {/* Header & Tabs */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Provider Management</h2>
          <p className="text-slate-500 mt-1">Review, approve, or manage existing service providers.</p>
        </div>

        {/* Status Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === status 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status} 
              <span className="ml-2 opacity-50 text-xs">
                ({providers.filter(p => p.status === status).length})
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Main List */}
      <div className="grid grid-cols-1 gap-8">
        {filteredProviders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No {activeTab} providers</h3>
            <p className="text-slate-500">The queue is currently empty for this category.</p>
          </div>
        ) : (
          filteredProviders.map((p) => (
            <div 
              key={p._id} 
              className={`bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${actionId === p._id ? 'opacity-50 scale-[0.98] grayscale' : 'opacity-100'}`}
            >
              {/* Header Section */}
              <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-lg">
                    {p.user?.firstName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{p.user?.firstName} {p.user?.lastName}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Mail size={14} /> {p.user?.email}
                    </div>
                  </div>
                </div>
                
                {/* Dynamic Action Buttons */}
                <div className="flex gap-2 w-full md:w-auto">
                  {activeTab !== 'approved' && (
                    <button 
                      disabled={actionId === p._id}
                      onClick={() => handleApprove(p._id, 'approved')} 
                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  {activeTab !== 'rejected' && (
                    <button 
                      disabled={actionId === p._id}
                      onClick={() => handleReject(p._id, 'rejected')} 
                      className="flex-1 md:flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  )}
                </div>
              </div>

              {/* Data Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Professional</h4>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{p.title}</p>
                    <p className="text-xs text-blue-600 font-bold uppercase mt-1">{p.services?.join(' • ')}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Briefcase size={16} className="text-slate-400" />
                      <span>{p.experience} Years Experience</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock size={16} className="text-slate-400" />
                      <span className="font-semibold text-slate-900">₹{p.hourlyRate} <span className="text-slate-400 font-normal">/ hr</span></span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Logistics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Navigation size={16} className="text-slate-400" />
                      <span>{p.serviceRadius} km Radius</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Wrench size={16} className={p.hasTools ? "text-emerald-500" : "text-rose-400"} />
                      <span className="font-medium">{p.hasTools ? "Fully Equipped" : "Needs Tools"}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Globe size={16} className="text-slate-400 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {p.languages?.map(lang => (
                          <span key={lang} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{lang}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</h4>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin size={18} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">{p.address}</p>
                      <p className="text-slate-500 font-bold">{p.city}, {p.zipCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}