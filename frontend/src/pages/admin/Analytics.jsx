import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Users, Briefcase, Star, ShieldCheck, ArrowUpRight,
  Clock, CheckCircle2, AlertCircle, Loader2, Database,
  Trophy, MapPin, Medal, TrendingUp, BarChart3
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useNavigate } from "react-router-dom";

const AdminAnalytics = () => {
  const [data, setData] = useState({ bookings: [], users: [], providers: [], reviews: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [bookRes, userRes, provRes, revRes] = await Promise.all([
          axios.get("http://localhost:8000/api/booking/allbookings", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/alluser", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8000/api/admin/allprovider", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8000/api/reviews/admin/all", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setData({
          bookings: bookRes.data || [],
          users: userRes.data.users || [],
          providers: provRes.data.providers || provRes.data || [],
          reviews: revRes.data.reviews || []
        });
      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [token]);


  const analytics = useMemo(() => {
    const { bookings, providers, reviews, users } = data;

    const revenueMap = {};
    bookings.forEach(b => {
      if (b.status === "completed" && b.provider) {
        const pId = b.provider._id?.toString() || b.provider?.toString();
        const amount = parseFloat(b.totalAmount) || 0;
        revenueMap[pId] = (revenueMap[pId] || 0) + amount;
      }
    });

    const sortedRevIds = Object.keys(revenueMap).sort((a, b) => (revenueMap[b] || 0) - (revenueMap[a] || 0));
    const topRevId = sortedRevIds[0];
    const topRevenueProvider = providers.find(p => p._id?.toString() === topRevId || p.user?.toString() === topRevId);

    const serviceCounts = bookings.reduce((acc, b) => {
      const type = b.serviceType || "General";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);
    const topServiceType = sortedServices[0]?.[0] || "N/A";
    const topServiceCount = sortedServices[0]?.[1] || 0;

    const pieData = Object.entries(serviceCounts).map(([name, value]) => ({ name, value }));
    const pending = providers.filter(p => p.status === "pending").length;
    const approved = providers.filter(p => p.status === "approved").length;

    const barData = [
      { name: 'Users', value: users.length, color: '#4f46e5' },
      { name: 'Providers', value: approved, color: '#10b981' },
      { name: 'Bookings', value: bookings.length, color: '#f59e0b' },
      { name: 'Reviews', value: reviews.length, color: '#ec4899' }
    ];

    return { topRevenueProvider, topRevAmount: revenueMap[topRevId] || 0, topServiceType, topServiceCount, pieData, barData, pending, approved };
  }, [data]);



  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];



  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
      <p className="text-sm font-medium">Loading Dashboard...</p>
    </div>
  );


  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-indigo-600" /> Admin Overview
            </h1>
            <p className="text-sm text-slate-500">Monitor system performance and service activities.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full w-fit">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold uppercase tracking-wider">System Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SimpleStat label="Total Users" val={data.users.length} icon={<Users size={20} />} />
          <SimpleStat label="Pending Requests" val={analytics.pending} icon={<Clock size={20} />} alert={analytics.pending > 0} />
          <SimpleStat label="Active Providers" val={analytics.approved} icon={<Briefcase size={20} />} />
          <SimpleStat label="Total Bookings" val={data.bookings.length} icon={<CheckCircle2 size={20} />} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Trophy size={18} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Top Revenue Earner</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 truncate pr-10">
                {analytics.topRevenueProvider?.title || "Evaluating..."}
              </h2>
              <div className="flex items-center gap-1.5 text-slate-500 mt-1 mb-8">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-sm font-medium">{analytics.topRevenueProvider?.city || "Remote"}</span>
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Earnings</p>
                  <p className="text-3xl font-black text-indigo-600 tracking-tighter">
                    ₹{analytics.topRevAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg shadow-indigo-200 relative overflow-hidden group"> 
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 rounded-lg text-white">
                  <BarChart3 size={18} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-100">Market Leader</span>
              </div>

              <p className="text-sm font-medium text-indigo-100/80">Most Booked Category</p>
              <h2 className="text-3xl font-black text-white italic tracking-tight uppercase leading-tight mb-auto">
                {analytics.topServiceType}
              </h2>

              <div className="mt-8">
                <div className="flex items-baseline justify-end mb-1">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Global Share</p>
                    <p className="text-xs font-bold text-white">
                      out of {data.bookings.length}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full mt-2 overflow-hidden backdrop-blur-sm">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(analytics.topServiceCount / (data.bookings.length || 1)) * 100}%`
                    }}
                  ></div>
                </div>
                <p className="text-[9px] font-bold text-indigo-100/50 uppercase mt-2 tracking-[0.2em]">
                  Accounting for {((analytics.topServiceCount / (data.bookings.length || 1)) * 100).toFixed(1)}% of all traffic
                </p>
              </div>
            </div>
          </div>


          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Category Share</h3>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div className="h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.pieData}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                <span className="text-lg font-black text-slate-800">{data.bookings.length}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {analytics.pieData.slice(0, 2).map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[10px] font-bold text-slate-600 truncate uppercase">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Growth Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.barData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {analytics.barData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Pending Verifications</h3>
            <div className="space-y-3 max-h-[260px] overflow-y-auto custom-scrollbar">
              {data.providers.filter(p => p.status === "pending").map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded bg-indigo-100 flex items-center justify-center border border-slate-200">
                      {p.images && p.images[0] ? (
                        <img
                          onClick={() => navigate(`/dashboard/request`)}
                          src={p.images[0].url}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = ""; e.target.parentElement.innerHTML = p.title?.charAt(0); }}
                        />
                      ) : (
                        <span className="text-indigo-700 font-bold text-xs uppercase">
                          {p.title?.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800 truncate w-32">{p.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{p.category}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-400" />
                </div>
              ))}

              {analytics.pending === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-sm">No pending requests</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const SimpleStat = ({ label, val, icon, alert }) => (
  <div className={`p-5 bg-white rounded-xl border transition-colors ${alert ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200'}`}>
    <div className={`mb-3 ${alert ? 'text-orange-500' : 'text-slate-400'}`}>
      {icon}
    </div>
    <p className="text-xs font-semibold text-slate-500">{label}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{val}</h3>
  </div>
);

export default AdminAnalytics;