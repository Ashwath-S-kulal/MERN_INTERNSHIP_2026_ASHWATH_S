import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Calendar, Clock, CheckCircle2, Package,
  MapPin, User, MessageSquare, ChevronRight,
  Search, Bell, Settings, LogOut, Loader2,
  AlertCircle,
  ArrowUpRight,
  Medal,
  Star,
  ShieldCheck,
  Gift
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
    const { user } = useSelector(store => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/booking/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `/api/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  // Quick stats derived from bookings
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      upcoming: bookings.filter(b => b.status === 'confirmed' || b.status === 'accepted').length
    };  
  }, [bookings]);  

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
      <p className="text-sm font-medium">Loading your activity...</p>
    </div>    
  );
  


  return (
    <div className=" bg-[#F8FAFC] pb-12">
      <div className="max-w-screen mx-auto mt-3 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back {user.firstName}</h2>
          <p className="text-slate-500 text-sm">You have {stats.pending} pending requests currently.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="All Bookings" val={stats.total} icon={<Package size={18} />} color="indigo" />
          <StatCard label="Pending" val={stats.pending} icon={<Clock size={18} />} color="amber" />
          <StatCard label="Confirmed" val={stats.upcoming} icon={<Calendar size={18} />} color="blue" />
          <StatCard label="Completed" val={stats.completed} icon={<CheckCircle2 size={18} />} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-800">Recent Activity</h3>
              <NavLink to={'/userdashboard/userbookings'}><button className="text-xs font-bold text-indigo-600 hover:underline">View All</button></NavLink>
            </div>

            {bookings.length > 0 ? (
              bookings.slice(0, 5).map((booking, i) => (
                <BookingItem key={i} booking={booking} />
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <Search className="mx-auto text-slate-300 mb-4" size={40} />
                <p className="text-slate-500 font-medium">No bookings found</p>
                <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100">
                  Find a Service
                </button>
              </div>
            )}
          </div>



          <div className="space-y-6 mt-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden group">
              <div className="flex items-center justify-between mb-6 px-1">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Insights</h4>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-600 uppercase">System Online</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Active Protection</p>
                    <p className="text-[9px] font-medium text-slate-500">currently enabled</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-[11px] font-black text-slate-800 uppercase">Support Hours</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    09:00 - 21:00
                  </span>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button onClick={logoutHandler} className="w-full flex items-center justify-between p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all group/btn border border-transparent hover:border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover/btn:scale-110 transition-transform">
                        <LogOut size={14} className="group-hover/btn:rotate-12 transition-transform" />
                      </div>
                      <div className="text-left">
                        <span className="text-[11px] font-black uppercase tracking-widest block leading-none">Log Out</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-30 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingItem = ({ booking }) => {
  const statusStyles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-indigo-200 transition-all group">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          <Package size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{booking.serviceType || "Home Service"}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <Calendar size={10} /> {new Date(booking.createdAt).toLocaleDateString()}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusStyles[booking.status] || "bg-slate-50"}`}>
              {booking.status}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-black text-slate-900">₹{booking.totalAmount}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Paid via Online</p>
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

const StatCard = ({ label, val, icon, color }) => {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50"
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{val}</p>
    </div>
  );
};

export default UserDashboard;