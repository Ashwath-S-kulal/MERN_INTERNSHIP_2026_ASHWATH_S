import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle, XCircle, Mail, MapPin, Briefcase,
  Globe, Wrench, Navigation, Clock, AlertCircle,
  Star
} from "lucide-react";

export default function AdminProviderRequests() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const token = localStorage.getItem("accessToken");

  const fetchProviders = async () => {
    try {
      setLoading(true);
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
    if (newStatus === 'rejected' && !window.confirm("Are you sure you want to reject this applicant?")) return;

    try {
      setActionId(id);
      await axios.patch(`http://localhost:8000/api/admin/approve/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProviders((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id, newStatus) => {
    if (newStatus === 'rejected' && !window.confirm("Are you sure you want to reject this applicant?")) return;

    try {
      setActionId(id);
      await axios.patch(`http://localhost:8000/api/admin/reject/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Provider Management</h2>
          <p className="text-slate-500 mt-1">Review, approve, or manage existing service providers.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === status
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
              <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold overflow-hidden shrink-0">
                    {p.user?.profilePic ? (
                      <img
                        src={p.user.profilePic}
                        alt={`${p.user.firstName}'s profile`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{p.user?.firstName?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">{p.user?.firstName} {p.user?.lastName}</h3>
                      <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-black">
                        <Star size={12} fill="currentColor" /> {p.rating} <span className="text-[10px] opacity-60">({p.totalReviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Mail size={14} /> {p.user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {activeTab !== 'approved' && (
                    <button
                      disabled={actionId === p._id}
                      onClick={() => handleApprove(p._id, 'approved')}
                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  {activeTab !== 'rejected' && (
                    <button
                      disabled={actionId === p._id}
                      onClick={() => handleReject(p._id, 'rejected')}
                      className="flex-1 md:flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Professional</h4>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{p.title}</p>
                    <p className="text-xs text-blue-600 font-bold uppercase mt-1">{p.services?.join(' • ')}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Bio</p>
                    <p className="text-xs text-slate-600 italic line-clamp-3">"{p.bio || 'No bio provided'}"</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Logistics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Briefcase size={16} className="text-slate-400" />
                      <span>{p.experience} Years Exp.</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock size={16} className="text-slate-400" />
                      <span className="font-semibold text-slate-900">₹{p.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Navigation size={16} className="text-slate-400" />
                      <span>{p.serviceRadius} km Radius</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Wrench size={16} className={p.hasTools ? "text-emerald-500" : "text-rose-400"} />
                      <span className="font-medium">{p.hasTools ? "Equipped" : "Needs Tools"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Schedule & Lang</h4>
                  <div className="flex flex-wrap gap-1">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                      const isAvailable = p.availability?.some(d => d.startsWith(day));
                      return (
                        <span key={day} className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${isAvailable ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
                          {day}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {p.languages?.length > 0 ? p.languages.map(lang => (
                      <span key={lang} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{lang}</span>
                    )) : <span className="text-[10px] text-slate-400">No languages listed</span>}
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

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end items-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Applied: {new Date(p.createdAt).toLocaleDateString()} at {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}