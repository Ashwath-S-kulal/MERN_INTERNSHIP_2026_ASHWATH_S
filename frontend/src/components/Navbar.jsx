import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, X, Home, Briefcase, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import logo from "../assets/logo1.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `/api/user/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinkStyles = ({ isActive }) =>
    `px-4 py-2 md:py-1.5 rounded-md transition-all flex items-center gap-3 md:block ${isActive
      ? "bg-blue-50 md:bg-zinc-100 text-blue-600 md:text-black"
      : "text-zinc-600 md:text-zinc-500 hover:text-black hover:bg-zinc-50"
    }`;

  const dashboardRoute = user?.role === "admin"
    ? "/dashboard/request"
    : user?.role === "provider"
      ? "/provider/dashboardpro"
      : "/userdashboard/overview";

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-[100] w-full h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-4">
        <div className="max-w-screen mx-3 h-full flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <Link to="/" className="group flex items-center gap-2.5 outline-none">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform overflow-hidden">
                <img
                  src={logo}
                  alt="ServiceMate Helper Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black tracking-tight text-zinc-900 text-sm md:text-base">
                  SERVICE<span className="text-blue-600">MATE</span>
                </span>
                <span className="hidden xs:block text-[9px] text-zinc-400 font-medium tracking-widest uppercase">
                  Platform
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide">
              <li><NavLink to="/" className={navLinkStyles}>Home</NavLink></li>
              <li><NavLink to="/service" className={navLinkStyles}>Services</NavLink></li>
            </ul>
          </nav>

          <div className="flex-1 flex items-center justify-end gap-2 md:gap-3">
            {user ? (
              <div className="flex items-center bg-zinc-100/80 p-1 rounded-full border border-zinc-200">
                <NavLink to={dashboardRoute} className="flex items-center gap-2 pr-2 transition-all">
                  <img
                    src={user.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                    alt="profile"
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white object-cover"
                  />
                  <span className="text-xs font-semibold hidden lg:block truncate max-w-[70px]">
                    {user.firstName || "Account"}
                  </span>
                </NavLink>
                <div className="h-4 w-[px] bg-zinc-300 mx-1 hidden sm:block" />
                <button
                  onClick={logoutHandler}
                  className="hidden sm:flex p-1.5 text-zinc-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block text-xs font-bold px-3 text-zinc-600 hover:text-black">
                  Log In
                </Link>
                <Link to="/signup">
                  <Button className="h-8 md:h-9 text-[11px] md:text-xs px-4 md:px-5 bg-blue-600 rounded-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[90] md:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMenu} />
        <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl p-6 flex flex-col">
          <div className="mt-16 flex flex-col gap-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-4">Menu</p>
            <NavLink to="/" onClick={toggleMenu} className={navLinkStyles}>
              <Home size={18} /> Home
            </NavLink>
            <NavLink to="/service" onClick={toggleMenu} className={navLinkStyles}>
              <Briefcase size={18} /> Services
            </NavLink>

            {user && (
              <>
                <div className="h-px bg-zinc-100 my-2" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-4">Account</p>
                <NavLink to={dashboardRoute} onClick={toggleMenu} className={navLinkStyles}>
                  <LayoutDashboard size={18} /> Dashboard
                </NavLink>
                <button
                  onClick={() => { logoutHandler(); toggleMenu(); }}
                  className="flex items-center gap-3 px-4 py-2 text-red-500 font-medium hover:bg-red-50 rounded-md transition-all"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}