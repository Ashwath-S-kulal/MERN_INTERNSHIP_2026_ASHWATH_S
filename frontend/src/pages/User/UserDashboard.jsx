import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutGrid,
  Calendar,
  MapPin,
  MessageSquare,
  Star,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Zap,
  Settings,
  ArrowUpRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function AsymmetricUserLayout() {
  const { user: authUser } = useSelector(store => store.user);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (authUser?._id) {
          const res = await axios.get(`/api/user/getuserbyid/${authUser._id}`);
          if (res.data.success) {
            setUserDetails(res.data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching profile pic:", error);
      }
    };
    fetchUser();
  }, [authUser?._id]);

  const displayUser = userDetails || authUser;

  const navItems = [
    { name: 'Overview', path: '/userdashboard', icon: <LayoutGrid size={18} /> },
    { name: 'Tracking', path: '/userdashboard/userorders', icon: <MapPin size={18} /> },
    { name: 'Bookings', path: '/userdashboard/userbookings', icon: <Calendar size={18} /> },
    { name: 'Messages', path: '/userdashboard/usermessages', icon: <MessageSquare size={18} /> },
    { name: 'Reviews', path: '/userdashboard/userreviews', icon: <Star size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9] p-3 lg:p-5 font-sans overflow-hidden">

      <aside className="hidden lg:flex w-72 flex-col gap-4 mr-4 pt-16">
        <div className="bg-slate-900 rounded-xl p-8 text-white flex flex-col items-center text-center shadow-2xl shadow-slate-300">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-400 to-indigo-600 rotate-3 p-1">
              <img
                src={displayUser?.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                className="w-full h-full object-cover rounded-[20px] -rotate-3 border-2 border-slate-900"
                alt="profile"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900" />
          </div>

          <h2 className="text-xl font-black tracking-tight">{displayUser?.firstName || 'User'}</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Premium Member</p>

          <div className="mt-8 w-full space-y-2">
            <NavLink to={`/userdashboard/profile/${displayUser?._id}`} className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
              <span className="text-xs font-bold text-slate-300">Settings</span>
              <Settings size={14} className="text-slate-500 group-hover:rotate-90 transition-transform" />
            </NavLink>
            <button className="flex items-center justify-between w-full px-4 py-3 text-slate-500 hover:text-red-400 transition-colors text-xs font-bold">
              <span>Logout</span>
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-100">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-black text-slate-900 leading-tight">Become a<br />Service Partner</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-2">Verified experts earn 2x more. Start your journey.</p>
          </div>
          <NavLink to="/userdashboard/applyforservice" className="relative z-10 w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors">
            Apply Now <ArrowUpRight size={14} />
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 pt-16">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <nav className="px-8 py-4 border-b border-slate-50 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) => `
                   flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap
                   ${isActive
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-500 hover:bg-slate-100"}
                 `}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto lg:pt-3 p-8 lg:p-12 custom-scrollbar bg-[#F8FAFC]">
            <div className="max-w-screen">
              <div className="animate-in fade-in zoom-in-95 duration-500 ease-out rounded-xl">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center">
          <Zap size={24} />
        </button>
      </div>
    </div>
  );
}