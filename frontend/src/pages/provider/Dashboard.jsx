import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Star, Loader2, MessageSquare, IndianRupee, BarChart3,
  Zap, Users, Percent, ArrowUp, ArrowDown,
  Search, Filter, ExternalLink, ShieldCheck
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useNavigate } from "react-router-dom";

const ProviderAnalytics = () => {
  const [bookings, setBookings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      try {
        const [b, p, r] = await Promise.all([
          axios.get("http://localhost:8000/api/booking/provider", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:8000/api/serviceprovider/provider/${user._id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:8000/api/reviews/providerreviews/${user._id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setBookings(b.data || []);
        setProfiles(p.data.providers || []);
        if (r.data.success) setReviews(r.data.data || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [user?._id, token]);

  const data = useMemo(() => {
    const completed = bookings.filter(b => b.status === "completed");
    const cancelled = bookings.filter(b => b.status === "cancelled");
    const pending = bookings.filter(b => b.status === "pending");

    const totalRevenue = completed.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

    // Calculate Conversion Rate (Completed vs Total attempted)
    const conversionRate = bookings.length ? ((completed.length / bookings.length) * 100).toFixed(0) : 0;

    // Last 7 days revenue for chart
    const graphData = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      const val = completed.filter(b => new Date(b.updatedAt).toDateString() === d.toDateString())
        .reduce((s, b) => s + (b.totalAmount || 0), 0);
      return { name: label, revenue: val };
    });

    return { totalRevenue, avgRating, conversionRate, completed, cancelled, pending, graphData };
  }, [bookings, reviews]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating Insights</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Simple Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={24} /> Performance Overview
            </h1>
            <p className="text-sm text-slate-500">Analytics for {user?.firstName} • Live Data</p>
          </div>

        </div>

        {/* 5-Column Detailed Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Revenue" val={`₹${data.totalRevenue}`} icon={<IndianRupee size={16} />} color="blue" />
          <StatCard title="Success Rate" val={`${data.conversionRate}%`} icon={<Percent size={16} />} color="emerald" />
          <StatCard title="Pending" val={data.pending.length} icon={<Zap size={16} />} color="orange" />
          <StatCard title="Total Reviews" val={reviews.length} icon={<MessageSquare size={16} />} color="purple" />
          <StatCard title="Avg Rating" val={data.avgRating} icon={<Star size={16} fill="currentColor" />} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
              <BarChart3 size={16} /> Weekly Earnings (INR)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.graphData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Users size={16} /> Your Active Services
            </h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {profiles.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-default group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                      {p.images && p.images[0] ? (
                        <img
                          onClick={() => navigate(`/service/${p._id}`)}
                          src={p.images[0].url}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <span className="font-black text-xs text-blue-600 uppercase">
                          {p.title?.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold truncate w-32 text-slate-700">{p.title}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-blue-600">₹{p.hourlyRate}/hr</p>
                        <span className="text-[8px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded font-black uppercase">
                          {p.category || 'Service'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div onClick={() => navigate(`/service/${p._id}`)}
                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-300 hover:text-blue-600">
                    <ExternalLink size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Booking Table (The "More Data" section) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Transactions</h3>
            <span className="text-[10px] px-2 py-1 bg-slate-100 rounded text-slate-500 font-bold">Showing last {bookings.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Service Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 font-bold text-xs">
                      {b.user?.firstName || "Unknown Client"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-xs text-blue-600">
                      ₹{b.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-[10px]">
                      <span className={`px-2 py-1 rounded-full font-black uppercase tracking-tighter ${b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        b.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Small Stat Component
const StatCard = ({ title, val, icon, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
    amber: "text-amber-600 bg-amber-50"
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className={`w-8 h-8 ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <h2 className="text-xl font-black mt-1">{val}</h2>
    </div>
  );
};

export default ProviderAnalytics;