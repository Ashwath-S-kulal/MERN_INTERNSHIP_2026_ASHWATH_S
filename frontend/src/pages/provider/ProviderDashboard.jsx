
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Wrench,
  ShieldCheck,
  Star,
  BarChart3,
  Search,
  Menu,
  X,
  LogOut,
  Bell,
  User,
  Settings,
  ChevronDown,
  LayoutGrid,
  Briefcase,
  IndianRupee,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { setUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "sonner";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
const { user } = useSelector(store => store.user) || {
     user: { _id: '123', fullname: 'Ravi Kumar', role: 'Master Plumber' }
   };

  const navItems = [
    { name: 'Dashboard', path: '/provider/dashboardpro', icon: <LayoutGrid size={20} /> },
    { name: 'Application', path: '/provider/applyforservice', icon: <LayoutGrid size={20} /> },
    { name: 'My Jobs', path: `/provider/myjob/${user?._id}`, icon: <Briefcase size={20} /> },
    { name: 'Earnings', path: '/provider/earnings', icon: <IndianRupee size={20} /> },
    { name: 'Messages', path: '/provider/messages', icon: <MessageSquare size={20} /> },
    { name: 'Reviews', path: '/provider/reviewspro', icon: <Star size={20} /> },
    { name: 'Profile', path: `/provider/profile/${user._id}`, icon: <User size={20} /> },
  ];

    const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `/api/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans text-slate-900 pt-16">
      
      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out transform
          lg:relative lg:translate-x-0 
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo */}
          

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto mt-10">
            <p className="px-3 mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) => `
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />}
                    <span className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {item.icon}
                    </span>
                    <span className="text-[14px]">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-slate-100">
            <button onClick={logoutHandler} className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
    

        {/* --- SCROLLABLE CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {/* Content injected here */}
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}