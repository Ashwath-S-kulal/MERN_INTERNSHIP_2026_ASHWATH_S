import React from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";

export default function Navbar() {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

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

  const navLinkStyles = ({ isActive }) =>
    `px-3 py-1.5 rounded-md transition-all ${isActive
      ? "bg-zinc-100 text-black"
      : "text-zinc-500 hover:text-black hover:bg-zinc-50"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-screen mx-auto h-full grid grid-cols-3 items-center px-4">
        
        <div className="flex justify-start">
          <Link to="/" className="group flex items-center gap-2.5 outline-none">
            <div className="w-9 h-9 bg-zinc-900 group-hover:bg-blue-600 transition-colors duration-300 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black tracking-tight text-zinc-900 text-base">
                SERVICE<span className="text-blue-600">MATE</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">
                Platform
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex justify-center">
          <ul className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
            <li>
              <NavLink to="/" className={navLinkStyles}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/service" className={navLinkStyles}>
                Services
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-3">
          {user ? (
            <div className="flex items-center bg-zinc-100/50 p-1 rounded-full border border-zinc-200 shadow-inner">
              <NavLink
                to={
                  user.role === "admin"
                    ? "/dashboard/request"
                    : user.role === "provider"
                    ? "/provider/dashboardpro"
                    : `/userdashboard`
                }
                className={({ isActive }) =>
                  `flex items-center gap-2 pr-3 transition-all ${
                    isActive ? "text-blue-600" : "text-zinc-600"
                  }`
                }
              >
                <img
                  src={
                    user.profilePic ||
                    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                  }
                  alt="profile"
                  className="w-8 h-8 rounded-full border border-white shadow-sm object-cover"
                />
                <span className="text-xs font-semibold hidden sm:block truncate max-w-[80px]">
                  {user.firstName?.split(" ")[0] || "Account"}
                </span>
              </NavLink>

              <div className="h-4 w-[1px] bg-zinc-300 mx-1" />

              <button
                onClick={logoutHandler}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-white rounded-full transition-all duration-200"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:block text-xs font-bold px-4 text-zinc-600 hover:text-black transition-colors"
              >
                Log In
              </Link>
              <Link to="/signup">
                <Button className="h-9 text-xs px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-md shadow-blue-100">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          <button className="lg:hidden p-2 text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}