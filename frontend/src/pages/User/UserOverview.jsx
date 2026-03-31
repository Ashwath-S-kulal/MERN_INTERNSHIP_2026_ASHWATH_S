import React, { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Star, 
  LayoutDashboard, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2
} from "lucide-react";

const UserAnalytics = () => {
  // Dummy Data for the UI
  const [reviews] = useState([
    { id: 1, rating: 5 },
    { id: 2, rating: 4 },
    { id: 3, rating: 5 },
  ]);
  
  const [service] = useState({ rating: 4.2, totalReviews: 12 });

  // Your Calculation Logic
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
    : service.rating;

  const stats = [
    { label: "Total Bookings", value: "128", icon: <Calendar size={20}/>, trend: "+12%", up: true },
    { label: "Total Revenue", value: "₹42,500", icon: <TrendingUp size={20}/>, trend: "+8%", up: true },
    { label: "Active Services", value: "6", icon: <LayoutDashboard size={20}/>, trend: "Stable", up: true },
    { label: "Avg. Rating", value: averageRating, icon: <Star size={20} className="fill-amber-400 text-amber-400"/>, trend: "Top 5%", up: true },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
          <p className="text-slate-500 mt-1">Monitor your service performance and customer feedback.</p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">{stat.icon}</div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Placeholder / Activity */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg">Booking Activity</h3>
              <select className="text-sm bg-slate-50 border-none rounded-lg px-3 py-1 outline-none font-medium">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            {/* Visual Placeholder for a Chart */}
            <div className="h-64 w-full bg-slate-50 rounded-2xl flex items-end justify-around p-4 gap-2">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div 
                  key={i} 
                  style={{ height: `${h}%` }} 
                  className="w-full bg-slate-900 rounded-t-lg hover:bg-indigo-600 transition-all cursor-pointer group relative"
                >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}
                    </span>
                </div>
              ))}
            </div>
            <div className="flex justify-around mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Side Content: Rating & Recent */}
          <div className="space-y-6">
            
            {/* Rating Card */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-slate-400 tracking-wide uppercase">Average Rating</span>
              </div>
              <h2 className="text-5xl font-bold mb-4">{averageRating}</h2>
              <div className="space-y-3">
                 <p className="text-xs text-slate-400 leading-relaxed">
                   Based on <span className="text-white font-bold">{reviews.length} total reviews</span> this month.
                 </p>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[92%] rounded-full" />
                 </div>
                 <button className="w-full py-3 mt-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all">
                   View All Feedback
                 </button>
              </div>
            </div>

            {/* Recent Status */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <h4 className="font-bold text-sm mb-4">Quick Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={14}/> <span>Pending Orders</span>
                  </div>
                  <span className="font-bold">04</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-500"/> <span>Completed</span>
                  </div>
                  <span className="font-bold text-emerald-600">89</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;