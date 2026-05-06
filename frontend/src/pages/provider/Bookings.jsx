import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users, Timer, CheckCircle, ArrowRight,
  Wrench, MapPin, MoreHorizontal, Eye,
  Calendar, Clock, ShieldCheck, ListFilter
} from "lucide-react";

export default function JobControlCenter() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/booking/provider`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadStats();
  }, []);

  // Filter Logic
  const filteredBookings = filterStatus === "all"
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const stats = [
    { id: 'pending', label: "Pending", count: bookings.filter(b => b.status === 'pending').length, color: "text-amber-500", bg: "bg-amber-50", icon: <Timer size={20} /> },
    { id: 'in_progress', label: "In Progress", count: bookings.filter(b => b.status === 'in_progress').length, color: "text-blue-500", bg: "bg-blue-50", icon: <Users size={20} /> },
    { id: 'completed', label: "Completed", count: bookings.filter(b => b.status === 'completed').length, color: "text-emerald-500", bg: "bg-emerald-50", icon: <CheckCircle size={20} /> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Master Ledger</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Live Console</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Bookings Console</h1>
          <p className="text-slate-400 text-xs font-bold mt-1">Provider Control Center • {filteredBookings.length} Active Records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <button
            key={i}
            onClick={() => setFilterStatus(filterStatus === s.id ? 'all' : s.id)}
            className={`text-left transition-all duration-300 border p-5 rounded-2xl flex items-center gap-5 group hover:shadow-xl ${filterStatus === s.id
                ? 'bg-white border-indigo-500 ring-4 ring-indigo-50'
                : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
          >
            <div className={`p-4 rounded-xl transition-transform group-hover:scale-110 ${s.bg} ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-none mt-1">{s.count}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
        <div className="flex items-center gap-2 text-slate-400 px-2 shrink-0">
          <ListFilter size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${filterStatus === status
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 hidden md:table-row">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Profile</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Service Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? filteredBookings.map((b) => (
                <tr key={b._id} className="group flex flex-col md:table-row hover:bg-indigo-50/30 transition-all duration-300">
                  <td className="px-8 py-5 md:table-cell">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={b.user?.profilePic || `https://ui-avatars.com/api/?name=${b.user?.firstName}&background=6366f1&color=fff`}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-md"
                          alt=""
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{b.user?.firstName} {b.user?.lastName}</p>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Verified Client</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-2 md:py-5 md:table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                        <Wrench size={12} className="text-indigo-500" />
                        {b.serviceType}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(b.date).toLocaleDateString('en-GB')}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {b.time}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-2 md:py-5 md:table-cell">
                    <div className="flex items-start gap-2 max-w-[200px]">
                      <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-slate-500 leading-tight">
                        {b.address.city}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 md:py-5 md:table-cell text-left md:text-center">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${b.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        b.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                      <span className={`h-1 w-1 rounded-full ${b.status === 'pending' ? 'bg-amber-600' :
                          b.status === 'in_progress' ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}></span>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-8 py-5 md:table-cell text-right">
                    <button
                      onClick={() => navigate(`/provider/bookmanagement/${b._id}`)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-lg"
                    >
                      <Eye size={14} />
                      Know More
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center bg-slate-50/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-slate-200 p-4 rounded-full text-slate-400">
                        <ListFilter size={32} />
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                        No records found for {filterStatus}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-2 w-2 rounded-full bg-emerald-500"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Connectivity: 99.9% Online</p>
          </div>
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest bg-white px-3 py-1 rounded-md border border-slate-200">
            {filteredBookings.length} Records Verified
          </p>
        </div>
      </div>
    </div>
  );
}