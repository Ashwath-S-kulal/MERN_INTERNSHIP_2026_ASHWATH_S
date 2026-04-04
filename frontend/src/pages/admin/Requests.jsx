import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle, XCircle, Mail, MapPin, Briefcase,
  Wrench, Navigation, Clock,
  Star, 
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminProviderRequests() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [historyTab, setHistoryTab] = useState("approved");
  const navigate = useNavigate();

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


  useEffect(() => {
     fetchProviders();
     }, []);


  const handleStatusUpdate = async (id, newStatus) => {
    const endpoint = newStatus === 'approved' ? 'approve' : 'reject';
    const confirmMsg = newStatus === 'rejected' ? "Reject this provider?" : "Approve this provider?";
    if (!window.confirm(confirmMsg)) return;

    try {
      setActionId(id);
      await axios.patch(`http://localhost:8000/api/admin/${endpoint}/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProviders(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setActionId(null);
    }
  };

  const pendingRequests = providers.filter(p => p.status === "pending");
  const historyRequests = providers.filter(p => p.status === historyTab);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest mt-4">Syncing Database</p>
    </div>
  );

  const DetailedProviderCard = ({ p }) => (
    <div className={`bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden transition-all ${actionId === p._id ? 'opacity-50 scale-95' : ''}`}>
      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <img
            onClick={() => navigate(`/servicedetails/${p._id}`)}
            src={p.user?.profilePic}
            className="w-20 h-20 rounded-3xl object-cover cursor-pointer hover:ring-4 ring-indigo-100 transition-all shadow-md"
            alt="Profile"
          />
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">{p.user?.firstName} {p.user?.lastName}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">{p.title}</span>
              <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-md">
                <Star size={12} fill="currentColor" /> {p.rating || "New"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => handleStatusUpdate(p._id, 'approved')} className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-md cursor-pointer font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
            <CheckCircle size={18} /> Approve
          </button>
          <button onClick={() => handleStatusUpdate(p._id, 'rejected')} className="flex-1 md:flex-none bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 px-8 py-3 rounded-md cursor-pointer font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2">
            <XCircle size={18} /> Reject
          </button>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Overview</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <Briefcase size={16} className="text-slate-400 mb-1" />
              <p className="text-lg font-black">{p.experience} Years</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Experience</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <Clock size={16} className="text-slate-400 mb-1" />
              <p className="text-lg font-black">₹{p.pricing?.rate} / {p.pricing?.unit}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Pricing</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 pt-2">
            {p.services?.map(s => <span key={s} className="bg-slate-100 text-[9px] font-bold px-3 py-1 rounded-full text-slate-600 uppercase">{s}</span>)}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics & Tools</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <Mail size={16} className="text-indigo-500" /> {p.user?.email || "No email"}
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <Globe size={16} className="text-indigo-500" /> {p.languages?.join(", ") || "English"}
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <Navigation size={16} className="text-indigo-500" /> {p.serviceRadius}km Range
            </div>
            <div className="flex items-center gap-3 text-sm font-black text-slate-700">
              <Wrench size={16} className={p.hasTools ? 'text-emerald-500' : 'text-rose-500'} />
              {p.hasTools ? 'Equipped with Tools' : 'Requires Client Tools'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Address</p>
          <div className="flex gap-3 bg-slate-100 p-5 rounded-md text-white">
            <MapPin size={20} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold leading-relaxed text-slate-600">{p.address}</p>
              <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">{p.city}, {p.zipCode}</p>
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Bio</p>
          <p className="text-xs text-slate-500 italic leading-relaxed">"{p.bio || "No professional summary provided."}"</p>
        </div>
      </div>
    </div>
  );




  const ProviderCard = ({ p, isHistory = false }) => (
    <div key={p._id} className={`bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden transition-all ${actionId === p._id ? 'opacity-50 scale-95 grayscale' : ''}`}>
      <div className="p-5 flex items-center justify-between bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-4">
          {p.user?.profilePic ? (
            <img
              onClick={() => navigate(`/servicedetails/${p._id}`)}
              src={p.user.profilePic}
              className="w-12 h-12 rounded-2xl object-cover cursor-pointer hover:ring-2 ring-indigo-500 transition-all shadow-sm"
              alt="Profile"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}

          {(!p.user?.profilePic) && (
            <div
              onClick={() => navigate(`/servicedetails/${p._id}`)}
              className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs uppercase cursor-pointer hover:bg-indigo-200 transition-all border border-indigo-200 shadow-sm"
            >
              {p.user?.firstName?.substring(0, 2) || "??"}
            </div>
          )}

          <div>
            <h3 className="font-black text-slate-900 leading-none">
              {p.user?.firstName} {p.user?.lastName}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">
              {p.title}
            </p>
          </div>
        </div>
        {!isHistory ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(p._id, 'approved')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition-all shadow-lg shadow-emerald-100"
              title="Approve"
            >
              <CheckCircle size={20} />
            </button>
            <button
              onClick={() => handleStatusUpdate(p._id, 'rejected')}
              className="bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"
              title="Reject"
            >
              <XCircle size={20} />
            </button>
          </div>
        ) : (
          <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
            {p.status}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pricing</p>
            <p className="text-sm font-black text-slate-900">₹{p.hourlyRate}/hr</p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase">{p.experience}Y Exp</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</p>
            <p className="text-sm font-bold text-slate-700 truncate">{p.city}</p>
            <p className="text-[10px] font-bold text-slate-400">{p.serviceRadius}km</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skills</p>
            <div className="flex flex-wrap gap-1">
              {p.services?.slice(0, 2).map(s => <span key={s} className="bg-slate-100 text-[9px] font-bold px-2 py-0.5 rounded text-slate-600 uppercase">{s}</span>)}
              <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${p.hasTools ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {p.hasTools ? 'Equipped' : 'No Tools'}
              </span>
            </div>
          </div>
        </div>

        {isHistory && (
          <div className="pt-4 border-t border-slate-50">
            {p.status === 'approved' ? (
              <button
                onClick={() => handleStatusUpdate(p._id, 'rejected')}
                className="w-full flex items-center justify-center gap-2 py-2 bg-rose-50 text-rose-600 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
              >
                <XCircle size={14} /> Revoke & Reject
              </button>
            ) : (
              <button
                onClick={() => handleStatusUpdate(p._id, 'approved')}
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle size={14} /> Re-evaluate & Approve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );


  

  return (
    <div className="min-h-screen bg-[#F8FAFC] space-y-12">

      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pending Approval</h2>
            <p className="text-slate-500 text-sm font-medium">New applicants needing review</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {pendingRequests.length === 0 ? (
            <div className="col-span-full py-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
              <CheckCircle className="mx-auto text-emerald-400 mb-2" size={32} />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Queue Clean</p>
            </div>
          ) : (
            pendingRequests.map(p => <DetailedProviderCard key={p._id} p={p} isHistory={false} />)
          )}
        </div>
      </section>

      <hr className="border-slate-200 max-w-6xl mx-auto" />

      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Audit History</h2>
              <p className="text-slate-500 text-sm font-medium">Manage previously processed records</p>
            </div>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {['approved', 'rejected'].map(tab => (
              <button
                key={tab}
                onClick={() => setHistoryTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${historyTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab} ({providers.filter(p => p.status === tab).length})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyRequests.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              No records in {historyTab}
            </div>
          ) : (
            historyRequests.map(p => <ProviderCard key={p._id} p={p} isHistory={true} />)
          )}
        </div>
      </section>
    </div>
  );
}

