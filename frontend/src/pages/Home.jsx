import React, { useState, useCallback, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Clock, ChevronRight, Loader2, User, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { setUser } from '@/redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Loader from '../components/Loading';

const Homepage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user || {});
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchuserbyid = useCallback(async () => {
    const activeUserId = user?._id || localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');
    if (!activeUserId || !token) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/user/getuserbyid/${activeUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const freshUser = res.data.user;
        if (!user || user.role !== freshUser.role) {
          dispatch(setUser(freshUser));
        }
      }
    } catch (error) {
      console.error("User Sync Error:", error);
    }
  }, [dispatch, user]);

  const fetchServices = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/user/getallservices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawData = Array.isArray(res.data) ? res.data : (res.data.services || []);

      const sorted = [...rawData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setServices(sorted.slice(0, 4));
    } catch (err) {
      console.error("Fetch Services Error:", err);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await fetchuserbyid();
      await fetchServices();
      setLoading(false);
    };
    initFetch();

    const interval = setInterval(fetchuserbyid, 60000);
    return () => clearInterval(interval);
  }, [fetchuserbyid]);

  if (loading) return <Loader />


  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="relative bg-blue-50 pt-32 md:pt-44 pb-20 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Expert Help, <br />
              <span className="text-blue-600">Just a Tap Away.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Book trusted local professionals for cleaning, plumbing, repairs, and more.
              Transparent pricing. Verified pros.
            </p>
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex -space-x-3 overflow-hidden p-1">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                      src={`https://i.pravatar.cc/150?u=${i}`}
                      alt="User"
                    />
                  ))}
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 ring-2 ring-white text-[10px] font-bold text-slate-500">
                    +10k
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <p className="text-xs font-medium text-slate-500">Join our growing community</p>
                </div>
              </div>

              <NavLink to="/service">
                <button className="cursor-pointer w-full lg:w-auto px-10 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 text-sm whitespace-nowrap">
                  Browse Services
                </button>
              </NavLink>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <img
                src="https://thumbs.dreamstime.com/b/giving-helping-hand-hands-man-woman-reaching-to-each-other-support-rescue-gesture-lending-solidarity-compassion-296184706.jpg"
                alt="Professional Service"
                className="rounded-2xl shadow-2xl w-full max-w-md object-cover h-[400px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <ShieldCheck className="text-emerald-600" size={28} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Status</p>
                  <p className="font-black text-slate-900">100% Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-24 px-6   max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-blue-600 font-bold text-[10px] md:text-xs uppercase tracking-widest">New on Platform</span>
            <h2 className="text-xl md:text-4xl font-black text-zinc-900 mt-1">New Service Providers</h2>
          </div>
          <Link to="/service" className="text-zinc-900 font-bold flex items-center gap-1 hover:text-blue-600 transition-colors">
            View All <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.length > 0 ? services.map((item) => (
            <div key={item._id} className="group bg-white border border-zinc-100 rounded-md p-4 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="relative mb-5">
                <img
                  onClick={() => navigate(`/service/${item._id}`)}
                  src={item.images?.[0].url || "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=400"}
                  className="w-full h-52 object-cover rounded-md"
                  alt="provider"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-blue-600 uppercase shadow-sm">
                  {item.services?.[0] || "General"}
                </div>
              </div>
              <h3 className="font-bold text-zinc-900 text-lg px-1 truncate">
                {item?.title || "Professional Pro"}
              </h3>
              <p className="text-sm text-zinc-500 px-1 mb-4 flex items-center gap-1">
                <MapPin size={14} className="text-blue-500" /> {item.city || "Nearby"}
              </p>
              <div className="flex items-center justify-between mt-auto p-2 bg-zinc-50 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Rate</span>
                  <span className="text-base font-black text-zinc-900">₹{item.pricing?.rate || 0} <span className='text-xs font-bold text-gray-600'>/{item.pricing?.unit || 'hr'}</span></span>
                </div>
                <button onClick={() => navigate(`/service/${item._id}`)}
                  className="bg-zinc-900 text-white px-5 py-2 rounded-xs text-xs font-bold hover:bg-blue-600 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-10 text-center text-zinc-400 italic">No recent providers found.</div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 border-y border-indigo-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black tracking-widest text-indigo-500 uppercase mb-2">Simple Process</p>
            <h2 className="text-4xl font-black text-gray-900">How It Works</h2>
            <p className="text-gray-500 text-sm mt-2">From search to service in 4 easy steps</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Search />, step: "1", title: "Choose Service", desc: "Browse home services and pick what you need" },
              { icon: <Calendar />, step: "2", title: "Pick a Slot", desc: "Select your preferred date & time" },
              { icon: <User />, step: "3", title: "Pro Arrives", desc: "Verified expert comes to your doorstep" },
              { icon: <Check />, step: "4", title: "Pay & Rate", desc: "Pay after completion, rate your pro" },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[65%] w-[70%] h-0.5 bg-gradient-to-r from-indigo-200 to-violet-200 z-0" />}
                <div className="relative z-10 w-16 h-16 bg-white border-2 border-indigo-200 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-md group-hover:scale-110 group-hover:border-indigo-500 group-hover:shadow-lg transition-all">
                  {item.icon}
                </div>
                <div className="text-xs font-black text-indigo-400 mb-1 tracking-widest">STEP {item.step}</div>
                <h3 className="font-black text-gray-900 mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;